from pydantic import BaseModel, EmailStr
from typing import Optional

# Token şeması (Başarılı girişte frontend'e dönecek cevap)
class Token(BaseModel):
    access_token: str
    token_type: str

# Kullanıcı kayıt olurken beklediğimiz veri
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    tenant_id: Optional[int] = None

# İşlem başarılı olduğunda veya profil çekildiğinde frontend'e dönecek yapı
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    tenant_id: Optional[int]
    is_active: bool

    class Config:
        from_attributes = True # SQLAlchemy modelini Pydantic'e dönüştürür
