import uuid

from tests.conftest import auth_header

URL = "/api/v1/auth/register"


def _payload(**overrides):
    data = {
        "email": f"yeni-{uuid.uuid4().hex[:8]}@fenlisesi.k12.tr",
        "password": "GucluSifre123",
        "role": "ogretmen",
        "full_name": "Yeni Öğretmen",
    }
    data.update(overrides)
    return data


def _admin(client):
    return auth_header(client, role="idare", identifier="idare@fenlisesi.k12.tr")


def test_register_requires_authentication(client):
    assert client.post(URL, json=_payload()).status_code == 401


def test_register_anonymous_cannot_create_admin(client):
    assert client.post(URL, json=_payload(role="idare")).status_code == 401


def test_student_cannot_register_users(client):
    assert client.post(URL, json=_payload(), headers=auth_header(client)).status_code == 403


def test_teacher_cannot_register_users(client):
    headers = auth_header(client, role="ogretmen", identifier="ogretmen@fenlisesi.k12.tr")
    assert client.post(URL, json=_payload(), headers=headers).status_code == 403


def test_admin_cannot_register_into_other_tenant(client):
    res = client.post(URL, json=_payload(tenant_id=str(uuid.uuid4())), headers=_admin(client))
    assert res.status_code == 403


def test_admin_cannot_create_another_admin(client):
    assert client.post(URL, json=_payload(role="idare"), headers=_admin(client)).status_code == 403


def test_admin_registers_teacher_in_own_tenant_and_teacher_can_login(client):
    headers = _admin(client)
    data = _payload(email="Yeni.Ogretmen@FenLisesi.k12.tr")
    res = client.post(URL, json=data, headers=headers)
    assert res.status_code == 201, res.text
    assert res.json()["role"] == "ogretmen"
    assert "hashed_password" not in res.json()

    login = client.post(
        "/api/v1/auth/login",
        json={
            "role": "ogretmen",
            "school_code": "IST-1094",
            "identifier": "yeni.ogretmen@fenlisesi.k12.tr",
            "password": data["password"],
        },
    )
    assert login.status_code == 200
    # Aynı e-posta ikinci kez kaydedilemez
    assert client.post(URL, json=data, headers=headers).status_code == 400


def test_register_rejects_weak_password(client):
    assert client.post(URL, json=_payload(password="123"), headers=_admin(client)).status_code == 422


def test_register_rejects_unknown_role(client):
    assert client.post(URL, json=_payload(role="root"), headers=_admin(client)).status_code == 422
