from pydantic import BaseModel, EmailStr
from typing import Optional

# Token şeması
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Kullanıcı profili detayı (Giriş sonrası frontend için)
class UserProfile(BaseModel):
    id: int
    full_name: Optional[str] = None
    role: str
    email: Optional[str] = None
    student_number: Optional[str] = None
    phone_number: Optional[str] = None
    tenant_name: Optional[str] = None
    tenant_code: Optional[str] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile

# Rol Tabanlı Giriş İsteği
class LoginRequest(BaseModel):
    role: str = "ogrenci" # 'ogrenci', 'ogretmen', 'veli', 'idare'
    school_code: Optional[str] = None # 'IST-1094' vb.
    identifier: Optional[str] = None # E-posta, Öğrenci No, T.C. veya Telefon
    email: Optional[str] = None
    student_number: Optional[str] = None
    phone: Optional[str] = None
    password: str

    @property
    def target_identifier(self) -> str:
        val = self.identifier or self.email or self.student_number or self.phone or ""
        return val.strip()

# Eski UserCreate & UserResponse (Geriye dönük uyumluluk)
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    tenant_id: Optional[str] = None
    role: Optional[str] = "ogretmen"
    full_name: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: str
    is_active: bool

    class Config:
        from_attributes = True

# Şifremi Unuttum OTP Şemaları
class SendOtpRequest(BaseModel):
    method: str = "email" # 'email' veya 'phone'
    contact: str          # e-posta veya telefon
    school_code: Optional[str] = None

class SendOtpResponse(BaseModel):
    success: bool
    message: str
    contact: str
    method: str
    expires_in_seconds: int = 120
    demo_code: Optional[str] = None # Geliştirme ortamında ekranda kolay deneme için

class VerifyOtpRequest(BaseModel):
    contact: str
    code: str

class VerifyOtpResponse(BaseModel):
    success: bool
    reset_token: str
    message: str

class ResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str

class ResetPasswordResponse(BaseModel):
    success: bool
    message: str
