"""OLTVIA backend geliştirme sunucusu.

Kullanım (apps/backend klasöründe):
    python run.py

Frontend (Next.js) giriş isteklerini 8001 portuna gönderdiği için port burada sabitlenmiştir.
Dosya, hangi klasörden çalıştırılırsa çalıştırılsın doğru dizine geçer; böylece
`app.main` import hatası ve yanlış yerde oluşan SQLite dosyası sorunları yaşanmaz.
Veritabanı (oltvia.db) ve demo kullanıcılar ilk açılışta otomatik oluşturulur.

Bu script YEREL GELİŞTİRME içindir: ENVIRONMENT tanımlı değilse 'development' kabul edilir
(demo veriler, /docs ve ekranda demo OTP kodu açık olur). Production'da uvicorn/gunicorn'u
doğrudan ENVIRONMENT=production ve güçlü bir SECRET_KEY ile çalıştırın.
"""
import os
import sys

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BACKEND_DIR)
sys.path.insert(0, BACKEND_DIR)

os.environ.setdefault("ENVIRONMENT", "development")

import uvicorn  # noqa: E402

# 0.0.0.0: aynı ağdaki cihazlardan (ör. telefon) test edilebilmesi için. Sadece kendi
# makinenizden erişmek için OLTVIA_HOST=127.0.0.1 kullanın.
HOST = os.getenv("OLTVIA_HOST", "0.0.0.0")
PORT = int(os.getenv("OLTVIA_PORT", "8001"))
RELOAD = os.getenv("OLTVIA_RELOAD", "true").lower() in ("1", "true", "yes")

if __name__ == "__main__":
    print(f"OLTVIA API başlatılıyor -> http://localhost:{PORT}  (docs: http://localhost:{PORT}/docs)")
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=RELOAD)
