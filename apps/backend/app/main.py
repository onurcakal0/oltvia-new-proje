from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, superadmin, school_admin
from app.db.init_db import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Tabloları ve demo verileri otomatik hazırla
    try:
        await init_db()
    except Exception as e:
        print(f"[Lifespan] DB init uyarısı: {e}")
    yield

app = FastAPI(
    title="OLTVIA API",
    description="B2B Çoklu Kurum ve Rol Tabanlı Eğitim Platformu Ana Motoru",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Ayarları: Next.js frontend'in (localhost:3000) API'ye rahatça erişebilmesini sağlar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth, SuperAdmin ve SchoolAdmin router'larını sisteme bağla
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(superadmin.router, prefix="/api/superadmin", tags=["SuperAdmin Schools"])
app.include_router(superadmin.router, prefix="/api/v1/superadmin", tags=["SuperAdmin Schools V1"])
app.include_router(school_admin.router, prefix="/api/school-admin", tags=["School Admin"])
app.include_router(school_admin.router, prefix="/api/v1/school-admin", tags=["School Admin V1"])

@app.get("/")
async def root():
    return {
        "status": "online",
        "platform": "OLTVIA Education Ecosystem",
        "version": "1.0.0",
        "docs": "/docs"
    }
