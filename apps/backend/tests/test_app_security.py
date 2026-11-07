import os
import subprocess
import sys
from pathlib import Path

import pytest

from app.core.config import Settings

BACKEND = Path(__file__).resolve().parents[1]


def test_security_headers_on_api(client):
    res = client.get("/api/v1/auth/me")
    assert res.headers["X-Content-Type-Options"] == "nosniff"
    assert res.headers["X-Frame-Options"] == "DENY"
    assert res.headers["Cache-Control"] == "no-store"


def test_cors_allows_configured_origin_only(client):
    ok = client.options(
        "/api/v1/auth/login",
        headers={"Origin": "http://localhost:3005", "Access-Control-Request-Method": "POST"},
    )
    assert ok.headers.get("access-control-allow-origin") == "http://localhost:3005"
    assert "access-control-allow-credentials" not in ok.headers

    evil = client.options(
        "/api/v1/auth/login",
        headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "POST"},
    )
    assert evil.headers.get("access-control-allow-origin") is None


def test_root_does_not_advertise_docs(client):
    assert "docs" not in client.get("/").json()


def test_production_requires_secret_key():
    with pytest.raises(Exception, match="SECRET_KEY"):
        Settings(ENVIRONMENT="production", SECRET_KEY=None, _env_file=None)


def test_production_rejects_short_secret_key():
    with pytest.raises(Exception, match="SECRET_KEY"):
        Settings(ENVIRONMENT="production", SECRET_KEY="short", _env_file=None)


def test_production_cannot_expose_demo_otp():
    with pytest.raises(Exception, match="EXPOSE_DEMO_OTP"):
        Settings(ENVIRONMENT="production", SECRET_KEY="x" * 40, EXPOSE_DEMO_OTP=True, _env_file=None)


def test_production_defaults_are_safe():
    s = Settings(ENVIRONMENT="production", SECRET_KEY="x" * 40, SEED_DEMO_DATA=None, EXPOSE_DEMO_OTP=None, _env_file=None)
    assert s.SEED_DEMO_DATA is False
    assert s.EXPOSE_DEMO_OTP is False


def test_development_defaults():
    s = Settings(ENVIRONMENT="development", SECRET_KEY=None, SEED_DEMO_DATA=None, EXPOSE_DEMO_OTP=None, _env_file=None)
    assert s.SEED_DEMO_DATA is True and s.EXPOSE_DEMO_OTP is True


# --- Production modu: ayrı süreçte (modül seviyesindeki settings yeniden yüklensin diye) ---

_PROD_SCRIPT = """
from fastapi.testclient import TestClient
from app.main import app
with TestClient(app) as c:
    assert c.get('/docs').status_code == 404
    assert c.get('/openapi.json').status_code == 404
    r = c.get('/api/v1/auth/me')
    assert r.headers['Strict-Transport-Security'].startswith('max-age=')
    # Demo kurum/hesaplar production'da oluşturulmaz
    r = c.post('/api/v1/auth/login', json={'role': 'ogrenci', 'school_code': 'IST-1094',
                                           'identifier': '20261048', 'password': 'oltvia2026'})
    assert r.status_code == 404, r.status_code
print('OK')
"""


def _run_prod(env_overrides, tmp_path):
    env = {k: v for k, v in os.environ.items() if k not in ("SEED_DEMO_DATA", "EXPOSE_DEMO_OTP")}
    env["DATABASE_URL"] = f"sqlite+aiosqlite:///{(tmp_path / 'prod.db').as_posix()}"
    env["PYTHONIOENCODING"] = "utf-8"
    env.update(env_overrides)
    return subprocess.run(
        [sys.executable, "-c", _PROD_SCRIPT], cwd=BACKEND, env=env, capture_output=True, text=True,
        encoding="utf-8", timeout=120,
    )


def test_production_mode_hardening(tmp_path):
    res = _run_prod({"ENVIRONMENT": "production", "SECRET_KEY": "p" * 48}, tmp_path)
    assert res.returncode == 0, res.stderr
    assert "OK" in res.stdout


def test_production_refuses_to_start_without_secret(tmp_path):
    res = _run_prod({"ENVIRONMENT": "production", "SECRET_KEY": ""}, tmp_path)
    assert res.returncode != 0
    assert "SECRET_KEY" in res.stderr
