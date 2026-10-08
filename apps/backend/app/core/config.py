from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Edu.X API"
    VERSION: str = "1.0.0"
    
    # Veritabanı Ayarları
    POSTGRES_USER: str = "edux_user"
    POSTGRES_PASSWORD: str = "edux_password"
    POSTGRES_SERVER: str = "localhost" # Docker dışından (lokalden) erişim için
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "edux_db"

    @property
    def async_database_url(self) -> str:
        # Asenkron PostgreSQL bağlantısı (asyncpg)
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    class Config:
        env_file = ".env"

settings = Settings()
