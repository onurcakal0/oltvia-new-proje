from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from app.models.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    
    # Kullanıcı Rolü: 'ogrenci', 'ogretmen', 'veli', 'idare'
    role = Column(String(50), index=True, nullable=False, default="ogrenci")
    
    # Ad Soyad
    full_name = Column(String(255), nullable=True)
    
    # E-posta (Öğretmen, İdare ve Veli için ana iletişim, öğrenci için opsiyonel)
    email = Column(String(255), index=True, nullable=True)
    
    # Şifre Hash'i
    hashed_password = Column(String(255), nullable=False)
    
    # Öğrenci Numarası (Öğrenci girişi için)
    student_number = Column(String(50), index=True, nullable=True)
    
    # T.C. Kimlik Numarası (Öğrenci & Veli girişi için)
    identity_number = Column(String(20), index=True, nullable=True)
    
    # Telefon Numarası (Veli ve SMS doğrulama için)
    phone_number = Column(String(30), index=True, nullable=True)
    
    # Çoklu Kurum (Multi-Tenancy) ilişkisi: Bağlı olduğu okul
    tenant_id = Column(Uuid(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True, index=True)
    tenant = relationship("Tenant", back_populates="users")
    
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))