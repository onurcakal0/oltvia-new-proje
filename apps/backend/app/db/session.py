from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings

db_url = settings.async_database_url

engine_kwargs = {
    "echo": False,
    "future": True,
}

# SQLite için pool_size ve max_overflow parametreleri geçersizdir
if "sqlite" not in db_url:
    engine_kwargs.update({
        "pool_size": 20,
        "max_overflow": 10,
        "pool_timeout": 30
    })

# Yüksek performanslı asenkron motor
engine = create_async_engine(db_url, **engine_kwargs)


# Her bir API isteği için yeni bir veritabanı oturumu açacak olan fabrika
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False
)
