import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Boolean, Uuid
from sqlalchemy.orm import relationship
from .base import Base
from app.core.config import settings

is_sqlite = bool(settings.DATABASE_URL and "sqlite" in settings.DATABASE_URL)

class Tenant(Base):
    __tablename__ = "tenants"
    if not is_sqlite:
        __table_args__ = {"schema": "public"}

    # Benzersiz Kurum ID
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # 1. public Schema Zorunlu Alanları:
    # school_name, school_code, schema_name, created_at, is_active
    school_name = Column(String(255), nullable=False, index=True)
    school_code = Column(String(50), unique=True, index=True, nullable=False)
    schema_name = Column(String(63), unique=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # İsteğe bağlı alanlar
    domain = Column(String(255), nullable=True)

    # Geriye dönük uyumluluk kolonları
    name = Column(String(255), nullable=True)
    code = Column(String(50), nullable=True)

    users = relationship("User", back_populates="tenant", cascade="all, delete-orphan", lazy="selectin")
