import logging
import re
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core import rate_limit
from app.core.config import settings
from app.core.security import (
    InvalidTokenError,
    create_access_token,
    decode_access_token,
    get_password_hash,
    hash_secret,
    secrets_equal,
    verify_password,
    verify_password_or_dummy,
)
from app.db.session import AsyncSessionLocal
from app.models.otp import PasswordResetOTP
from app.models.tenant import Tenant
from app.models.user import User
from app.schemas.user import (
    LoginRequest,
    ResetPasswordRequest,
    ResetPasswordResponse,
    SendOtpRequest,
    SendOtpResponse,
    TokenResponse,
    UserCreate,
    UserProfile,
    UserResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
)

logger = logging.getLogger("oltvia.auth")

router = APIRouter()
security_bearer = HTTPBearer(auto_error=False)

VALID_ROLES = ("ogrenci", "ogretmen", "veli", "idare")
ROLES_REQUIRING_SCHOOL_CODE = ("ogrenci", "ogretmen", "idare")
# Aynı kimlikle eşleşen birden fazla hesap olduğunda denenecek en fazla aday sayısı
MAX_LOGIN_CANDIDATES = 5


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


def normalize_contact(contact: str, method: Optional[str] = None) -> str:
    contact = contact.strip()
    is_email = method == "email" if method else "@" in contact
    return contact.lower() if is_email else normalize_phone(contact)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def build_profile(user: User) -> UserProfile:
    return UserProfile(
        id=user.id,
        full_name=user.full_name,
        role=user.role,
        email=user.email,
        student_number=user.student_number,
        phone_number=user.phone_number,
        tenant_name=user.tenant.name if user.tenant else None,
        tenant_code=user.tenant.code if user.tenant else None,
    )


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: AsyncSession = Depends(get_db),
) -> User:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Geçersiz veya süresi dolmuş oturum jetonu.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Oturum açmanız gerekiyor.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = decode_access_token(credentials.credentials)
        user_id = int(payload["sub"])
    except (InvalidTokenError, KeyError, TypeError, ValueError):
        raise unauthorized

    result = await db.execute(
        select(User).options(selectinload(User.tenant)).where(User.id == user_id)
    )
    user = result.scalars().first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kullanıcı bulunamadı veya hesabı askıya alınmış.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user.tenant is not None and not user.tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kurumunuzun erişimi geçici olarak askıya alınmıştır.",
        )
    return user


# ==========================================================
# 1. B2B ÇOKLU ROL GİRİŞİ (LOGIN)
# ==========================================================
@router.post("/login", response_model=TokenResponse)
async def login_user(login_in: LoginRequest, request: Request, db: AsyncSession = Depends(get_db)):
    role = login_in.role.lower().strip()
    identifier = login_in.target_identifier
    school_code = (login_in.school_code or "").strip().upper()
    password = login_in.password

    ip = rate_limit.client_ip(request)
    rate_limit.enforce(f"login:ip:{ip}", limit=30, window_seconds=300)

    if role not in VALID_ROLES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bilinmeyen kullanıcı rolü.")

    if not identifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lütfen kullanıcı kimlik bilginizi (E-posta, Öğrenci No veya Telefon) giriniz.",
        )

    # Kimlik başına deneme sınırı (brute-force / credential stuffing)
    rate_limit.enforce(f"login:id:{role}:{school_code}:{identifier.lower()}", limit=10, window_seconds=300)

    tenant = None
    if role in ROLES_REQUIRING_SCHOOL_CODE:
        if not school_code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Bu rol için Kurum Kodu zorunludur.",
            )
        tenant_res = await db.execute(select(Tenant).where(Tenant.code == school_code))
        tenant = tenant_res.scalars().first()
        if not tenant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Girdiğiniz kurum kodu sistemde kayıtlı bulunamadı.",
            )
        if not tenant.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Kurumunuzun erişimi geçici olarak askıya alınmıştır. Lütfen kurum idaresiyle görüşün.",
            )

    query = select(User).options(selectinload(User.tenant)).where(User.role == role)
    if role == "ogrenci":
        # Öğrenci: Kurum kodu + Öğrenci No veya T.C. Kimlik No
        query = query.where(
            User.tenant_id == tenant.id,
            (User.student_number == identifier) | (User.identity_number == identifier),
        )
    elif role in ("ogretmen", "idare"):
        # Öğretmen veya İdare: Kurum kodu + Kurumsal E-posta
        query = query.where(User.tenant_id == tenant.id, User.email == identifier.lower())
    else:
        # Veli: Telefon Numarası, T.C. Kimlik No veya E-posta (Kurum kodu opsiyonel)
        clean_phone = normalize_phone(identifier)
        query = query.where(
            (User.phone_number == clean_phone)
            | (User.phone_number == identifier)
            | (User.identity_number == identifier)
            | (User.email == identifier.lower())
        )

    res = await db.execute(query.order_by(User.id).limit(MAX_LOGIN_CANDIDATES))
    candidates = list(res.scalars().all())

    # Kimlik birden fazla hesapla eşleşirse yalnızca şifresi doğrulanan hesap seçilir;
    # kullanıcı yoksa da bcrypt çalıştırılır (zamanlama üzerinden kullanıcı tespiti engellenir).
    user = None
    if not candidates:
        verify_password_or_dummy(password, None)
    for candidate in candidates:
        if verify_password(password, candidate.hashed_password):
            user = candidate
            break

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Girdiğiniz kullanıcı bilgileri veya şifre hatalı. Lütfen kontrol ediniz.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kullanıcı hesabınız pasif durumdadır. Lütfen okul idaresine başvurunuz.",
        )
    if user.tenant is not None and not user.tenant.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kurumunuzun erişimi geçici olarak askıya alınmıştır. Lütfen kurum idaresiyle görüşün.",
        )

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role,
            "tenant_id": str(user.tenant_id) if user.tenant_id else None,
        }
    )

    return TokenResponse(access_token=access_token, token_type="bearer", user=build_profile(user))


