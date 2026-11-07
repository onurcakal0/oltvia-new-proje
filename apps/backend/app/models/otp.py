from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String

from app.models.base import Base


def _as_aware(value: datetime) -> datetime:
    # SQLite timezone bilgisini saklamaz; okunan değerler UTC kabul edilir.
    return value if value.tzinfo else value.replace(tzinfo=timezone.utc)


class PasswordResetOTP(Base):
    """Şifre sıfırlama doğrulama kaydı.

    Tablo adı eski `password_reset_otps` tablosundan farklıdır: mevcut yerel veritabanlarında
    `create_all` yeni şemayı sorunsuz oluşturur, eski tablo olduğu gibi kalır (silinmez).
    Kodlar ve sıfırlama token'ları yalnızca HMAC-SHA256 hash'i olarak saklanır.
    """

    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)

    # Kodun ait olduğu kullanıcı (sıfırlama yalnızca bu kullanıcıya uygulanır)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Normalize edilmiş e-posta adresi veya telefon numarası
    contact = Column(String(255), index=True, nullable=False)

    # Doğrulama türü: 'email' veya 'phone'
    method = Column(String(20), nullable=False, default="email")

    # 6 haneli kodun HMAC hash'i
    code_hash = Column(String(64), nullable=False)

    # Hatalı doğrulama denemesi sayısı
    attempts = Column(Integer, nullable=False, default=0)

    # Kod doğrulandıktan sonra üretilen tek kullanımlık token'ın hash'i
    reset_token_hash = Column(String(64), unique=True, index=True, nullable=True)

    # Kodun (doğrulama sonrası ise token'ın) son geçerlilik zamanı
    expires_at = Column(DateTime(timezone=True), nullable=False)

    is_verified = Column(Boolean, nullable=False, default=False)

    # Kayıt kullanıldığında / geçersiz kılındığında doldurulur
    consumed_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    @property
    def is_expired(self) -> bool:
        if self.expires_at is None:
            return True
        return datetime.now(timezone.utc) > _as_aware(self.expires_at)
