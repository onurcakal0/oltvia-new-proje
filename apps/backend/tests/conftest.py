"""Test ortamı: izole geçici SQLite, sabit test anahtarı, demo seed açık."""
import os
import sys
import tempfile
from pathlib import Path

import pytest

_TMP_DIR = tempfile.mkdtemp(prefix="oltvia-test-")
os.environ["ENVIRONMENT"] = "development"
os.environ["SECRET_KEY"] = "test-secret-key-for-pytest-only-0123456789abcdef"
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{Path(_TMP_DIR, 'test.db').as_posix()}"
os.environ["SEED_DEMO_DATA"] = "true"
os.environ["EXPOSE_DEMO_OTP"] = "true"

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient  # noqa: E402

from app.core.config import settings  # noqa: E402
from app.core.rate_limit import limiter  # noqa: E402
from app.main import app  # noqa: E402

SCHOOL = "IST-1094"
DEMO_PASSWORD = "oltvia2026"
TEST_SECRET = os.environ["SECRET_KEY"]


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:  # lifespan -> tablolar + demo seed
        yield c


@pytest.fixture(autouse=True)
def _reset_state(monkeypatch):
    limiter.reset()
    monkeypatch.setattr(settings, "EXPOSE_DEMO_OTP", True)
    yield
    limiter.reset()


def login(client, role="ogrenci", identifier="20261048", password=DEMO_PASSWORD, school_code=SCHOOL):
    payload = {"role": role, "identifier": identifier, "password": password}
    if school_code is not None:
        payload["school_code"] = school_code
    return client.post("/api/v1/auth/login", json=payload)


def auth_header(client, **kwargs):
    res = login(client, **kwargs)
    assert res.status_code == 200, res.text
    return {"Authorization": f"Bearer {res.json()['access_token']}"}
