import logging
from typing import Optional

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger("oltvia.config")

# Yalnızca yerel geliştirme için. Production'da asla kullanılmaz (aşağıdaki doğrulama engeller).
_DEV_ONLY_SECRET_KEY = "dev-only-insecure-secret-key-change-me-0000000000"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "OLTVIA API"
    VERSION: str = "1.0.0"

    # 'development' | 'production' | 'test'. Güvenli varsayılan: production.
    # `python run.py` geliştirme sunucusu bunu otomatik olarak 'development' yapar.
    ENVIRONMENT: str = "production"

    # Özel veritabanı bağlantı adresi (Varsa öncelikli kullanılır, yoksa yerel SQLite)
    DATABASE_URL: Optional[str] = "sqlite+aiosqlite:///./oltvia.db"

    # PostgreSQL Ayarları (DATABASE_URL boş bırakılırsa kullanılır)
    POSTGRES_USER: str = "edux_user"
    POSTGRES_PASSWORD: str = "edux_password"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "edux_db"

    # JWT
    SECRET_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 gün

    # Virgülle ayrılmış izinli origin listesi
    CORS_ORIGINS: str = "http://localhost:3005,http://127.0.0.1:3005"

    # None => ortama göre belirlenir (development: True, diğerleri: False)
    SEED_DEMO_DATA: Optional[bool] = None
    # OTP kodunu API yanıtında döndür (yalnızca SMS/SMTP entegrasyonu olmayan yerel geliştirme için!)
    EXPOSE_DEMO_OTP: Optional[bool] = None

    # Şifre sıfırlama
    OTP_TTL_SECONDS: int = 120
    OTP_MAX_ATTEMPTS: int = 5
    RESET_TOKEN_TTL_SECONDS: int = 600

    @model_validator(mode="after")
    def _apply_environment_defaults(self) -> "Settings":
        self.ENVIRONMENT = (self.ENVIRONMENT or "production").strip().lower()
        if self.SEED_DEMO_DATA is None:
            self.SEED_DEMO_DATA = self.is_development
        if self.EXPOSE_DEMO_OTP is None:
            self.EXPOSE_DEMO_OTP = self.is_development

        if not self.SECRET_KEY:
            if self.ENVIRONMENT == "production":
                raise RuntimeError(
                    "SECRET_KEY ortam değişkeni production ortamında zorunludur "
                    "(en az 32 karakter, örn: python -c \"import secrets; print(secrets.token_urlsafe(48))\")."
                )
            logger.warning("SECRET_KEY tanımlı değil; yalnızca geliştirme için güvensiz bir anahtar kullanılıyor.")
            self.SECRET_KEY = _DEV_ONLY_SECRET_KEY
        elif self.ENVIRONMENT == "production" and (
            len(self.SECRET_KEY) < 32 or self.SECRET_KEY == _DEV_ONLY_SECRET_KEY
        ):
            raise RuntimeError("Production ortamında SECRET_KEY en az 32 karakter ve rastgele olmalıdır.")

        if self.ENVIRONMENT == "production" and self.EXPOSE_DEMO_OTP:
            raise RuntimeError("EXPOSE_DEMO_OTP production ortamında açılamaz.")
        return self

    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT in ("development", "dev", "local")

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def async_database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )


settings = Settings()
