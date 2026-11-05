"""OLTVIA backend geliştirme sunucusu.

Kullanım (apps/backend klasöründe):
    python run.py

Frontend (Next.js) giriş isteklerini 8001 portuna gönderdiği için port burada sabitlenmiştir.
Dosya, hangi klasörden çalıştırılırsa çalıştırılsın doğru dizine geçer; böylece
`app.main` import hatası ve yanlış yerde oluşan SQLite dosyası sorunları yaşanmaz.
Veritabanı (oltvia.db) ve demo kullanıcılar ilk açılışta otomatik oluşturulur.
"""
import os
import sys

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BACKEND_DIR)
sys.path.insert(0, BACKEND_DIR)

import uvicorn  # noqa: E402

HOST = os.getenv("OLTVIA_HOST", "0.0.0.0")
PORT = int(os.getenv("OLTVIA_PORT", "8001"))

if __name__ == "__main__":
    print(f"OLTVIA API başlatılıyor -> http://localhost:{PORT}  (docs: http://localhost:{PORT}/docs)")
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)
