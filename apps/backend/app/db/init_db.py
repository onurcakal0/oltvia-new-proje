import uuid
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.base import Base
from app.db.session import engine, AsyncSessionLocal
from app.models.tenant import Tenant
from app.models.user import User
from app.core.security import get_password_hash

async def init_db():
    # 1. Tabloları oluştur (varsa korur, yoksa oluşturur)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # 2. Demo Seed Verilerini ekle
    async with AsyncSessionLocal() as session:
        # Kurum kontrolü
        result = await session.execute(select(Tenant).where(Tenant.code == "IST-1094"))
        tenant = result.scalars().first()
        
        if not tenant:
            tenant = Tenant(
                id=uuid.uuid4(),
                code="IST-1094",
                name="İstanbul Atatürk Fen Lisesi",
                domain="ataturkfen.oltvia.com",
                city="İstanbul",
                is_active=True
            )
            session.add(tenant)
            await session.commit()
            await session.refresh(tenant)
            print(f"✅ Demo Kurum Oluşturuldu: {tenant.name} ({tenant.code})")
        
        hashed_pwd = get_password_hash("oltvia2026")
        
        # 1. Öğrenci Hesabı
        res_student = await session.execute(
            select(User).where(User.tenant_id == tenant.id, User.student_number == "20261048")
        )
        if not res_student.scalars().first():
            student = User(
                tenant_id=tenant.id,
                role="ogrenci",
                full_name="Arda Yılmaz",
                student_number="20261048",
                identity_number="10000000001",
                email="arda.yilmaz@ogrenci.fenlisesi.k12.tr",
                phone_number="05300000001",
                hashed_password=hashed_pwd,
                is_active=True
            )
            session.add(student)
            print("✅ Demo Öğrenci Eklendi: Arda Yılmaz (No: 20261048)")

        # 2. Öğretmen Hesabı
        res_teacher = await session.execute(
            select(User).where(User.tenant_id == tenant.id, User.email == "ogretmen@fenlisesi.k12.tr")
        )
        if not res_teacher.scalars().first():
            teacher = User(
                tenant_id=tenant.id,
                role="ogretmen",
                full_name="Zeynep Kaya",
                email="ogretmen@fenlisesi.k12.tr",
                phone_number="05321112233",
                identity_number="10000000002",
                hashed_password=hashed_pwd,
                is_active=True
            )
            session.add(teacher)
            print("✅ Demo Öğretmen Eklendi: Zeynep Kaya (ogretmen@fenlisesi.k12.tr)")

        # 3. İdare Hesabı
        res_admin = await session.execute(
            select(User).where(User.tenant_id == tenant.id, User.email == "idare@fenlisesi.k12.tr")
        )
        if not res_admin.scalars().first():
            admin_user = User(
                tenant_id=tenant.id,
                role="idare",
                full_name="Mehmet Demir (Okul Müdürü)",
                email="idare@fenlisesi.k12.tr",
                phone_number="05329998877",
                identity_number="10000000003",
                hashed_password=hashed_pwd,
                is_active=True
            )
            session.add(admin_user)
            print("✅ Demo İdare Eklendi: Mehmet Demir (idare@fenlisesi.k12.tr)")

        # 4. Veli Hesabı (Veli doğrudan öğrenciyle ilişkili ya da bağımsız veli kimliğiyle)
        res_parent = await session.execute(
            select(User).where(User.phone_number == "05321234567")
        )
        if not res_parent.scalars().first():
            parent = User(
                tenant_id=tenant.id,
                role="veli",
                full_name="Selim Yılmaz (Arda'nın Velisi)",
                email="veli@oltvia.com",
                phone_number="05321234567",
                identity_number="10000000004",
                hashed_password=hashed_pwd,
                is_active=True
            )
            session.add(parent)
            print("✅ Demo Veli Eklendi: Selim Yılmaz (05321234567)")

        await session.commit()
        print("🚀 Veritabanı ve Demo Kullanıcıları Hazır!")

if __name__ == "__main__":
    import asyncio
    asyncio.run(init_db())
