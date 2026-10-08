from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token
from app.core.security import get_password_hash, verify_password, create_access_token

router = APIRouter()

# Veritabanı bağlantısı almak için "Bağımlılık" (Dependency)
# İşlem bitince bağlantıyı havuza geri bırakır
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # 1. Email kullanımda mı kontrol et
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu email adresi zaten sisteme kayıtlı."
        )
    
    # 2. Yeni kullanıcıyı oluştur ve şifreyi hashleyerek güvene al
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        tenant_id=user_in.tenant_id
    )
    db.add(new_user)
    await db.commit()         # Veritabanına kaydet
    await db.refresh(new_user) # Oluşan ID'yi geri çek
    
    return new_user

@router.post("/login", response_model=Token)
async def login_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # 1. Veritabanından kullanıcıyı bul
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalars().first()
    
    # 2. Kullanıcı yoksa veya şifre yanlışsa hata fırlat
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Hatalı email veya şifre.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 3. Başarılı ise JWT Token üret
    access_token = create_access_token(
        data={"sub": user.email, "tenant_id": user.tenant_id}
    )
    return {"access_token": access_token, "token_type": "bearer"}
