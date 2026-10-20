import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean, Uuid
from sqlalchemy.orm import relationship
from .base import Base

class Tenant(Base):
    __tablename__ = "tenants"

    # Benzersiz ve tahmin edilemez Tenant ID (SQLAlchemy 2.0 Uuid destekli)
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Okul / Kurum Kodu (Örn: IST-1094)
    code = Column(String(50), unique=True, index=True, nullable=False)
    
    # Kurum Adı (Örn: İstanbul Atatürk Fen Lisesi)
    name = Column(String(255), index=True, nullable=False)
    
    # SaaS Vizyonu: Okullara özel alt alan adı (subdomain) verebilmek için
    domain = Column(String(255), unique=True, index=True, nullable=True)
    
    # Şehir / Lokasyon
    city = Column(String(100), nullable=True, default="İstanbul")
    
    # Kurumun üyeliği aktif mi? (Abonelik durdurulursa False yapılır)
    is_active = Column(Boolean, default=True)
    
    # Sisteme ne zaman kayıt oldular ve en son ne zaman güncellendiler?
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Çift yönlü ilişki: Bu tenant silinirse, altındaki tüm kullanıcıları da temizle (cascade)
    users = relationship("User", back_populates="tenant", cascade="all, delete-orphan")