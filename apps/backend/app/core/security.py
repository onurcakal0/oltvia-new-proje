import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import bcrypt
import jwt

from app.core.config import settings

# bcrypt yalnızca ilk 72 byte'ı kullanır; daha uzun parolalar şema seviyesinde reddedilir.
BCRYPT_MAX_BYTES = 72


class InvalidTokenError(Exception):
    """JWT doğrulanamadığında fırlatılır."""


def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except ValueError:
        # Bozuk hash veya 72 byte üstü parola
        return False


# Kullanıcı bulunamadığında da bcrypt çalıştırılarak yanıt süresi üzerinden
# kullanıcı varlığının tespit edilmesi (timing-based enumeration) zorlaştırılır.
_DUMMY_HASH = get_password_hash(secrets.token_urlsafe(16))


def verify_password_or_dummy(plain_password: str, hashed_password: Optional[str]) -> bool:
    if hashed_password is None:
        verify_password(plain_password, _DUMMY_HASH)
        return False
    return verify_password(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": now})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
            options={"require": ["exp", "sub"]},
        )
    except jwt.PyJWTError as exc:
        raise InvalidTokenError(str(exc)) from exc
    return payload


def hash_secret(value: str) -> str:
    """OTP kodları ve sıfırlama token'ları için anahtarlı (HMAC-SHA256) hash.

    Veritabanı sızsa bile kodlar/token'lar düz metin olarak okunamaz; SECRET_KEY olmadan
    6 haneli kodlar için önceden hesaplanmış tablo da kullanılamaz.
    """
    return hmac.new(settings.SECRET_KEY.encode("utf-8"), value.encode("utf-8"), hashlib.sha256).hexdigest()


def secrets_equal(a: str, b: str) -> bool:
    return hmac.compare_digest(a, b)
