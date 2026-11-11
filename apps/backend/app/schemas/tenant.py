from datetime import datetime
from uuid import UUID
from typing import Optional
from pydantic import BaseModel, Field, field_validator
import re

class SchoolCreate(BaseModel):
    school_name: str = Field(..., min_length=2, max_length=255, description="Kurumun / Okulun tam adı")
    school_code: str = Field(..., min_length=2, max_length=50, description="Benzersiz kurum kodu (Örn: ist_fen_101)")
    initial_admin_password: str = Field(..., min_length=6, max_length=128, description="Okul yöneticisi ilk şifresi")
    admin_email: Optional[str] = Field(None, description="Opsiyonel okul admin e-posta adresi")

    @field_validator("school_code")
    @classmethod
    def validate_school_code(cls, v: str) -> str:
        cleaned = v.strip().lower()
        if not re.match(r"^[a-z0-9_]+$", cleaned):
            raise ValueError("Okul kodu sadece küçük harf (a-z), rakam (0-9) ve alt çizgi (_) içerebilir.")
        if cleaned[0].isdigit():
            raise ValueError("Okul kodu rakam ile başlayamaz.")
        return cleaned

class SchoolResponse(BaseModel):
    id: UUID
    school_name: str
    school_code: str
    schema_name: str
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True
