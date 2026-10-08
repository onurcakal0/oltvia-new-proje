from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings

# Yüksek performanslı asenkron motor
engine = create_async_engine(
    settings.async_database_url,
    echo=False,           # Canlıda performansı etkilememesi için SQL logları kapalı
    future=True,
    pool_size=20,         # Aynı anda havuzda hazır tutulacak bağlantı sayısı (Scale için kritik)
    max_overflow=10,      # Yoğun anlarda esnetilecek ekstra bağlantı toleransı
    pool_timeout=30       # Bağlantı sırası bekleyen isteklerin maksimum bekleme süresi
)

# Her bir API isteği için yeni bir veritabanı oturumu açacak olan fabrika
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False
)
