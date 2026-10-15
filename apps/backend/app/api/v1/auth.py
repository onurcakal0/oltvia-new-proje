import secrets
import random
import re
from datetime import datetime, timezone, timedelta
from typing import Optional

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.security import get_password_hash, verify_password, create_access_token
from app.db.session import AsyncSessionLocal
from app.models.tenant import Tenant
from app.models.user import User
from app.models.otp import PasswordResetOTP
from app.schemas.user import (
    LoginRequest,
    TokenResponse,
    UserProfile,
    SendOtpRequest,
    SendOtpResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    UserCreate,
    UserResponse,
    Token
)

router = APIRouter()
security_bearer = HTTPBearer(auto_error=False)

# Veritabanı Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

def normalize_phone(phone: str) -> str:
    """Telefon numarasını standartlaştırır: 05321234567 formatına yaklaştırır"""
    cleaned = re.sub(r"[^\d]", "", phone)
    if cleaned.startswith("90") and len(cleaned) == 12:
        cleaned = "0" + cleaned[2:]
    elif len(cleaned) == 10 and not cleaned.startswith("0"):
        cleaned = "0" + cleaned
    return cleaned

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: AsyncSession = Depends(get_db)
) -> User:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Oturum açmanız gerekiyor.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Geçersiz yetki jetonu.")
    except Exception:
        raise HTTPException(status_code=401, detail="Geçersiz veya süresi dolmuş oturum jetonu.")
        
    result = await db.execute(
        select(User).options(selectinload(User.tenant)).where(User.id == int(user_id))
    )
    user = result.scalars().first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Kullanıcı bulunamadı veya hesabı askıya alınmış.")
    return user


# ==========================================================
# 1. B2B ÇOKLU ROL GİRİŞİ (LOGIN)
# ==========================================================
@router.post("/login", response_model=TokenResponse)
async def login_user(login_in: LoginRequest, db: AsyncSession = Depends(get_db)):
    role = login_in.role.lower().strip()
    identifier = login_in.target_identifier
    school_code = (login_in.school_code or "").strip().upper()
    password = login_in.password

    if not identifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lütfen kullanıcı kimlik bilginizi (E-posta, Öğrenci No veya Telefon) giriniz."
        )

    tenant = None
    # Kurum kodu zorunlu olan roller: Öğrenci, Öğretmen, Okul İdaresi
    if role in ["ogrenci", "ogretmen", "idare"]:
        if not school_code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu rol için Kurum Kodu zorunludur."
            )
        tenant_res = await db.execute(select(Tenant).where(Tenant.code == school_code))
        tenant = tenant_res.scalars().first()
        if not tenant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"'{school_code}' kodlu okul veya kurum sistemde kayıtlı bulunamadı."
            )
        if not tenant.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"'{tenant.name}' kurumunun erişimi geçici olarak askıya alınmıştır. Lütfen kurum idaresiyle görüşün."
            )

    user = None

    if role == "ogrenci":
        # Öğrenci: Kurum kodu + Öğrenci No veya T.C. Kimlik No
        query = (
            select(User)
            .options(selectinload(User.tenant))
            .where(
                User.tenant_id == tenant.id,
                User.role == "ogrenci",
                (User.student_number == identifier) | (User.identity_number == identifier)
            )
        )
        res = await db.execute(query)
        user = res.scalars().first()

    elif role in ["ogretmen", "idare"]:
        # Öğretmen veya İdare: Kurum kodu + Kurumsal E-posta
        query = (
            select(User)
            .options(selectinload(User.tenant))
            .where(
                User.tenant_id == tenant.id,
                User.role == role,
                User.email == identifier.lower()
            )
        )
        res = await db.execute(query)
        user = res.scalars().first()

    elif role == "veli":
        # Veli: Telefon Numarası veya T.C. Kimlik No (Kurum kodu opsiyonel)
        clean_phone = normalize_phone(identifier)
        query = (
            select(User)
            .options(selectinload(User.tenant))
            .where(
                User.role == "veli",
                (User.phone_number == clean_phone) | 
                (User.phone_number == identifier) | 
                (User.identity_number == identifier) |
                (User.email == identifier.lower())
            )
        )
        res = await db.execute(query)
        user = res.scalars().first()
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bilinmeyen kullanıcı rolü: {role}"
        )

    # Kimlik doğrulama kontrolü
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Girdiğiniz kullanıcı bilgileri veya şifre hatalı. Lütfen kontrol ediniz."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kullanıcı hesabınız pasif durumdadır. Lütfen okul idaresine başvurunuz."
        )

    # JWT Token Üret
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role,
            "tenant_id": str(user.tenant_id) if user.tenant_id else None
        }
    )

    profile = UserProfile(
        id=user.id,
        full_name=user.full_name,
        role=user.role,
        email=user.email,
        student_number=user.student_number,
        phone_number=user.phone_number,
        tenant_name=user.tenant.name if user.tenant else None,
        tenant_code=user.tenant.code if user.tenant else None
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=profile
    )


