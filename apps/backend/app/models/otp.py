import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.models.base import Base

class PasswordResetOTP(Base):
    __tablename__ = "password_reset_otps"

    id = Column(Integer, primary_key=True, index=True)
    
    # E-posta adresi veya telefon numarası
    contact = Column(String(255), index=True, nullable=False)
    
    # Doğrulama türü: 'email' veya 'phone'
    method = Column(String(20), nullable=False, default="email")
    
    # 6 haneli doğrulama kodu (örn: "482916")
    code = Column(String(10), nullable=False)
    
    # Kod doğrulandıktan sonra şifre sıfırlama için üretilen tek kullanımlık token
    reset_token = Column(String(64), unique=True, index=True, nullable=True)
    
    # Kodun son geçerlilik tarihi (varsayılan: 2 dakika)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    
    # Kod doğrulandı mı?
    is_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    @property
    def is_expired(self) -> bool:
        if self.expires_at is None:
            return True
        exp = self.expires_at
        now = datetime.now(timezone.utc)
        if exp.tzinfo is None:
            now = datetime.utcnow()
        return now > exp

