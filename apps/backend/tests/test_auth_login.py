from datetime import datetime, timedelta, timezone

import jwt
import pytest

from app.core.config import settings
from tests.conftest import TEST_SECRET, auth_header, login


@pytest.mark.parametrize(
    "role,identifier,school_code",
    [
        ("ogrenci", "20261048", "IST-1094"),
        ("ogretmen", "ogretmen@fenlisesi.k12.tr", "IST-1094"),
        ("idare", "IDARE@fenlisesi.k12.tr", "ist-1094"),
        ("veli", "0532 123 45 67", None),
    ],
)
def test_login_success_for_each_role(client, role, identifier, school_code):
    res = login(client, role=role, identifier=identifier, school_code=school_code)
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["user"]["role"] == role
    assert "hashed_password" not in body["user"]
    claims = jwt.decode(body["access_token"], settings.SECRET_KEY, algorithms=["HS256"])
    assert claims["role"] == role and "exp" in claims and "iat" in claims


def test_login_wrong_password(client):
    assert login(client, password="yanlis-sifre").status_code == 401


def test_login_unknown_user_same_error_as_wrong_password(client):
    a = login(client, identifier="99999999")
    b = login(client, password="yanlis-sifre")
    assert a.status_code == b.status_code == 401
    assert a.json() == b.json()


def test_login_unknown_school_does_not_reflect_input(client):
    res = login(client, school_code="<script>X</script>")
    assert res.status_code == 404
    assert "<script>" not in res.text


def test_login_requires_school_code(client):
    assert login(client, school_code=None).status_code == 400


def test_login_invalid_role_rejected_without_reflection(client):
    res = login(client, role="superadmin<b>")
    assert res.status_code == 400
    assert "superadmin" not in res.text


def test_login_rejects_oversized_password(client):
    assert login(client, password="a" * 5000).status_code == 422


def test_login_rate_limited_per_identity(client):
    codes = [login(client, password=f"wrong-{i}").status_code for i in range(11)]
    assert codes[:10] == [401] * 10
    assert codes[10] == 429


def test_me_requires_token(client):
    assert client.get("/api/v1/auth/me").status_code == 401


def test_me_with_valid_token(client):
    res = client.get("/api/v1/auth/me", headers=auth_header(client))
    assert res.status_code == 200
    assert res.json()["student_number"] == "20261048"
    assert res.json()["tenant_code"] == "IST-1094"


def _future():
    return datetime.now(timezone.utc) + timedelta(hours=1)


@pytest.mark.parametrize(
    "token",
    [
        "garbage",
        jwt.encode({"sub": "1", "exp": _future()}, "wrong-key-wrong-key-wrong-key-123", algorithm="HS256"),
        jwt.encode({"sub": "not-an-int", "exp": _future()}, TEST_SECRET, algorithm="HS256"),
        jwt.encode({"sub": "1"}, TEST_SECRET, algorithm="HS256"),
        jwt.encode({"sub": "1", "exp": datetime.now(timezone.utc) - timedelta(minutes=1)}, TEST_SECRET, algorithm="HS256"),
        jwt.encode({"sub": "1", "exp": _future()}, None, algorithm="none"),
    ],
    ids=["garbage", "forged-signature", "non-int-sub", "no-exp", "expired", "alg-none"],
)
def test_me_rejects_bad_tokens(client, token):
    res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 401
