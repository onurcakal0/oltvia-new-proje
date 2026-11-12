import uuid
import re
from datetime import datetime, timezone
from typing import List, Optional, Any, Dict

from fastapi import APIRouter, Depends, HTTPException, Header, Query, status
from pydantic import BaseModel, Field, EmailStr
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.session import AsyncSessionLocal
from app.models.tenant import Tenant

is_sqlite = bool(settings.DATABASE_URL and "sqlite" in settings.DATABASE_URL)

router = APIRouter()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


# ==========================================================
# PYDANTIC SCHEMAS FOR SCHOOL ADMIN
# ==========================================================

class StudentCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150, description="Öğrencinin Adı Soyadı")
    student_number: str = Field(..., min_length=1, max_length=50, description="Okul / Öğrenci Numarası")
    grade: str = Field(default="12", max_length=20, description="Sınıf Düzeyi (Örn: 9, 10, 11, 12)")
    class_name: str = Field(default="12-A", max_length=50, description="Şube / Sınıf (Örn: 12-A, 11-B)")
    email: Optional[str] = Field(default=None, description="Öğrenci E-posta Adresi (Opsiyonel)")
    password: str = Field(default="oltvia2026", min_length=4, max_length=128, description="Giriş Şifresi")
    school_code: str = Field(..., min_length=2, max_length=50, description="Kurum Kodu")


class TeacherCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150, description="Öğretmenin Adı Soyadı")
    branch: str = Field(..., min_length=2, max_length=100, description="Branş / Alan (Örn: Matematik, Fizik)")
    title: Optional[str] = Field(default="Öğretmen", max_length=100, description="Unvan")
    email: str = Field(..., min_length=3, max_length=255, description="Kurumsal E-posta")
    phone: Optional[str] = Field(default=None, max_length=50, description="Telefon Numarası")
    password: str = Field(default="oltvia2026", min_length=4, max_length=128, description="Giriş Şifresi")
    school_code: str = Field(..., min_length=2, max_length=50, description="Kurum Kodu")


class ParentCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150, description="Velinin Adı Soyadı")
    phone: str = Field(..., min_length=7, max_length=50, description="Telefon Numarası")
    email: Optional[str] = Field(default=None, description="E-posta Adresi (Opsiyonel)")
    student_number: Optional[str] = Field(default=None, description="Bağlanacak Öğrencinin Numarası")
    password: str = Field(default="oltvia2026", min_length=4, max_length=128, description="Giriş Şifresi")
    school_code: str = Field(..., min_length=2, max_length=50, description="Kurum Kodu")


# ==========================================================
# HELPER: RESOLVE TENANT & TABLES
# ==========================================================

