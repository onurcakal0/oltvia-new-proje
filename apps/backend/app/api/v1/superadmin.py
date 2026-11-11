from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import text, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import AsyncSessionLocal
from app.models.tenant import Tenant
from app.models.user import User  # Model mapper kaydı için
from app.schemas.tenant import SchoolCreate, SchoolResponse
from app.services.tenant_provisioner import provision_tenant_schema
from app.core.config import settings

is_sqlite = bool(settings.DATABASE_URL and "sqlite" in settings.DATABASE_URL)

router = APIRouter()

# SuperAdmin Yetkili Kullanıcı Bilgileri
SUPERADMIN_VALID_USER = "oltvia2026.."
SUPERADMIN_VALID_PASS = "oltrevia..2026"

class SuperAdminLoginRequest(BaseModel):
    username: str
    password: str

class SuperAdminLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str = "SUPER_ADMIN"
    user: str = "Kurucu Ortak"

@router.post("/login", response_model=SuperAdminLoginResponse, summary="SuperAdmin Kurucu Girişi")
async def superadmin_login(payload: SuperAdminLoginRequest):
    """
    Sadece kurucuların erişebileceği özel SuperAdmin doğrulama kapısı.
    """
    if payload.username.strip() != SUPERADMIN_VALID_USER or payload.password != SUPERADMIN_VALID_PASS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz yetki! SuperAdmin kullanıcı adı veya şifre hatalı."
        )
    return SuperAdminLoginResponse(
        access_token="oltvia_superadmin_privileged_token",
        token_type="bearer",
        role="SUPER_ADMIN",
        user="Kurucu Ortak"
    )

# Asenkron Veritabanı Oturum Bağımlılığı
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@router.get("/schools", response_model=List[SchoolResponse], summary="Kayıtlı Tüm Okulları Listele")
async def list_schools(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """
    Public şemadaki 'tenants' tablosundan tüm kayıtlı okulları çeker.
    """
    stmt = (
        select(Tenant)
        .order_by(Tenant.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    schools = result.scalars().all()
    return schools

@router.post("/schools", response_model=SchoolResponse, status_code=status.HTTP_201_CREATED, summary="Yeni Okul (Tenant) Oluştur ve Şemasını Kur")
async def create_school(
    payload: SchoolCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Yeni bir okul kaydeder ve 'Schema-per-Tenant' mimarisine göre:
    1. public.tenants tablosuna yazar.
    2. İzole PostgreSQL şemasını (schema_{school_code}) oluşturur.
    3. Standart tabloları (users, students, teachers, parents) şemaya kurar.
    4. İlk Okul Yöneticisini şifresiyle şemaya seed eder.
    """
    new_tenant = await provision_tenant_schema(
        db=db,
        school_name=payload.school_name,
        school_code=payload.school_code,
        initial_admin_password=payload.initial_admin_password,
        admin_email=payload.admin_email
    )
    return new_tenant

def parse_tenant_uuid(school_id: str) -> UUID | None:
    try:
        return UUID(school_id)
    except Exception:
        try:
            return UUID(hex=school_id.replace("-", ""))
        except Exception:
            return None

@router.get("/schools/{school_id}", response_model=SchoolResponse, summary="Okul Detayı Getir")
async def get_school(
    school_id: str,
    db: AsyncSession = Depends(get_db)
):
    val_uuid = parse_tenant_uuid(school_id)
    if not val_uuid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Geçersiz okul kimlik bilgisi."
        )

    stmt = select(Tenant).where(Tenant.id == val_uuid)
    result = await db.execute(stmt)
    school = result.scalar_one_or_none()
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Okul bulunamadı."
        )
    return school

@router.delete("/schools/{school_id}", summary="Okulu ve İlgili Tüm Şema/Verilerini Tamamen Sil")
async def delete_school(
    school_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Belirtilen okulu ve o okulun domain/şeması altındaki TÜM verileri kalıcı olarak siler:
    - PostgreSQL'de: DROP SCHEMA "{schema_name}" CASCADE
    - SQLite'da: İlgili tüm izole tablolar ve bağlı kayıtlar temizlenir
    - public.tenants tablosundan okul kaydı tamamen silinir.
    """
    val_uuid = parse_tenant_uuid(school_id)
    if not val_uuid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Geçersiz okul kimlik bilgisi."
        )

    stmt = select(Tenant).where(Tenant.id == val_uuid)
    result = await db.execute(stmt)
    school = result.scalar_one_or_none()

    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Silinmek istenen okul sistemde bulunamadı."
        )

    schema_name = school.schema_name
    school_name = school.school_name
    tenant_id_str = val_uuid.hex if is_sqlite else str(val_uuid)

    try:
        # 1. Okul şeması ve domaini altındaki tüm tabloları / verileri fiziksel olarak temizle
        if is_sqlite:
            # SQLite Geliştirme Ortamı: izole tabloları drop et
            for tbl in ["users", "students", "teachers", "parents"]:
                await db.execute(text(f'DROP TABLE IF EXISTS "{schema_name}__{tbl}"'))
            try:
                await db.execute(text("DELETE FROM users WHERE tenant_id = :tid"), {"tid": tenant_id_str})
            except Exception:
                pass
            # Tenants tablosundan doğrudan SQL ile sil
            await db.execute(text("DELETE FROM tenants WHERE id = :tid"), {"tid": tenant_id_str})
            await db.commit()
        else:
            # PostgreSQL Ortamı: CASCADE ile şemaya bağlı tüm tablolar, satırlar, indeksler temizlenir
            await db.execute(text(f'DROP SCHEMA IF EXISTS "{schema_name}" CASCADE'))
            await db.delete(school)
            await db.commit()

        return {
            "success": True,
            "deleted_id": school_id,
            "school_name": school_name,
            "schema_name": schema_name,
            "message": f"'{school_name}' okulu ve '{schema_name}' altındaki tüm veriler kalıcı olarak silindi."
        }
    except Exception as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Okul ve verileri silinirken hata oluştu: {str(exc)}"
        )

@router.patch("/schools/{school_id}/toggle-status", response_model=SchoolResponse, summary="Okul Erişimini Askıya Al / Aç")
async def toggle_school_status(
    school_id: str,
    db: AsyncSession = Depends(get_db)
):
    val_uuid = parse_tenant_uuid(school_id)
    if not val_uuid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Geçersiz okul kimlik bilgisi."
        )

    stmt = select(Tenant).where(Tenant.id == val_uuid)
    result = await db.execute(stmt)
    school = result.scalar_one_or_none()

    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Okul bulunamadı."
        )

    school.is_active = not school.is_active
    await db.commit()
    await db.refresh(school)
    return school