# ==========================================================
# 2. ŞİFREMİ UNUTTUM: OTP KODU GÖNDERME
# ==========================================================
async def _invalidate_active_codes(db: AsyncSession, user_id: int) -> None:
    await db.execute(
        update(PasswordResetOTP)
        .where(PasswordResetOTP.user_id == user_id, PasswordResetOTP.consumed_at.is_(None))
        .values(consumed_at=_utcnow(), reset_token_hash=None)
    )


@router.post("/forgot-password/send-otp", response_model=SendOtpResponse)
async def send_forgot_password_otp(req: SendOtpRequest, request: Request, db: AsyncSession = Depends(get_db)):
    method = req.method
    contact = req.contact.strip()
    school_code = (req.school_code or "").strip().upper()

    if not contact:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lütfen geçerli bir e-posta veya telefon numarası giriniz.",
        )

    normalized = normalize_contact(contact, method)
    ip = rate_limit.client_ip(request)
    rate_limit.enforce(f"otp-send:ip:{ip}", limit=10, window_seconds=600)
    rate_limit.enforce(f"otp-send:contact:{normalized}", limit=3, window_seconds=600)

    # Kullanıcının var olup olmadığı yanıttan anlaşılamaz (user enumeration koruması).
    generic = SendOtpResponse(
        success=True,
        message=(
            f"Bilgiler sistemdeki bir hesapla eşleşiyorsa {'e-posta adresinize' if method == 'email' else 'telefon numaranıza'} "
            f"6 haneli doğrulama kodu gönderildi. Kod {settings.OTP_TTL_SECONDS // 60} dakika geçerlidir."
        ),
        contact=contact,
        method=method,
        expires_in_seconds=settings.OTP_TTL_SECONDS,
    )

    if method == "email":
        query = select(User).where(User.email == normalized)
    else:
        query = select(User).where((User.phone_number == normalized) | (User.phone_number == contact))

    if school_code:
        tenant_res = await db.execute(select(Tenant).where(Tenant.code == school_code))
        tenant = tenant_res.scalars().first()
        if not tenant:
            return generic
        query = query.where(User.tenant_id == tenant.id)

    users = list((await db.execute(query.options(selectinload(User.tenant)).limit(2))).scalars().all())
    if len(users) != 1:
        # Hiç eşleşme yok ya da kişi bilgisi birden fazla hesapla eşleşiyor (kurum kodu gerekli).
        if len(users) > 1:
            logger.info("Şifre sıfırlama: iletişim bilgisi birden fazla hesapla eşleşti; kod üretilmedi.")
        return generic

    user = users[0]
    if not user.is_active or (user.tenant is not None and not user.tenant.is_active):
        return generic

    # Kriptografik olarak güvenli 6 haneli kod; önceki aktif kodlar geçersiz kılınır.
    code = f"{secrets.randbelow(1_000_000):06d}"
    await _invalidate_active_codes(db, user.id)
    db.add(
        PasswordResetOTP(
            user_id=user.id,
            contact=normalized,
            method=method,
            code_hash=hash_secret(code),
            attempts=0,
            expires_at=_utcnow() + timedelta(seconds=settings.OTP_TTL_SECONDS),
            is_verified=False,
        )
    )
    await db.commit()

    # TODO: Gerçek SMS/SMTP sağlayıcısı entegre edilmeli. O zamana kadar kod yalnızca
    # yerel geliştirmede (EXPOSE_DEMO_OTP) yanıtla döner; production'da asla dönmez.
    if settings.EXPOSE_DEMO_OTP:
        generic.demo_code = code
    return generic


