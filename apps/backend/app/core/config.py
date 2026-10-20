import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "OLTVIA API"
    VERSION: str = "1.0.0"
    
    # Özel veritabanı bağlantı adresi (Varsa öncelikli kullanılır, yoksa yerel SQLite)
    DATABASE_URL: str | None = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./oltvia.db")

    
    # PostgreSQL Ayarları (Docker / Canlı sunucu ortamı için)
    POSTGRES_USER: str = "edux_user"
    POSTGRES_PASSWORD: str = "edux_password"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "edux_db"

    # JWT Gizli Anahtarı
    SECRET_KEY: str = os.getenv("SECRET_KEY", "oltvia-super-secret-jwt-key-2026-b2b-school-ecosystem")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 gün

    @property
    def async_database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
