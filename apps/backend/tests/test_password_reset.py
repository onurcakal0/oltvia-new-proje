import asyncio
from datetime import datetime, timedelta, timezone

from sqlalchemy import update

from app.core.config import settings
from app.db.session import AsyncSessionLocal
from app.models.otp import PasswordResetOTP
from tests.conftest import DEMO_PASSWORD, login

BASE = "/api/v1/auth/forgot-password"
TEACHER = "ogretmen@fenlisesi.k12.tr"


def send(client, contact=TEACHER, method="email", school_code="IST-1094"):
    return client.post(f"{BASE}/send-otp", json={"method": method, "contact": contact, "school_code": school_code})


def verify(client, code, contact=TEACHER):
    return client.post(f"{BASE}/verify-otp", json={"contact": contact, "code": code})


def reset(client, token, new_password):
    return client.post(f"{BASE}/reset", json={"reset_token": token, "new_password": new_password})


def _wrong(code: str) -> str:
    return f"{(int(code) + 1) % 1_000_000:06d}"


def _expire_all_codes():
    async def run():
        async with AsyncSessionLocal() as s:
            await s.execute(
                update(PasswordResetOTP).values(expires_at=datetime.now(timezone.utc) - timedelta(seconds=1))
            )
            await s.commit()

    asyncio.run(run())


def test_demo_code_not_exposed_when_disabled(client, monkeypatch):
    monkeypatch.setattr(settings, "EXPOSE_DEMO_OTP", False)
    res = send(client)
    assert res.status_code == 200
    assert res.json()["demo_code"] is None


def test_unknown_contact_gets_identical_response(client, monkeypatch):
    monkeypatch.setattr(settings, "EXPOSE_DEMO_OTP", False)
    known = send(client).json()
    unknown = send(client, contact="yok@fenlisesi.k12.tr").json()
    for key in ("success", "message", "method", "expires_in_seconds", "demo_code"):
        assert known[key] == unknown[key]


def test_unknown_contact_never_issues_code(client):
    assert send(client, contact="yok@fenlisesi.k12.tr").json()["demo_code"] is None


def test_full_reset_flow_and_token_single_use(client):
    code = send(client).json()["demo_code"]
    assert code and len(code) == 6 and code.isdigit()

    v = verify(client, code)
    assert v.status_code == 200
    token = v.json()["reset_token"]

    assert reset(client, token, "YeniSifre2026").status_code == 200
    # Token ikinci kez kullanılamaz
    assert reset(client, token, "BaskaSifre2026").status_code == 400
    # Doğrulanmış kod tekrar kullanılamaz
    assert verify(client, code).status_code == 400

    assert login(client, role="ogretmen", identifier=TEACHER, password="YeniSifre2026").status_code == 200
    assert login(client, role="ogretmen", identifier=TEACHER, password=DEMO_PASSWORD).status_code == 401

    # Demo şifresini geri yükle (diğer testler için)
    code = send(client).json()["demo_code"]
    token = verify(client, code).json()["reset_token"]
    assert reset(client, token, DEMO_PASSWORD).status_code == 200


def test_code_burned_after_max_failed_attempts(client):
    code = send(client).json()["demo_code"]
    for _ in range(settings.OTP_MAX_ATTEMPTS):
        assert verify(client, _wrong(code)).status_code == 400
    # Deneme hakkı bitti: doğru kod da artık geçersiz
    assert verify(client, code).status_code == 400


def test_new_code_invalidates_previous_code(client):
    first = send(client).json()["demo_code"]
    second = send(client).json()["demo_code"]
    if first != second:
        assert verify(client, first).status_code == 400
    assert verify(client, second).status_code == 200


def test_expired_code_rejected(client):
    code = send(client).json()["demo_code"]
    _expire_all_codes()
    assert verify(client, code).status_code == 400


def test_expired_reset_token_rejected(client):
    code = send(client).json()["demo_code"]
    token = verify(client, code).json()["reset_token"]
    _expire_all_codes()
    assert reset(client, token, "YeniSifre2026").status_code == 400


def test_reset_rejects_weak_password(client):
    code = send(client).json()["demo_code"]
    token = verify(client, code).json()["reset_token"]
    assert reset(client, token, "123").status_code == 422


def test_reset_with_forged_token_rejected(client):
    assert reset(client, "x" * 43, "YeniSifre2026").status_code == 400


def test_phone_reset_flow_for_parent(client):
    code = send(client, contact="+90 532 123 45 67", method="phone", school_code=None).json()["demo_code"]
    assert code
    assert verify(client, code, contact="05321234567").status_code == 200


def test_invalid_method_rejected(client):
    assert send(client, method="carrier-pigeon").status_code == 422


def test_send_otp_rate_limited_per_contact(client):
    codes = [send(client).status_code for _ in range(4)]
    assert codes == [200, 200, 200, 429]