# ==========================================================
# 3. ŞİFREMİ UNUTTUM: OTP DOĞRULAMA
# ==========================================================
@router.post("/forgot-password/verify-otp", response_model=VerifyOtpResponse)
async def verify_forgot_password_otp(req: VerifyOtpRequest, request: Request, db: AsyncSession = Depends(get_db)):
    normalized = normalize_contact(req.contact)
    code = req.code.strip()

    ip = rate_limit.client_ip(request)
    rate_limit.enforce(f"otp-verify:ip:{ip}", limit=20, window_seconds=600)

    invalid = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Girdiğiniz doğrulama kodu hatalı veya süresi dolmuş. Lütfen yeni kod isteyin.",
    )

    res = await db.execute(
        select(PasswordResetOTP)
        .where(
            PasswordResetOTP.contact == normalized,
            PasswordResetOTP.is_verified.is_(False),
            PasswordResetOTP.consumed_at.is_(None),
        )
        .order_by(PasswordResetOTP.id.desc())
        .limit(1)
    )
    otp_record = res.scalars().first()

    if not otp_record or otp_record.is_expired:
        raise invalid

    if not secrets_equal(hash_secret(code), otp_record.code_hash):
        # Atomik sayaç artırımı; deneme hakkı bitince kayıt kalıcı olarak yakılır.
        attempts = (
            await db.execute(
                update(PasswordResetOTP)
                .where(PasswordResetOTP.id == otp_record.id)
                .values(attempts=PasswordResetOTP.attempts + 1)
                .returning(PasswordResetOTP.attempts)
            )
        ).scalar_one()
        if attempts >= settings.OTP_MAX_ATTEMPTS:
            await db.execute(
                update(PasswordResetOTP)
                .where(PasswordResetOTP.id == otp_record.id)
                .values(consumed_at=_utcnow())
            )
        await db.commit()
        raise invalid

    reset_token = secrets.token_urlsafe(32)
    otp_record.is_verified = True
    otp_record.reset_token_hash = hash_secret(reset_token)
    otp_record.expires_at = _utcnow() + timedelta(seconds=settings.RESET_TOKEN_TTL_SECONDS)
    await db.commit()

    return VerifyOtpResponse(
        success=True,
        reset_token=reset_token,
        message="Kod başarıyla doğrulandı. Lütfen yeni şifrenizi belirleyin.",
    )


# ==========================================================
# 4. ŞİFREMİ UNUTTUM: YENİ ŞİFRE BELİRLEME
# ==========================================================
@router.post("/forgot-password/reset", response_model=ResetPasswordResponse)
async def reset_password(req: ResetPasswordRequest, request: Request, db: AsyncSession = Depends(get_db)):
    ip = rate_limit.client_ip(request)
    rate_limit.enforce(f"otp-reset:ip:{ip}", limit=10, window_seconds=600)

    invalid = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Geçersiz veya süresi dolmuş şifre sıfırlama talebi. Lütfen işlemi baştan başlatın.",
    )

    token_hash = hash_secret(req.reset_token.strip())
    res = await db.execute(
        select(PasswordResetOTP).where(
            PasswordResetOTP.reset_token_hash == token_hash,
            PasswordResetOTP.is_verified.is_(True),
            PasswordResetOTP.consumed_at.is_(None),
        )
    )
    otp_record = res.scalars().first()
    if not otp_record or otp_record.is_expired:
        raise invalid

    # Tek kullanımlık token'ı atomik olarak tüket (eşzamanlı ikinci istek rowcount=0 alır).
    consumed = await db.execute(
        update(PasswordResetOTP)
        .where(PasswordResetOTP.id == otp_record.id, PasswordResetOTP.consumed_at.is_(None))
        .values(consumed_at=_utcnow(), reset_token_hash=None)
    )
    if consumed.rowcount != 1:
        await db.rollback()
        raise invalid

    user = await db.get(User, otp_record.user_id)
    if not user or not user.is_active:
        await db.rollback()
        raise invalid

    user.hashed_password = get_password_hash(req.new_password)
    await _invalidate_active_codes(db, user.id)
    await db.commit()

    return ResetPasswordResponse(
        success=True,
        message="Şifreniz başarıyla güncellendi! Yeni şifrenizle giriş yapabilirsiniz.",
    )


# ==========================================================
# 5. MEVCUT KULLANICI PROFİLİ (ME)
# ==========================================================
@router.get("/me", response_model=UserProfile)
async def get_me(current_user: User = Depends(get_current_user)):
    return build_profile(current_user)


# ==========================================================
# 6. KULLANICI OLUŞTURMA (Yalnızca yetkili yöneticiler)
# ==========================================================
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    forbidden = HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bu işlem için yetkiniz yok.")

    if current_user.is_superuser:
        tenant_id = user_in.tenant_id
        if tenant_id is not None and await db.get(Tenant, tenant_id) is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kurum bulunamadı.")
    elif current_user.role == "idare" and current_user.tenant_id is not None:
        # Okul idaresi yalnızca kendi kurumuna, kendinden düşük yetkili kullanıcı ekleyebilir.
        if user_in.tenant_id is not None and user_in.tenant_id != current_user.tenant_id:
            raise forbidden
        if user_in.role == "idare":
            raise forbidden
        tenant_id = current_user.tenant_id
    else:
        raise forbidden

    email = str(user_in.email).lower()
    result = await db.execute(select(User).where(User.email == email))
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu email adresi zaten sisteme kayıtlı.",
        )

    new_user = User(
        email=email,
        full_name=user_in.full_name,
        role=user_in.role,
        hashed_password=get_password_hash(user_in.password),
        tenant_id=tenant_id,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user
