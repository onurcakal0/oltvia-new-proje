# OLTVIA - Proje İlerleme Raporu

Bu doküman, OLTVIA platformunun geliştirme sürecindeki kilometre taşlarını ve tamamlanan mimari yapıları içerir.

## 🚀 Gün 1: Temel Mimari, Veritabanı ve Full-Stack İletişimi

Bugün, saniyede binlerce isteği kaldırabilecek B2B/B2C eğitim platformumuzun **"Monorepo"** iskeletini kurduk ve uçtan uca veri iletişimini (Login Sistemi) başarıyla test ettik.

### 1. Mimari İskeletin Kurulması (Monorepo)
* `apps/backend` (FastAPI), `apps/web` (Next.js), ve `apps/mobile` (Expo) klasörleri oluşturuldu.
* 3 kişilik ekibin (Backend, Frontend, Siber Güvenlik) Git üzerinde çakışmadan çalışabilmesi için **"Separation of Concerns"** (Sorumlulukların Ayrılığı) kuralına uygun bir dosya hiyerarşisi tasarlandı.

### 2. Altyapı ve Veritabanı (DevOps)
* **Docker Compose:** PostgreSQL (Ana Veritabanı) ve Redis (Önbellek/Rate Limit) servislerini içeren `docker-compose.yml` dosyası yazıldı ve lokalde ayağa kaldırıldı.
* **Asenkron Motor:** Saniyede binlerce isteğe cevap verebilmek için Backend tarafında `asyncpg` ve `create_async_engine` kullanılarak yüksek performanslı veritabanı bağlantısı (`session.py`) kuruldu.

### 3. Siber Güvenlik ve Veri Modelleri (Backend)
* **Multi-Tenancy (Çoklu Kiracı):** Veritabanında okulları/kurumları birbirinden ayıracak olan `tenant_id` yapısı `User` modeline eklendi.
* **Pydantic Şemaları:** Dışarıdan gelen verileri filtreleyen ve şifreyi asla dışarı sızdırmayan doğrulama şemaları yazıldı.
* **JWT & Şifreleme:** `passlib` (Bcrypt) ile geri döndürülemez şifreleme ve sisteme giriş yapanlara **JWT Token** üreten güvenlik katmanı (`security.py`) kodlandı.

### 4. API Endpoints ve Migration (Alembic)
* `/register` ve `/login` endpoint'lerini barındıran `auth.py` Router'ı yazıldı.
* Bağımsız bir Python sanal ortamı (`venv`) kuruldu.
* **Alembic:** Veritabanı tablolarını koda bakarak otomatik oluşturan migration aracı asenkron yapıya uygun hale getirildi ve ilk tablo (users) PostgreSQL'e basıldı.

### 5. Frontend Web (Next.js & TailwindCSS)
* Next.js için `package.json` yapılandırıldı ve kütüphaneler kuruldu.
* **API İstemcisi:** Backend ile konuşacak ve JWT token'ı her isteğin başlığına otomatik ekleyecek olan `axios` Interceptor yapısı (`lib/api.ts`) kuruldu.
* **Tasarım Entegrasyonu:** Yapay zeka destekli, modern (Dark mode uyumlu ve CSS değişkenlerine dayalı) HSL renk paleti `globals.css` ve `tailwind.config.js` dosyalarına işlendi.
* **Login Arayüzü:** Tasarıma uygun, hata mesajlarını ve bekleme (loading) durumlarını yöneten şık bir "Giriş Yap" sayfası (`page.tsx`) kodlandı. PostCSS ayarları yapılarak Tailwind aktifleştirildi.

### ✅ Günün Sonucu
Frontend'den (Next.js) gönderilen bir şifre ve email, Backend'de (FastAPI) asenkron olarak işlendi, veritabanından (PostgreSQL) doğrulandı ve üretilen JWT Token Frontend'e ulaşıp LocalStorage'a kaydedildi. **Sistemin omurgası %100 çalışıyor.**

---
*Gelecek Odak Noktası (Gün 2): Dashboard (Yönetim Paneli) arayüzünün çizilmesi, Korumalı Rotalar (Protected Routes) ve Yapay Zeka modüllerinin (Sokratik asistan) temellerinin atılması.*
