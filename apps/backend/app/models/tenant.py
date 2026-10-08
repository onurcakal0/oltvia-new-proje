import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import Base

class Tenant(Base):
    __tablename__ = "tenants"

    # Benzersiz ve tahmin edilemez Tenant ID
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, index=True, nullable=False)
    
    # SaaS Vizyonu: Okullara özel alt alan adı (subdomain) verebilmek için
    domain = Column(String, unique=True, index=True, nullable=True)
    
    # Kurumun üyeliği aktif mi? (Abonelik durdurulursa False yapılır)
    is_active = Column(Boolean, default=True)
    
    # Sisteme ne zaman kayıt oldular ve en son ne zaman güncellendiler?
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Çift yönlü ilişki: Bu tenant silinirse, altındaki tüm kullanıcıları da temizle (cascade)
    users = relationship("User", back_populates="tenant", cascade="all, delete-orphan")