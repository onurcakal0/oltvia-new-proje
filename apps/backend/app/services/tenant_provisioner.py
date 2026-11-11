import re
import uuid
from datetime import datetime, timezone
from sqlalchemy import text
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.tenant import Tenant
from app.core.security import get_password_hash
from app.core.config import settings

is_sqlite = bool(settings.DATABASE_URL and "sqlite" in settings.DATABASE_URL)

SCHEMA_NAME_PATTERN = re.compile(r"^[a-z0-9_]{2,50}$")

def generate_safe_schema_name(school_code: str) -> str:
    """
    SQL Enjeksiyonuna karşı sıkı regex doğrulaması yaparak
    güvenli ve izole PostgreSQL şema ismi üretir.
    """
    clean_code = school_code.strip().lower()
    if not SCHEMA_NAME_PATTERN.match(clean_code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geçersiz okul kodu. Sadece küçük harf (a-z), rakam (0-9) ve alt çizgi (_) içerebilir."
        )
    if clean_code[0].isdigit():
        clean_code = f"s_{clean_code}"
    
    # Maksimum PostgreSQL identifier uzunluğu 63 karakterdir
    schema_name = f"schema_{clean_code}"[:63]
    return schema_name

async def provision_tenant_schema(
    db: AsyncSession,
    school_name: str,
    school_code: str,
    initial_admin_password: str,
    admin_email: str | None = None
) -> Tenant:
    """
    Multi-Tenancy 'Schema-per-Tenant' Provisioning İşlemi:
    1. public.tenants (veya SQLite tenants) tablosuna kayıt oluşturur.
    2. Yeni izole şemayı (schema_schoolcode) güvenle oluşturur.
    3. Standart tabloları (users, students, teachers, parents) bu yeni şema içine kurar.
    4. İlk 'Okul Yöneticisi' (School Admin) kullanıcısını yeni şemaya seed eder.
    """
    # 1. Şema ismini güvenli şekilde türet
    schema_name = generate_safe_schema_name(school_code)

    # 2. Daha önce aynı kod veya şema var mı kontrol et (ORM güvenli sorgusu)
    existing = await db.execute(
        select(Tenant.id).where(
            (Tenant.school_code == school_code.lower()) | (Tenant.schema_name == schema_name)
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"'{school_code}' koduna veya '{schema_name}' şemasına sahip bir kurum zaten mevcut."
        )

    # 3. Tenants kaydını hazırla
    tenant_id = uuid.uuid4()
    now = datetime.now(timezone.utc)
    new_tenant = Tenant(
        id=tenant_id,
        school_name=school_name.strip(),
        school_code=school_code.lower(),
        name=school_name.strip(),
        code=school_code.lower(),
        schema_name=schema_name,
        created_at=now,
        is_active=True
    )
    db.add(new_tenant)

    try:
        if is_sqlite:
            # SQLite Geliştirme Ortamı İzolasyonu
            users_tbl = f'"{schema_name}__users"'
            students_tbl = f'"{schema_name}__students"'
            teachers_tbl = f'"{schema_name}__teachers"'
            parents_tbl = f'"{schema_name}__parents"'

            create_tables_sql = f"""
            CREATE TABLE IF NOT EXISTS {users_tbl} (
                id TEXT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                full_name VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                hashed_password VARCHAR(255) NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT 1,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS {students_tbl} (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES {users_tbl}(id) ON DELETE CASCADE,
                student_number VARCHAR(50) NOT NULL UNIQUE,
                grade VARCHAR(20) NOT NULL DEFAULT '12',
                class_name VARCHAR(50) NOT NULL DEFAULT '12-A',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS {teachers_tbl} (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES {users_tbl}(id) ON DELETE CASCADE,
                branch VARCHAR(100) NOT NULL,
                title VARCHAR(100) DEFAULT 'Öğretmen',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS {parents_tbl} (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES {users_tbl}(id) ON DELETE CASCADE,
                phone VARCHAR(50) NULL,
                student_id TEXT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            """
            for stmt in create_tables_sql.strip().split(";"):
                if stmt.strip():
                    await db.execute(text(stmt))

            target_users_table = users_tbl
        else:
            # PostgreSQL Schema-per-Tenant Ortamı
            await db.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{schema_name}"'))

            create_tables_sql = f"""
            CREATE TABLE IF NOT EXISTS "{schema_name}".users (
                id UUID PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                full_name VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                hashed_password VARCHAR(255) NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS "{schema_name}".students (
                id UUID PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES "{schema_name}".users(id) ON DELETE CASCADE,
                student_number VARCHAR(50) NOT NULL UNIQUE,
                grade VARCHAR(20) NOT NULL DEFAULT '12',
                class_name VARCHAR(50) NOT NULL DEFAULT '12-A',
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS "{schema_name}".teachers (
                id UUID PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES "{schema_name}".users(id) ON DELETE CASCADE,
                branch VARCHAR(100) NOT NULL,
                title VARCHAR(100) DEFAULT 'Öğretmen',
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS "{schema_name}".parents (
                id UUID PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES "{schema_name}".users(id) ON DELETE CASCADE,
                phone VARCHAR(50) NULL,
                student_id UUID NULL REFERENCES "{schema_name}".students(id) ON DELETE SET NULL,
                created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS "idx_{schema_name}_users_email" ON "{schema_name}".users(email);
            CREATE INDEX IF NOT EXISTS "idx_{schema_name}_users_role" ON "{schema_name}".users(role);
            """
            await db.execute(text(create_tables_sql))
            target_users_table = f'"{schema_name}".users'

        # 6. İlk Okul Yöneticisini (School Admin) Bu İzole Şemaya Seed Et
        admin_id = str(uuid.uuid4()) if is_sqlite else uuid.uuid4()
        effective_admin_email = admin_email.strip().lower() if admin_email else f"admin@{school_code.lower()}.olvia.internal"
        hashed_password = get_password_hash(initial_admin_password)

        seed_admin_sql = text(f"""
        INSERT INTO {target_users_table} (id, email, full_name, role, hashed_password, is_active, created_at)
        VALUES (:id, :email, :full_name, :role, :hashed_password, :is_active, :created_at)
        """)
        await db.execute(
            seed_admin_sql,
            {
                "id": admin_id,
                "email": effective_admin_email,
                "full_name": f"{school_name.strip()} Yöneticisi",
                "role": "SCHOOL_ADMIN",
                "hashed_password": hashed_password,
                "is_active": True,
                "created_at": now
            }
        )

        # Tüm işlemleri veritabanına onayla
        await db.commit()
        await db.refresh(new_tenant)
        return new_tenant

    except Exception as exc:
        await db.rollback()
        if not is_sqlite:
            try:
                await db.execute(text(f'DROP SCHEMA IF EXISTS "{schema_name}" CASCADE'))
                await db.commit()
            except Exception:
                pass
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Okul şeması ve tabloları kurulurken bir veritabanı hatası oluştu: {str(exc)}"
        )