# ==========================================================
# 2. ŞİFREMİ UNUTTUM: OTP KODU GÖNDERME
# ==========================================================
@router.post("/forgot-password/send-otp", response_model=SendOtpResponse)
async def send_forgot_password_otp(req: SendOtpRequest, db: AsyncSession = Depends(get_db)):
    contact = req.contact.strip()
    method = req.method.lower().strip()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lütfen geçerli bir e-posta veya telefon numarası giriniz."
        )

    # İlgili kullanıcının sistemde var olduğunu doğrula
    if method == "email":
        user_res = await db.execute(select(User).where(User.email == contact.lower()))
    else:
        clean_phone = normalize_phone(contact)
        user_res = await db.execute(
            select(User).where(
                (User.phone_number == clean_phone) | (User.phone_number == contact)
            )
        )
    user = user_res.scalars().first()

    if not user:
        channel_name = "e-posta adresine" if method == "email" else "telefon numarasına"
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sistemde bu {channel_name} ait kayıtlı bir kullanıcı bulunamadı."
        )

    # 6 haneli rastgele OTP kodu üret
    code = f"{random.randint(100000, 999999)}"
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=120)

    otp_record = PasswordResetOTP(
        contact=contact.lower() if method == "email" else normalize_phone(contact),
        method=method,
        code=code,
        expires_at=expires_at,
        is_verified=False
    )
    db.add(otp_record)
    await db.commit()

    message = (
        f"{'E-posta adresinize' if method == 'email' else 'Telefon numaranıza'} "
        "6 haneli doğrulama kodu gönderildi. Kod 2 dakika geçerlidir."
    )

    # Not: Gerçek SMS/SMTP entegrasyonu yoksa demo_code frontend'de kolay test imkanı sunar
    return SendOtpResponse(
        success=True,
        message=message,
        contact=contact,
        method=method,
        expires_in_seconds=120,
        demo_code=code
    )


# ==========================================================
# 3. ŞİFREMİ UNUTTUM: OTP DOĞRULAMA
# ==========================================================
@router.post("/forgot-password/verify-otp", response_model=VerifyOtpResponse)
async def verify_forgot_password_otp(req: VerifyOtpRequest, db: AsyncSession = Depends(get_db)):
    contact = req.contact.strip()
    code = req.code.strip()

    # Normalize contact
    normalized_contact = contact.lower() if "@" in contact else normalize_phone(contact)

    # Son ve doğrulanmamış OTP kaydını bul
    res = await db.execute(
        select(PasswordResetOTP)
        .where(
            (PasswordResetOTP.contact == normalized_contact) | (PasswordResetOTP.contact == contact),
            PasswordResetOTP.code == code,
            PasswordResetOTP.is_verified == False
        )
        .order_by(PasswordResetOTP.id.desc())
    )
    otp_record = res.scalars().first()

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Girdiğiniz 6 haneli doğrulama kodu hatalı veya geçersiz."
        )

    if otp_record.is_expired:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doğrulama kodunun 2 dakikalık geçerlilik süresi dolmuş. Lütfen yeni kod isteyin."
        )

    # Doğrulandı olarak işaretle ve tek kullanımlık reset_token oluştur
    reset_token = secrets.token_urlsafe(32)
    otp_record.is_verified = True
    otp_record.reset_token = reset_token
    await db.commit()

    return VerifyOtpResponse(
        success=True,
        reset_token=reset_token,
        message="Kod başarıyla doğrulandı. Lütfen yeni şifrenizi belirleyin."
    )


# ==========================================================
# 4. ŞİFREMİ UNUTTUM: YENİ ŞİFRE BELİRLEME
# ==========================================================
@router.post("/forgot-password/reset", response_model=ResetPasswordResponse)
async def reset_password(req: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    reset_token = req.reset_token.strip()
    new_password = req.new_password.strip()

    if len(new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Şifreniz en az 6 karakter olmalıdır."
        )

    # Token ile OTP kaydını çek
    res = await db.execute(
        select(PasswordResetOTP).where(
            PasswordResetOTP.reset_token == reset_token,
            PasswordResetOTP.is_verified == True
        )
    )
    otp_record = res.scalars().first()

    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geçersiz veya süresi dolmuş şifre sıfırlama talebi."
        )

    # İlgili kullanıcıyı bul
    contact = otp_record.contact
    user_res = await db.execute(
        select(User).where(
            (User.email == contact) | 
            (User.phone_number == contact)
        )
    )
    user = user_res.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Şifresi sıfırlanacak kullanıcı hesabı bulunamadı."
        )

    # Şifreyi güncelle ve tek kullanımlık token'ı yak
    user.hashed_password = get_password_hash(new_password)
    otp_record.reset_token = None
    await db.commit()

    return ResetPasswordResponse(
        success=True,
        message="Şifreniz başarıyla güncellendi! Yeni şifrenizle giriş yapabilirsiniz."
    )


# ==========================================================
# 5. MEVCUT KULLANICI PROFİLİ (ME)
# ==========================================================
@router.get("/me", response_model=UserProfile)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserProfile(
        id=current_user.id,
        full_name=current_user.full_name,
        role=current_user.role,
        email=current_user.email,
        student_number=current_user.student_number,
        phone_number=current_user.phone_number,
        tenant_name=current_user.tenant.name if current_user.tenant else None,
        tenant_code=current_user.tenant.code if current_user.tenant else None
    )


# ==========================================================
# 6. REGISTER (Test & Yönetici için)
# ==========================================================
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu email adresi zaten sisteme kayıtlı."
        )
    
    new_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        role=user_in.role or "ogretmen",
        hashed_password=get_password_hash(user_in.password),
        tenant_id=user_in.tenant_id
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user
