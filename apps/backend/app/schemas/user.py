import uuid
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.core.security import BCRYPT_MAX_BYTES

RoleType = Literal["ogrenci", "ogretmen", "veli", "idare"]
PASSWORD_MIN_LENGTH = 8


def _validate_new_password(value: str) -> str:
    if len(value) < PASSWORD_MIN_LENGTH:
        raise ValueError(f"Şifreniz en az {PASSWORD_MIN_LENGTH} karakter olmalıdır.")
    if len(value.encode("utf-8")) > BCRYPT_MAX_BYTES:
        raise ValueError(f"Şifreniz en fazla {BCRYPT_MAX_BYTES} byte olabilir.")
    if value != value.strip():
        raise ValueError("Şifre başında veya sonunda boşluk içeremez.")
    return value


# Token şeması
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Kullanıcı profili detayı (Giriş sonrası frontend için)
class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: Optional[str] = None
    role: str
    email: Optional[str] = None
    student_number: Optional[str] = None
    phone_number: Optional[str] = None
    tenant_name: Optional[str] = None
    tenant_code: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile


# Rol Tabanlı Giriş İsteği
class LoginRequest(BaseModel):
    role: str = Field(default="ogrenci", max_length=20)  # 'ogrenci', 'ogretmen', 'veli', 'idare'
    school_code: Optional[str] = Field(default=None, max_length=50)
    identifier: Optional[str] = Field(default=None, max_length=255)  # E-posta, Öğrenci No, T.C. veya Telefon
    email: Optional[str] = Field(default=None, max_length=255)
    student_number: Optional[str] = Field(default=None, max_length=50)
    phone: Optional[str] = Field(default=None, max_length=30)
    password: str = Field(min_length=1, max_length=128)

    @property
    def target_identifier(self) -> str:
        val = self.identifier or self.email or self.student_number or self.phone or ""
        return val.strip()


# Yönetici tarafından kullanıcı oluşturma
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(max_length=128)
    tenant_id: Optional[uuid.UUID] = None
    role: RoleType = "ogretmen"
    full_name: Optional[str] = Field(default=None, max_length=255)

    _check_password = field_validator("password")(_validate_new_password)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: str
    is_active: bool


# Şifremi Unuttum OTP Şemaları
class SendOtpRequest(BaseModel):
    method: Literal["email", "phone"] = "email"
    contact: str = Field(min_length=1, max_length=255)  # e-posta veya telefon
    school_code: Optional[str] = Field(default=None, max_length=50)


class SendOtpResponse(BaseModel):
    success: bool
    message: str
    contact: str
    method: str
    expires_in_seconds: int = 120
    # Yalnızca EXPOSE_DEMO_OTP açıkken (yerel geliştirme) doldurulur
    demo_code: Optional[str] = None


class VerifyOtpRequest(BaseModel):
    contact: str = Field(min_length=1, max_length=255)
    code: str = Field(pattern=r"^\s*\d{6}\s*$")


class VerifyOtpResponse(BaseModel):
    success: bool
    reset_token: str
    message: str


class ResetPasswordRequest(BaseModel):
    reset_token: str = Field(min_length=1, max_length=128)
    new_password: str = Field(max_length=128)

    _check_password = field_validator("new_password")(_validate_new_password)


class ResetPasswordResponse(BaseModel):
    success: bool
    message: str
