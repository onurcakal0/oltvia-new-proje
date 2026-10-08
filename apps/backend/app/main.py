from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth

app = FastAPI(
    title="OLTVIA API",
    description="B2B/B2C Eğitim Platformu Ana Motoru",
    version="1.0.0"
)

# CORS Ayarları: Frontend'in API'ye erişebilmesini sağlar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Canlı ortama çıkarken kısıtlanmalı
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth router'ını ana sisteme bağla
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])

@app.get("/")
async def root():
    return {"message": "OLTVIA API Sistemleri Aktif. Dokümantasyon için /docs adresine gidin."}