async def ensure_tenant_tables(db: AsyncSession, schema_name: str):
    if is_sqlite:
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
        await db.commit()
    else:
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
        """
        await db.execute(text(create_tables_sql))
        await db.commit()


async def resolve_school_context(db: AsyncSession, school_code: str):
    clean_code = school_code.strip().lower()
    res = await db.execute(
        select(Tenant).where(
            (Tenant.school_code == clean_code) |
            (Tenant.schema_name == f"schema_{clean_code}")
        )
    )
    tenant = res.scalars().first()
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"'{school_code}' kodlu okul bulunamadı."
        )

    schema = tenant.schema_name
    await ensure_tenant_tables(db, schema)
    if is_sqlite:
        tables = {
            "users": f'"{schema}__users"',
            "students": f'"{schema}__students"',
            "teachers": f'"{schema}__teachers"',
            "parents": f'"{schema}__parents"',
        }
    else:
        tables = {
            "users": f'"{schema}".users',
            "students": f'"{schema}".students',
            "teachers": f'"{schema}".teachers',
            "parents": f'"{schema}".parents',
        }

    return tenant, tables


# ==========================================================
# ENDPOINT: GET OVERVIEW & STATS
# ==========================================================

@router.get("/overview", summary="Okul İdaresi Genel İstatistikleri")
async def get_school_overview(
    school_code: str = Query(..., description="Okul Kurum Kodu"),
    db: AsyncSession = Depends(get_db)
):
    tenant, tbl = await resolve_school_context(db, school_code)

    # Toplam sayıları hesapla
    users_cnt = 0
    students_cnt = 0
    teachers_cnt = 0
    parents_cnt = 0
    classes_list = []

    try:
        res = await db.execute(text(f"SELECT COUNT(*) FROM {tbl['users']}"))
        users_cnt = res.scalar() or 0
    except Exception:
        pass

    try:
        res = await db.execute(text(f"SELECT COUNT(*) FROM {tbl['students']}"))
        students_cnt = res.scalar() or 0
    except Exception:
        pass

    try:
        res = await db.execute(text(f"SELECT COUNT(*) FROM {tbl['teachers']}"))
        teachers_cnt = res.scalar() or 0
    except Exception:
        pass

    try:
        res = await db.execute(text(f"SELECT COUNT(*) FROM {tbl['parents']}"))
        parents_cnt = res.scalar() or 0
    except Exception:
        pass

    try:
        res = await db.execute(text(f"SELECT DISTINCT class_name FROM {tbl['students']} ORDER BY class_name ASC"))
        classes_list = [r[0] for r in res.fetchall() if r[0]]
    except Exception:
        pass

    return {
        "school": {
            "id": str(tenant.id),
            "school_name": tenant.school_name,
            "school_code": tenant.school_code,
            "schema_name": tenant.schema_name,
            "is_active": tenant.is_active,
            "created_at": tenant.created_at.isoformat() if tenant.created_at else None,
        },
        "stats": {
            "total_users": users_cnt,
            "students_count": students_cnt,
            "teachers_count": teachers_cnt,
            "parents_count": parents_cnt,
            "classes_count": len(classes_list),
            "classes": classes_list,
        }
    }


# ==========================================================
# ENDPOINT: LIST USERS (FILTERED BY ROLE)
# ==========================================================

@router.get("/users", summary="Okul Kullanıcılarını Listele")
async def list_school_users(
    school_code: str = Query(..., description="Okul Kurum Kodu"),
    role: Optional[str] = Query(None, description="ogrenci, ogretmen, veli veya all"),
    db: AsyncSession = Depends(get_db)
):
    tenant, tbl = await resolve_school_context(db, school_code)
    role_filter = (role or "all").lower().strip()

    students = []
    teachers = []
    parents = []

    # 1. Öğrenciler
    if role_filter in ["all", "ogrenci"]:
        try:
            q = text(f"""
                SELECT 
                    u.id as user_id, u.full_name, u.email, u.role, u.is_active, u.created_at,
                    s.id as student_id, s.student_number, s.grade, s.class_name
                FROM {tbl['users']} u
                INNER JOIN {tbl['students']} s ON s.user_id = u.id
                ORDER BY s.student_number ASC
            """)
            res = await db.execute(q)
            for row in res.mappings().all():
                students.append({
                    "id": str(row["user_id"]),
                    "student_id": str(row["student_id"]),
                    "full_name": row["full_name"],
                    "email": row["email"],
                    "student_number": row["student_number"],
                    "grade": row["grade"],
                    "class_name": row["class_name"],
                    "role": "ogrenci",
                    "is_active": bool(row["is_active"]),
                    "created_at": str(row["created_at"]),
                })
        except Exception as e:
            print(f"[SchoolAdmin] Students query error: {e}")

    # 2. Öğretmenler
    if role_filter in ["all", "ogretmen"]:
        try:
            q = text(f"""
                SELECT 
                    u.id as user_id, u.full_name, u.email, u.role, u.is_active, u.created_at,
                    t.id as teacher_id, t.branch, t.title
                FROM {tbl['users']} u
                INNER JOIN {tbl['teachers']} t ON t.user_id = u.id
                ORDER BY u.full_name ASC
            """)
            res = await db.execute(q)
            for row in res.mappings().all():
                teachers.append({
                    "id": str(row["user_id"]),
                    "teacher_id": str(row["teacher_id"]),
                    "full_name": row["full_name"],
                    "email": row["email"],
                    "branch": row["branch"],
                    "title": row["title"],
                    "role": "ogretmen",
                    "is_active": bool(row["is_active"]),
                    "created_at": str(row["created_at"]),
                })
        except Exception as e:
            print(f"[SchoolAdmin] Teachers query error: {e}")

    # 3. Veliler
    if role_filter in ["all", "veli"]:
        try:
            q = text(f"""
                SELECT 
                    u.id as user_id, u.full_name, u.email, u.role, u.is_active, u.created_at,
                    p.id as parent_id, p.phone, p.student_id,
                    s.student_number, su.full_name as student_name
                FROM {tbl['users']} u
                INNER JOIN {tbl['parents']} p ON p.user_id = u.id
                LEFT JOIN {tbl['students']} s ON s.id = p.student_id
                LEFT JOIN {tbl['users']} su ON su.id = s.user_id
                ORDER BY u.full_name ASC
            """)
            res = await db.execute(q)
            for row in res.mappings().all():
                parents.append({
                    "id": str(row["user_id"]),
                    "parent_id": str(row["parent_id"]),
                    "full_name": row["full_name"],
                    "email": row["email"],
                    "phone": row["phone"],
                    "student_id": str(row["student_id"]) if row["student_id"] else None,
                    "student_number": row["student_number"],
                    "student_name": row["student_name"],
                    "role": "veli",
                    "is_active": bool(row["is_active"]),
                    "created_at": str(row["created_at"]),
                })
        except Exception as e:
            print(f"[SchoolAdmin] Parents query error: {e}")

    return {
        "students": students,
        "teachers": teachers,
        "parents": parents,
        "total_count": len(students) + len(teachers) + len(parents)
    }


# ==========================================================
# ENDPOINT: CREATE STUDENT
# ==========================================================

@router.post("/students", status_code=status.HTTP_201_CREATED, summary="Yeni Öğrenci Oluştur")
async def create_student(
    payload: StudentCreate,
    db: AsyncSession = Depends(get_db)
):
    tenant, tbl = await resolve_school_context(db, payload.school_code)

    student_num = payload.student_number.strip()
    full_name = payload.full_name.strip()
    grade = payload.grade.strip()
    class_name = payload.class_name.strip().upper()

    # E-posta opsiyonelse otomatik benzersiz okul e-postası üret
    email = payload.email.strip().lower() if payload.email else f"s{student_num}@{tenant.school_code}.olvia.internal"

    # Kontrol 1: Öğrenci numarası bu okulda daha önce var mı?
    chk_num = await db.execute(
        text(f"SELECT id FROM {tbl['students']} WHERE student_number = :num LIMIT 1"),
        {"num": student_num}
    )
    if chk_num.first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"'{student_num}' numaralı öğrenci bu okulda zaten kayıtlı."
        )

    # Kontrol 2: E-posta bu okulun şemasında var mı?
    chk_email = await db.execute(
        text(f"SELECT id FROM {tbl['users']} WHERE LOWER(email) = LOWER(:em) LIMIT 1"),
        {"em": email}
    )
    if chk_email.first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"'{email}' e-posta adresi bu okulda başka bir kullanıcıya ait."
        )

    # Kullanıcı ve Öğrenci kayıtlarını izole şemaya ekle
    user_id = str(uuid.uuid4()) if is_sqlite else uuid.uuid4()
    student_id = str(uuid.uuid4()) if is_sqlite else uuid.uuid4()
    hashed_pass = get_password_hash(payload.password)
    now = datetime.now(timezone.utc)

    try:
        # Users tablosuna yaz
        await db.execute(
            text(f"""
                INSERT INTO {tbl['users']} (id, email, full_name, role, hashed_password, is_active, created_at)
                VALUES (:id, :email, :full_name, 'ogrenci', :pwd, 1, :now)
            """),
            {
                "id": user_id,
                "email": email,
                "full_name": full_name,
                "pwd": hashed_pass,
                "now": now
            }
        )

        # Students tablosuna yaz
        await db.execute(
            text(f"""
                INSERT INTO {tbl['students']} (id, user_id, student_number, grade, class_name, created_at)
                VALUES (:id, :user_id, :num, :grade, :cls, :now)
            """),
            {
                "id": student_id,
                "user_id": user_id,
                "num": student_num,
                "grade": grade,
                "cls": class_name,
                "now": now
            }
        )

        await db.commit()

        return {
            "success": True,
            "message": f"{full_name} isimli öğrenci başarıyla oluşturuldu.",
            "student": {
                "id": str(user_id),
                "student_id": str(student_id),
                "full_name": full_name,
                "student_number": student_num,
                "grade": grade,
                "class_name": class_name,
                "email": email,
                "role": "ogrenci"
            }
        }
    except Exception as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Öğrenci kaydı oluşturulurken hata oluştu: {str(exc)}"
        )


# ==========================================================
# ENDPOINT: CREATE TEACHER
# ==========================================================

@router.post("/teachers", status_code=status.HTTP_201_CREATED, summary="Yeni Öğretmen Oluştur")
async def create_teacher(
    payload: TeacherCreate,
    db: AsyncSession = Depends(get_db)
):
    tenant, tbl = await resolve_school_context(db, payload.school_code)

    full_name = payload.full_name.strip()
    branch = payload.branch.strip()
    title = (payload.title or "Öğretmen").strip()
    email = payload.email.strip().lower()

    # Kontrol: E-posta şemada var mı?
    chk_email = await db.execute(
        text(f"SELECT id FROM {tbl['users']} WHERE LOWER(email) = LOWER(:em) LIMIT 1"),
        {"em": email}
    )
    if chk_email.first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"'{email}' e-posta adresi bu okulda zaten kullanımda."
        )

    user_id = str(uuid.uuid4()) if is_sqlite else uuid.uuid4()
    teacher_id = str(uuid.uuid4()) if is_sqlite else uuid.uuid4()
    hashed_pass = get_password_hash(payload.password)
    now = datetime.now(timezone.utc)

    try:
        # Users tablosuna yaz
        await db.execute(
            text(f"""
                INSERT INTO {tbl['users']} (id, email, full_name, role, hashed_password, is_active, created_at)
                VALUES (:id, :email, :full_name, 'ogretmen', :pwd, 1, :now)
            """),
            {
                "id": user_id,
                "email": email,
                "full_name": full_name,
                "pwd": hashed_pass,
                "now": now
            }
        )

        # Teachers tablosuna yaz
        await db.execute(
            text(f"""
                INSERT INTO {tbl['teachers']} (id, user_id, branch, title, created_at)
                VALUES (:id, :user_id, :branch, :title, :now)
            """),
            {
                "id": teacher_id,
                "user_id": user_id,
                "branch": branch,
                "title": title,
                "now": now
            }
        )

        await db.commit()

        return {
            "success": True,
            "message": f"{full_name} isimli öğretmen ({branch}) başarıyla oluşturuldu.",
            "teacher": {
                "id": str(user_id),
                "teacher_id": str(teacher_id),
                "full_name": full_name,
                "branch": branch,
                "title": title,
                "email": email,
                "role": "ogretmen"
            }
        }
    except Exception as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Öğretmen kaydı oluşturulurken hata oluştu: {str(exc)}"
        )


# ==========================================================
# ENDPOINT: CREATE PARENT
# ==========================================================

@router.post("/parents", status_code=status.HTTP_201_CREATED, summary="Yeni Veli Oluştur")
async def create_parent(
    payload: ParentCreate,
    db: AsyncSession = Depends(get_db)
):
    tenant, tbl = await resolve_school_context(db, payload.school_code)

    full_name = payload.full_name.strip()
    phone = payload.phone.strip()
    clean_phone_digits = re.sub(r"[^\d]", "", phone)

    email = payload.email.strip().lower() if payload.email else f"veli_{clean_phone_digits}@{tenant.school_code}.olvia.internal"

    # Bağlanacak öğrenciyi bul (eğer öğrenci no verilmişse)
    student_id = None
    linked_student_name = None
    if payload.student_number:
        clean_snum = payload.student_number.strip()
        st_res = await db.execute(
            text(f"""
                SELECT s.id, u.full_name
                FROM {tbl['students']} s
                INNER JOIN {tbl['users']} u ON u.id = s.user_id
                WHERE s.student_number = :num
                LIMIT 1
            """),
            {"num": clean_snum}
        )
        st_row = st_res.first()
        if st_row:
            student_id = st_row[0]
            linked_student_name = st_row[1]

    # Kontrol: E-posta çakışması
    chk_email = await db.execute(
        text(f"SELECT id FROM {tbl['users']} WHERE LOWER(email) = LOWER(:em) LIMIT 1"),
        {"em": email}
    )
    if chk_email.first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"'{email}' e-posta adresi bu okulda zaten kullanımda."
        )

    user_id = str(uuid.uuid4()) if is_sqlite else uuid.uuid4()
    parent_id = str(uuid.uuid4()) if is_sqlite else uuid.uuid4()
    hashed_pass = get_password_hash(payload.password)
    now = datetime.now(timezone.utc)

    try:
        # Users tablosuna yaz
        await db.execute(
            text(f"""
                INSERT INTO {tbl['users']} (id, email, full_name, role, hashed_password, is_active, created_at)
                VALUES (:id, :email, :full_name, 'veli', :pwd, 1, :now)
            """),
            {
                "id": user_id,
                "email": email,
                "full_name": full_name,
                "pwd": hashed_pass,
                "now": now
            }
        )

        # Parents tablosuna yaz
        await db.execute(
            text(f"""
                INSERT INTO {tbl['parents']} (id, user_id, phone, student_id, created_at)
                VALUES (:id, :user_id, :phone, :student_id, :now)
            """),
            {
                "id": parent_id,
                "user_id": user_id,
                "phone": phone,
                "student_id": student_id,
                "now": now
            }
        )

        await db.commit()

        return {
            "success": True,
            "message": f"{full_name} isimli veli başarıyla oluşturuldu.",
            "parent": {
                "id": str(user_id),
                "parent_id": str(parent_id),
                "full_name": full_name,
                "phone": phone,
                "email": email,
                "student_id": str(student_id) if student_id else None,
                "linked_student_name": linked_student_name,
                "role": "veli"
            }
        }
    except Exception as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Veli kaydı oluşturulurken hata oluştu: {str(exc)}"
        )


# ==========================================================
# ENDPOINT: DELETE USER
# ==========================================================

@router.delete("/users/{user_id}", summary="Okul Şemasından Kullanıcı Sil")
async def delete_school_user(
    user_id: str,
    school_code: str = Query(..., description="Okul Kurum Kodu"),
    db: AsyncSession = Depends(get_db)
):
    tenant, tbl = await resolve_school_context(db, school_code)

    try:
        # Kullanıcı var mı kontrol et
        chk = await db.execute(
            text(f"SELECT full_name, role FROM {tbl['users']} WHERE id = :uid"),
            {"uid": user_id}
        )
        row = chk.first()
        if not row:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Kullanıcı bulunamadı."
            )

        full_name, role = row[0], row[1]
        if role.lower() in ["school_admin", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Okul ana yöneticisi buradan silinemez."
            )

        # SQLite veya PostgreSQL'de sil
        if is_sqlite:
            # Bağımlı kayıtları temizle
            await db.execute(text(f"DELETE FROM {tbl['students']} WHERE user_id = :uid"), {"uid": user_id})
            await db.execute(text(f"DELETE FROM {tbl['teachers']} WHERE user_id = :uid"), {"uid": user_id})
            await db.execute(text(f"DELETE FROM {tbl['parents']} WHERE user_id = :uid"), {"uid": user_id})
            await db.execute(text(f"DELETE FROM {tbl['users']} WHERE id = :uid"), {"uid": user_id})
        else:
            await db.execute(text(f"DELETE FROM {tbl['users']} WHERE id = :uid"), {"uid": user_id})

        await db.commit()

        return {
            "success": True,
            "message": f"'{full_name}' ({role}) kullanıcısı başarıyla silindi."
        }
    except HTTPException:
        raise
    except Exception as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Kullanıcı silinirken hata oluştu: {str(exc)}"
        )
