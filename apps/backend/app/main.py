import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import auth
from app.core.config import settings
from app.db.init_db import init_db

logging.basicConfig(level=logging.INFO, format="%(levelname)s [%(name)s] %(message)s")
logger = logging.getLogger("oltvia")

# Geliştirmede giriş sayfası LAN IP'si üzerinden de (ör. telefondan test) açılabildiği için
# localhost ve özel ağ adreslerine izin verilir. Production'da yalnızca CORS_ORIGINS geçerlidir.
_DEV_ORIGIN_REGEX = (
    r"^https?://(localhost|127\.0\.0\.1|\[::1\]|10\.\d{1,3}\.\d{1,3}\.\d{1,3}"
    r"|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(:\d+)?$"
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Tabloları ve (yalnızca izin verilen ortamlarda) demo verileri hazırla
    try:
        await init_db(seed_demo=bool(settings.SEED_DEMO_DATA))
    except Exception:
        if not settings.is_development:
            # Production'da bozuk veritabanıyla ayağa kalkmak yerine başlatmayı durdur.
            logger.exception("Veritabanı başlatılamadı; uygulama durduruluyor.")
            raise
        logger.exception("Veritabanı başlatma hatası (geliştirme ortamı, devam ediliyor).")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="B2B Çoklu Kurum ve Rol Tabanlı Eğitim Platformu Ana Motoru",
    version=settings.VERSION,
    lifespan=lifespan,
    # API şeması production'da dışarıya açılmaz
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None if settings.is_production else "/redoc",
    openapi_url=None if settings.is_production else "/openapi.json",
)

# CORS: Kimlik doğrulama Bearer header ile yapıldığından çerez (credentials) gerekmez.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=_DEV_ORIGIN_REGEX if settings.is_development else None,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "no-referrer")
    if request.url.path.startswith("/api/"):
        # Token ve kişisel veri içeren yanıtlar önbelleğe alınmamalı
        response.headers.setdefault("Cache-Control", "no-store")
        response.headers.setdefault("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'")
    if settings.is_production:
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    return response


# Auth router'ını ana sisteme bağla
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])


@app.get("/")
async def root():
    return {
        "status": "online",
        "platform": "OLTVIA Education Ecosystem",
        "version": settings.VERSION,
    }
