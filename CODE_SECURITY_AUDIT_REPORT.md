# OLTVIA — Kod, Mimari ve Güvenlik Denetim Raporu

- **Tarih:** 2026-11-07
- **Kapsam:** `apps/backend` (FastAPI), `apps/web` (Next.js), `apps/mobile` (boş), `docker-compose.yml`, kök dizindeki yardımcı scriptler, Git geçmişi (secret taraması)
- **Başlangıç noktası:** `main` @ `9d4ae15`, temiz çalışma ağacı
- **Durum:** Düzeltmeler çalışma ağacında; **commit/push yapılmadı.** Script taşımaları `git mv` ile index'e alınmış durumda.

---

## 1. Genel Proje Değerlendirmesi

### Proje ne yapıyor, nasıl çalışıyor
OLTVIA, okullara (kurum/tenant) yönelik çok rollü (öğrenci, öğretmen, veli, okul idaresi) bir eğitim platformunun erken aşamasıdır.

| Katman | Teknoloji | İçerik |
|---|---|---|
| Backend | FastAPI, SQLAlchemy 2 (async), Pydantic 2, PyJWT, bcrypt | Tek router: `app/api/v1/auth.py` → `POST /login`, şifremi unuttum (`send-otp`, `verify-otp`, `reset`), `GET /me`, `POST /register` |
| Veri | SQLite (`oltvia.db`, varsayılan) veya Postgres (asyncpg) | `tenants`, `users`, şifre sıfırlama kayıtları. Tablolar açılışta `create_all` ile oluşur, geliştirmede demo kurum + 4 demo kullanıcı seed edilir |
| Frontend | Next.js (App Router), React 18, Tailwind | `/` landing, `/giris` giriş + şifremi unuttum, `/ogrenci` panel (yalnızca menü), yasal sayfalar |
| Altyapı | docker-compose (Postgres 15, Redis 7) | Redis kodda henüz kullanılmıyor |

**Veri akışı (giriş):** `/giris` → `POST /api/v1/auth/login` (rol + kurum kodu + kimlik + şifre) → backend kurum ve kullanıcıyı bulur, bcrypt doğrular → HS256 JWT (`sub`, `role`, `tenant_id`) + profil döner → frontend `localStorage`'a yazar → `/ogrenci` token'ı `/auth/me` ile doğrular.

### Genel değerlendirme (denetim öncesi)
- **Teknik seviye:** Prototip / erken MVP. Arayüz emeği yüksek, backend iş mantığı ince.
- **Mimari:** Katman ayrımı (models / schemas / api / core / db) doğru kurulmuş ve küçük ölçek için uygun. Ancak tüm iş mantığı router içinde; Alembic modellerden kopmuş; ortam (dev/prod) kavramı yoktu.
- **Kod kalitesi:** Okunabilir, Türkçe yorumlu. Frontend sayfaları çok büyük tek dosyalar (`page.tsx` ~2000 satır, `giris/page.tsx` ~1450 satır). Test yoktu.
- **Güvenlik durumu:** **Zayıf.** Kimliği doğrulanmamış herkesin herhangi bir hesabı ele geçirebildiği (SEC-01) ve kendine yönetici hesabı açabildiği (SEC-02) iki kritik açık vardı; frontend girişi tamamen sahteydi (SEC-03); JWT anahtarı kodda sabitti (SEC-04).
- **Performans:** Mevcut ölçekte sorun yok (`selectinload` doğru kullanılmış, indeksler mevcut). Frontend'de giriş sayfası arka plan olarak tüm landing sayfasını render ediyor.

### Denetim sonrası
Critical ve High bulguların tamamı (Alembic hariç — kullanıcı kararıyla yalnızca raporlandı) giderildi; 51 otomatik backend testi eklendi; bağımlılık taramaları 0 bilinen açıkla sonuçlandı.

---

## 2. Tespit Edilen Problemler

> **Önem sırası:** Critical → High → Medium → Low → Informational.
> Tüm bulgular kod okunarak **doğrulanmıştır**; "Şüpheli / doğrulanamayan" ayrı bölümde listelenmiştir.
> CVSS v3.1 yalnızca etkisi ve ön koşulları net olan bulgulara verilmiştir.

### Critical

#### SEC-01 — Şifre sıfırlama kodu API yanıtında dönüyor (hesap ele geçirme)
- **Kategori:** Güvenlik — Broken Authentication (OWASP A07)
- **Önem:** Critical — CVSS 9.1 (`AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N`)
- **Konum:** `apps/backend/app/api/v1/auth.py` (eski satır 262-269, `send_forgot_password_otp`)
- **Problem:** `POST /forgot-password/send-otp` yanıtı `demo_code` alanında 6 haneli doğrulama kodunu ortam ayrımı olmadan **her zaman** döndürüyordu.
- **Kök neden:** SMS/SMTP entegrasyonu olmadığı için demo kolaylığı olarak eklenmiş; ortam bayrağına bağlanmamış.
- **Etki:** E-postası veya telefonu bilinen herhangi bir kullanıcının (öğretmen, idareci, veli) şifresi değiştirilip hesabı ele geçirilebilir.
- **İstismar:** `send-otp {contact: "idare@okul.k12.tr"}` → yanıttaki `demo_code` → `verify-otp` → `reset_token` → `reset` ile yeni şifre → idareci olarak giriş. Tamamı kimlik doğrulamasız, 3 istek.
- **Çözüm (uygulandı):** `demo_code` yalnızca `EXPOSE_DEMO_OTP=true` ise döner; varsayılan yalnızca `development`'ta açık, `production`'da **açılamaz** (açılışta hata).
- **Bağımlılıklar:** Frontend demo doldur butonu (geliştirmede çalışmaya devam ediyor).

#### SEC-02 — Kimlik doğrulamasız `/register` ile yetki yükseltme
- **Kategori:** Güvenlik — Broken Access Control / Mass Assignment (A01)
- **Önem:** Critical — CVSS 9.1 (`AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N`)
- **Konum:** `auth.py` (eski satır 396-415), `schemas/user.py` `UserCreate`
- **Problem:** Endpoint herkese açıktı; istemci `role` (ör. `idare`) ve `tenant_id` alanlarını serbestçe belirleyebiliyordu.
- **Kök neden:** "Test & Yönetici için" yazılmış endpoint'e yetki kontrolü eklenmemiş; şema girdiyi doğrudan modele aktarıyor.
- **Etki:** Saldırgan herhangi bir okulda okul idaresi hesabı açabilir; RBAC/multi-tenancy izolasyonu tamamen anlamsızlaşır. Ayrıca `tenant_id` string olarak UUID kolonuna yazıldığı için geçerli istekler bile 500 verebiliyordu.
- **İstismar:** `POST /register {"email":"x@y.com","password":"...","role":"idare","tenant_id":"<okul uuid>"}`.
- **Çözüm (uygulandı):** `get_current_user` zorunlu. `is_superuser` her işlemi yapabilir; `idare` yalnızca **kendi kurumuna** ve `ogrenci/ogretmen/veli` rolleri ekleyebilir; diğer roller 403. `role` Literal whitelist, `tenant_id` UUID tipli, şifre politikası, e-posta küçük harfe normalize.
- **Bağımlılıklar:** Frontend bu endpoint'i kullanmıyor.

#### SEC-03 — Frontend girişi sahte (her kimlik kabul ediliyor), panel korumasız
- **Kategori:** Güvenlik — Broken Authentication / mantık hatası
- **Önem:** Critical (işlevsel olarak). CVSS verilmedi: şu an panelde sunucudan gelen korumalı veri yok, bu yüzden sunucu tarafı veri sızıntısı yok.
- **Konum:** `apps/web/src/app/giris/page.tsx` (eski satır 694-720), `apps/web/src/app/ogrenci/page.tsx`
- **Problem:** Son commit'te (`9d4ae15`) "GEÇİCİ LOCAL BYPASS" ile `/login` çağrısı kaldırılmış; herhangi bir kimlik/şifre ile `fake_jwt_token_...` yazılıp `/ogrenci`'ye yönlendiriliyordu. `/ogrenci` hiçbir oturum kontrolü yapmıyordu.
- **Kök neden:** Backend bağlantı sorununu aşmak için geçici çözümün kalıcı hale gelmesi.
- **Etki:** Kimlik doğrulama fiilen yok; panel veri göstermeye başladığı anda herkes erişebilir hale gelirdi. Kullanıcıya "giriş başarılı" yanıltıcı mesajı gösteriliyordu.
- **Çözüm (uygulandı, kullanıcı onayıyla):** `152dfab`'deki gerçek `/auth/login` çağrısı geri getirildi (şifre artık `trim` edilmiyor). `/ogrenci` açılışta token yoksa `/giris?rol=ogrenci`'ye yönlendiriyor; varsa `/auth/me` ile doğruluyor, 401/403'te oturumu silip yönlendiriyor.
- **Bağımlılıklar:** Girişin çalışması için backend'in açık olması gerekir (README'de zaten belirtiliyordu).

### High

#### SEC-04 — Kodda sabit JWT `SECRET_KEY` varsayılanı
- **Kategori:** Güvenlik — Cryptographic Failures / Security Misconfiguration (A02/A05)
- **Önem:** High — CVSS 8.1 (`AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H`; ön koşul: env değişkeni tanımlanmadan deploy)
- **Konum:** `apps/backend/app/core/config.py` (eski satır 20)
- **Problem:** `SECRET_KEY` env yoksa herkese açık repodaki sabit değer kullanılıyordu. Git geçmişinde başka bir sabit anahtar da var (`super_gizli_egitim_anahtari_edux_x_2024`).
- **Etki:** Anahtarı bilen biri istediği `sub`/`role` ile geçerli JWT üretip herhangi bir kullanıcı olarak API'ye erişebilir.
- **Çözüm (uygulandı):** `ENVIRONMENT` kavramı eklendi (güvenli varsayılan: `production`). Production'da `SECRET_KEY` yoksa, 32 karakterden kısaysa veya dev anahtarıysa uygulama **başlamaz**. Development'ta uyarı loglanır. `python run.py` otomatik `development` kullanır.
- **Ek not:** Git geçmişindeki anahtarlar hiçbir ortamda kullanılmamalı; kullanıldıysa döndürülmeli (rotate).

#### SEC-05 — Bilinen şifreli demo hesaplar her ortamda koşulsuz oluşturuluyor
- **Kategori:** Güvenlik — Security Misconfiguration (A05)
- **Önem:** High (production'a çıkıldığında)
- **Konum:** `app/db/init_db.py`, `app/main.py` lifespan
- **Problem:** Her açılışta `IST-1094` kurumu ve şifresi README'de yazan (`oltvia2026`) 4 hesap (idare dahil) oluşturuluyordu.
- **Etki:** Production'da herkesin bildiği şifreyle okul idaresi girişi.
- **Çözüm (uygulandı):** Seed yalnızca `SEED_DEMO_DATA=true` ise (varsayılan sadece development). Production testi demo girişinin 404 döndüğünü doğruluyor.

#### SEC-06 — OTP akışı brute-force'a ve sızıntıya açık
- **Kategori:** Güvenlik — Broken Authentication (A07), Cryptographic Failures (A02)
- **Önem:** High
- **Konum:** `auth.py` send/verify/reset, `app/models/otp.py`
- **Problem:** (a) Hatalı deneme sınırı yoktu; (b) aynı kişi için sınırsız sayıda geçerli kod birikebiliyordu (her yeni kod başarı olasılığını artırır); (c) kod `random` ile (CSPRNG değil) üretiliyordu; (d) kod ve `reset_token` DB'de düz metindi; (e) `reset_token`'ın süresi yoktu.
- **Etki:** SEC-01 giderilse bile 6 haneli kod, sınırsız denemeyle (ve biriken kodlarla) kırılabilirdi; DB sızıntısında aktif token'lar doğrudan kullanılabilirdi.
- **Çözüm (uygulandı):** `secrets.randbelow`; kod ve token yalnızca HMAC-SHA256 (SECRET_KEY anahtarlı) hash olarak saklanıyor; `hmac.compare_digest`; kayıt başına 5 hatalı denemede kod yakılıyor (atomik `UPDATE ... RETURNING`); yeni kod istenince eskiler geçersiz; reset token 10 dk geçerli ve atomik koşullu `UPDATE` ile tek kullanımlık (eşzamanlı ikinci istek reddedilir); başarılı sıfırlamada kullanıcının diğer kodları yakılıyor.
- **Bağımlılıklar / migration:** Tablo `password_reset_tokens` adıyla yeniden tanımlandı. Eski `password_reset_otps` tablosu mevcut yerel DB'lerde **olduğu gibi kalır, silinmez**; `create_all` yeni tabloyu otomatik oluşturur. Eski tablodaki kayıtlar zaten 2 dakikalık geçici verilerdir.

#### SEC-07 — Şifre sıfırlama yanlış hesaba uygulanabiliyor
- **Kategori:** Güvenlik/Mantık — IDOR benzeri hesap karışması, veri bütünlüğü
- **Önem:** High
- **Konum:** `auth.py` eski `reset_password` (satır 350-357), `send-otp`
- **Problem:** Kullanıcı `email == contact OR phone == contact` ile bulunup `first()` alınıyordu. `email` ve `phone_number` kolonları benzersiz değil (çoklu kurum); `school_code` gönderilse de yok sayılıyordu.
- **Etki:** Aynı e-posta/telefonu paylaşan iki hesap varsa (ör. iki okulda kayıtlı veli/öğretmen), doğrulamayı yapan kişi **başka bir hesabın** şifresini değiştirebilirdi.
- **Çözüm (uygulandı):** Kod üretimi sırasında kullanıcı tekilleştiriliyor (`school_code` verildiyse kuruma göre filtreleniyor; birden fazla eşleşmede kod üretilmiyor) ve kayıt `user_id` ile bağlanıyor; sıfırlama yalnızca o `user_id`'ye uygulanıyor.

#### ARCH-01 — Alembic migration'ı modellerle uyumsuz (yalnızca raporlandı)
- **Kategori:** Mimari / veri bütünlüğü
- **Önem:** High (Postgres'e geçiş anında)
- **Konum:** `apps/backend/alembic/versions/720a0de382ec_kullanicilar_tablosu.py`
- **Problem:** Tek migration yalnızca eski bir `users` tablosu içeriyor (`tenant_id` Integer; `role`, `student_number`, `phone_number` vb. yok). `tenants` ve şifre sıfırlama tabloları hiç yok. Uygulama şemayı `create_all` ile kuruyor.
- **Etki:** `alembic upgrade head` çalıştırılan bir Postgres'te uygulama hatalı şemayla çalışır veya `create_all` ile karışık/yarım şema oluşur; ileride şema değişiklikleri güvenle yönetilemez.
- **Önerilen çözüm:** Production'a geçmeden önce: (1) hiçbir ortamda bu migration'ın uygulanmadığı doğrulanırsa mevcut revizyonu silip modellerden yeni bir baseline üretmek; uygulandıysa üstüne hizalama revizyonu yazmak; (2) production'da `create_all`'u kapatıp yalnızca `alembic upgrade head` kullanmak; (3) CI'da "modeller ↔ migration" farkı kontrolü (`alembic check`).
- **Kullanıcı kararı:** Bu çalışmada kod değiştirilmedi, hiçbir veritabanında işlem yapılmadı.

### Medium

| ID | Kategori | Konum | Problem / Kök neden | Etki | Çözüm (durum) |
|---|---|---|---|---|---|
| SEC-08 | Güvenlik (A07, abuse) | `auth.py` tüm uçlar | Login/OTP uçlarında rate limit yoktu | Parola deneme, credential stuffing, SMS/e-posta bombalama, OTP brute-force | **Uygulandı:** `app/core/rate_limit.py` (in-memory sliding window). Login: IP başına 30/5dk, kimlik başına 10/5dk; send-otp: IP 10/10dk, kişi 3/10dk; verify: IP 20/10dk; reset: IP 10/10dk → 429 + `Retry-After` |
| SEC-09 | Güvenlik (A05, CORS) | `main.py` | `allow_origins=["*"]` + `allow_credentials=True` | Starlette çerezli isteklerde origin'i yansıtır; her siteye kimlikli çapraz istek izni | **Uygulandı:** `CORS_ORIGINS` listesi; credentials kapalı (Bearer kullanılıyor); metod/header kısıtlı. Development'ta LAN/telefon testi için yalnızca localhost + özel IP aralıkları regex'i |
| SEC-10 | Güvenlik (bilgi sızıntısı) | `auth.py` send-otp, login | send-otp kayıtlı olmayan kişiye 404 dönüyordu; login'de kullanıcı yoksa bcrypt atlanıyordu | Kullanıcı numaralandırma (e-posta/telefon kayıtlı mı?), zamanlama farkı | **Uygulandı:** send-otp her durumda aynı yanıt; kullanıcı yoksa dummy bcrypt. Not: Login'de bilinmeyen kurum kodu hâlâ 404 (kurum kodları kullanıcı arayüzü için gerekli; bilinçli bırakıldı) |
| SEC-11 | Güvenlik (A05) | `main.py`, `apps/web` | Güvenlik header'ları yok; `/docs`, `/openapi.json` her ortamda açık; Next `X-Powered-By` | Clickjacking, MIME sniffing, API yüzeyinin keşfi | **Uygulandı:** Backend middleware (`nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, API'de `Cache-Control: no-store` + `CSP default-src 'none'`, prod'da HSTS); prod'da docs kapalı; `next.config.js` header'ları + `poweredByHeader:false` |
| SEC-12 | Güvenlik (girdi doğrulama) | `schemas/user.py` | Alan uzunluğu sınırı yok; rol/method whitelist yok; min şifre 6; bcrypt 72 byte üstünü sessizce kesiyor | Büyük girdiyle CPU tüketimi, beklenmeyen değerler, zayıf şifreler | **Uygulandı:** Tüm alanlarda `max_length`; `role`/`method` Literal; OTP kodu `\d{6}`; yeni şifre ≥8 karakter, ≤72 byte, baş/son boşluk yok (frontend de aynı kural) |
| SEC-13 | Bağımlılık | `requirements.txt` | Sürümler sabit değil (`>=`); `passlib` bakımı durmuş, `bcrypt<4` pin'i ona bağlı | Tekrarlanamayan kurulum, eski kripto kütüphanesi | **Uygulandı:** Tüm sürümler sabitlendi; `passlib` kaldırıldı, doğrudan `bcrypt 5.0` (mevcut `$2b$` hash'lerle uyumlu); `requirements-dev.txt` eklendi |
| DEP-01 | Bağımlılık | `apps/web/package.json` | Next.js 14.2.35 için `npm audit`: 1 critical (Windows'ta çalışan sunucuda kimliksiz RCE, Image Optimization RCE vb.), çok sayıda high; 14.x hattında yama yok. Next'in gömülü `postcss@8.4.31`'i high; `follow-redirects` high | Uzak kod çalıştırma / DoS / SSRF riskleri (bir kısmı özel yapılandırma gerektirir) | **Uygulandı:** `next@15.5.29` (resmi backport hattı, React 18 ile uyumlu), `postcss` override ile `8.5.32`, `npm audit fix` → **0 açık** |
| BUG-01 | Hata yönetimi | `main.py` lifespan | DB init hatası `print` ile yutuluyor, uygulama bozuk DB ile açılıyordu | Sessiz arıza, sonradan anlaşılmaz 500'ler | **Uygulandı:** `logging`; production'da başlatma durdurulur, development'ta loglanıp devam edilir |

### Low

| ID | Kategori | Konum | Problem | Çözüm (durum) |
|---|---|---|---|---|
| SEC-14 | Güvenlik/Hata | `auth.py` `get_current_user` | `int(sub)` try dışında (bozuk `sub` → 500); geniş `except Exception`; kurumu askıya alınan kullanıcının token'ı geçerli kalıyordu | **Uygulandı:** `decode_access_token` (`exp`/`sub` zorunlu, yalnızca `PyJWTError`), tüm hatalar 401; kurum pasifse 403; login'de de kurum kontrolü; token'a `iat` eklendi; süre 7 günden 1 güne indirildi (env ile ayarlanabilir) |
| SEC-15 | Altyapı | `docker-compose.yml` | Sabit DB şifresi; Postgres/Redis tüm arayüzlere (0.0.0.0) açık; Redis şifresiz | **Uygulandı:** Portlar `127.0.0.1`'e bağlı; şifreler `.env`'den (dev varsayılanlı); Redis `--requirepass` |
| SEC-16 | Altyapı | `run.py` | `reload=True` ve `0.0.0.0` sabit | **Uygulandı:** `OLTVIA_RELOAD`, `OLTVIA_HOST` env; `run.py` dev amaçlı olduğu açıkça belgelendi. `0.0.0.0` varsayılanı LAN'dan telefon testi için bilinçli korundu |
| BUG-02 | Mantık | `apps/web/src/lib/api.ts`, `.env.example` | Axios istemcisi `edux_token` okuyordu (giriş `oltvia_token` yazıyor); base URL `.env.example` ile çelişiyordu | **Uygulandı:** Ortak `getApiBaseUrl()/getAuthApiUrl()`, `saveSession/clearSession`, tek token anahtarı; eski `.../api/v1/auth` env değerleri geriye dönük uyumlu |
| BUG-03 | Mantık | `giris/page.tsx` | API adresi `http://` sabit → HTTPS'te mixed-content engeli | **Uygulandı:** Sayfa protokolü kullanılıyor |
| BUG-04 | Hata yönetimi | `giris/page.tsx` | 422 doğrulama hatalarında `detail` dizi olduğu için "[object Object]" gösteriliyordu; JSON olmayan yanıtta `res.json()` patlıyordu; eski demo kodu ekranda kalabiliyordu | **Uygulandı:** `apiErrorMessage()`, güvenli JSON parse, demo kodu her istekte sıfırlanıyor |
| BUG-05 | Mantık | `auth.py` login | Veli kimliği birden fazla hesapla eşleşirse ilk kayıt seçiliyordu (yanlış hesap) | **Uygulandı:** En fazla 5 aday içinden şifresi doğrulanan seçiliyor |
| BUG-06 | Uyumluluk | `requirements.txt` | (Düzeltme sırasında bulundu) Türkçe yorum, Windows'ta pip'in dosyayı cp1254 ile okumasını bozuyor | **Uygulandı:** Dosya ASCII; uyarı notu eklendi |
| ARCH-02 | Bakım/güvenlik | Kök dizin `*.py` (31 dosya) | Başka bir makinenin yollarına (`/Users/onur/...`) ve kaynak dosyalara doğrudan yazan tek seferlik scriptler | **Uygulandı (kullanıcı onayıyla):** `git mv` ile `scripts/legacy/` altına taşındı, "çalıştırmayın" README'si eklendi. Hiçbir dosya silinmedi |

### Informational (değiştirilmedi)
- **Test / CI yoktu** → backend testleri eklendi; CI hâlâ yok.
- `tsconfig.json` `strict: false`: açılması çok sayıda tip hatası üretir; kademeli açılmalı.
- `apps/mobile/package.json` boş dosya (geçerli JSON değil); `npm` bu klasörde çalıştırılırsa hata verir.
- `apps/web/tsconfig.tsbuildinfo` `.gitignore`'da olmasına rağmen Git'te izleniyor (`git rm --cached` önerilir).
- `/giris` sayfası arka planda tüm landing sayfasını (blur'lu) render ediyor → giriş sayfası JS/DOM maliyeti yüksek; ekran görüntüsü veya hafif bir arka plan önerilir.
- Google Fonts CSS `@import` ile yükleniyor (render-blocking, 3. taraf istek); `next/font` önerilir.
- Token `localStorage`'da (bkz. Kalan Riskler R-02).
- Frontend sayfaları çok büyük tek bileşenler; bölünmesi bakım ve render maliyetini iyileştirir.
- `redis` paketi kurulu ama kullanılmıyor (roadmap için bırakıldı).

### Şüpheli / doğrulanamayan noktalar
- **Production deploy durumu bilinmiyor.** Repoda Dockerfile/CI yok; uygulamanın bir yerde eski sabit `SECRET_KEY` veya demo hesaplarla çalışıp çalışmadığı doğrulanamadı. Çalıştıysa: anahtar döndürülmeli, demo hesaplar silinmeli, şifre sıfırlama kayıtları incelenmeli.
- **Alembic migration'ının herhangi bir Postgres'e uygulanıp uygulanmadığı** bilinmiyor (README "PostgreSQL'e basıldı" diyor).
- **SSRF, command injection, path traversal, deserialization, dosya yükleme:** Kodda bu yüzeyler **yok** (dış istek, shell, dosya işlemi, upload, pickle kullanılmıyor). SQL sorguları tamamen SQLAlchemy ORM ile parametreli; ham SQL yok → SQL injection bulunamadı. React çıktıları otomatik escape ediliyor, `dangerouslySetInnerHTML` yok → XSS bulunamadı.
- **HTTP request smuggling / TLS:** Reverse proxy ve TLS yapılandırması repoda yok; değerlendirilemedi.

---

## 3. Uygulanan Düzeltmeler

### Değiştirilen / eklenen dosyalar
| Dosya | Değişiklik | Çözülen bulgular |
|---|---|---|
| `apps/backend/app/core/config.py` | `ENVIRONMENT`, `CORS_ORIGINS`, `SEED_DEMO_DATA`, `EXPOSE_DEMO_OTP`, OTP süreleri; production'da fail-closed doğrulama | SEC-01, 04, 05, 09 |
| `apps/backend/app/core/security.py` | Doğrudan bcrypt, dummy hash, `decode_access_token`, `iat`, HMAC `hash_secret`, sabit zamanlı karşılaştırma | SEC-06, 10, 13, 14 |
| `apps/backend/app/core/rate_limit.py` (yeni) | Thread-safe in-memory limiter | SEC-08 |
| `apps/backend/app/schemas/user.py` | Uzunluk sınırları, Literal'ler, şifre politikası, UUID `tenant_id` | SEC-02, 12 |
| `apps/backend/app/models/otp.py` | `password_reset_tokens`: `user_id`, `code_hash`, `attempts`, `reset_token_hash`, `consumed_at` | SEC-06, 07 |
| `apps/backend/app/api/v1/auth.py` | Login, OTP, reset, register, `/me` yeniden yazıldı (davranış ve yanıt şemaları korunarak) | SEC-01, 02, 06, 07, 08, 10, 14, BUG-05 |
| `apps/backend/app/main.py` | CORS, güvenlik header middleware, prod'da docs kapalı, lifespan hata politikası, logging | SEC-09, 11, BUG-01 |
| `apps/backend/app/db/init_db.py` | Seed `seed_demo` bayrağına bağlandı, `logging` | SEC-05 |
| `apps/backend/run.py` | Dev ortamı varsayılanı, `OLTVIA_RELOAD` | SEC-16 |
| `apps/backend/requirements.txt`, `requirements-dev.txt` (yeni), `.env.example` (yeni) | Sabit sürümler, passlib→bcrypt, dev araçları, ortam şablonu | SEC-13, BUG-06 |
| `apps/backend/tests/` (yeni, 6 dosya) | 51 test | — |
| `apps/web/src/app/giris/page.tsx` | Gerçek login geri geldi; ortak API adresi; hata mesajı çözümleme; şifre kuralı 8 | SEC-03, BUG-03, BUG-04 |
| `apps/web/src/app/ogrenci/page.tsx` | Token + `/auth/me` doğrulamalı istemci koruması | SEC-03 |
| `apps/web/src/lib/api.ts` | Ortak adres/oturum yardımcıları, tek token anahtarı | BUG-02 |
| `apps/web/next.config.js` (yeni) | Güvenlik header'ları, `poweredByHeader:false` | SEC-11 |
| `apps/web/package.json`, `package-lock.json` | `next 15.5.29`, `postcss 8.5.32` override, audit fix | DEP-01 |
| `apps/web/tsconfig.json`, `next-env.d.ts` | Next 15 build'inin otomatik eklediği `target` ve route types referansı | — |
| `apps/web/.env.example` | `NEXT_PUBLIC_API_URL=.../api/v1` | BUG-02 |
| `docker-compose.yml` | Localhost bind, env şifreler, Redis şifresi | SEC-15 |
| `scripts/legacy/*` (taşındı), `scripts/legacy/README.md` | 31 script arşivlendi | ARCH-02 |
| `README.md`, `.gitignore` | Production notları, test komutları, `.pytest_cache/` | — |
| `.claude/launch.json` (yeni) | Yerel backend/web sunucularını başlatma tanımı (doğrulama için eklendi; istenmezse silinebilir) | — |

### Korunan davranışlar (geriye dönük uyumluluk)
- API yolları, istek/yanıt alan adları aynı (`TokenResponse`, `UserProfile`, `SendOtpResponse.demo_code` vb.).
- `python run.py` ile yerel geliştirme deneyimi aynı: demo hesaplar, demo OTP kodu, `/docs`, LAN üzerinden test.
- Mevcut `oltvia.db` dosyaları bozulmaz; mevcut bcrypt hash'leri geçerli kalır.

### Bilinçli davranış değişiklikleri
- Yeni şifre en az 8 karakter (eskiden 6).
- JWT süresi 7 gün → 1 gün (`ACCESS_TOKEN_EXPIRE_MINUTES`).
- `send-otp` artık kayıtlı olmayan kişi için hata göstermiyor (numaralandırma koruması); arayüz 2. adıma geçer.
- `/register` artık yetkili oturum istiyor.
- `uvicorn app.main:app` doğrudan çalıştırılırsa `ENVIRONMENT=development` veya `SECRET_KEY` verilmelidir (güvenli varsayılan).

---

## 4. Test Sonuçları

| Kontrol | Komut | Sonuç |
|---|---|---|
| Backend unit/integration/security testleri | `cd apps/backend && venv/Scripts/python -m pytest -q` | **51 passed**, 0 failed (1 uyarı: Starlette'in `httpx` TestClient deprecation uyarısı, işlevsel değil) |
| Python bağımlılık taraması | `pip-audit -r requirements.txt` | **No known vulnerabilities found** |
| npm bağımlılık taraması (prod + dev) | `npm audit` | Başlangıç: 3 (1 critical, 2 high) → **0** |
| TypeScript | `npx tsc --noEmit` | **Başarılı** (Next 14 ve Next 15 ile) |
| Production build | `npm run build` | **Başarılı** (9 sayfa, Next 15.5.29) |
| Canlı backend smoke test (curl) | login 200 / yanlış şifre 401 / anonim register 401 / güvenlik header'ları / yabancı origin CORS reddi / LAN origin dev'de kabul / OTP tam akış / token tekrar kullanımı 400 / bilinmeyen kişiye aynı yanıt | **Hepsi beklendiği gibi** |
| Tarayıcı (uygulama içi tarayıcı, dev sunucuları) | Token yokken `/ogrenci` → `/giris`; eski sahte token → temizlenip `/giris`; yanlış şifre → backend hata mesajı; demo bilgilerle giriş → gerçek JWT + profil, `/ogrenci` menüsü görünüyor | **Başarılı**. Konsolda yalnızca beklenen 401'ler (test denemeleri) |
| Secret taraması | Git geçmişinde desen araması (AWS/GitHub/Google/özel anahtar desenleri + `SECRET_KEY/PASSWORD=` atamaları) | Gerçek bulut/API anahtarı bulunamadı. Geçmişte 2 sabit dev JWT anahtarı ve dev DB şifresi var (bkz. SEC-04) |

**Test kapsamı:** 4 rolün girişi; yanlış şifre/bilinmeyen kullanıcı için özdeş yanıt; girdi yansıtmama; aşırı uzun şifre; kimlik başına rate limit; `/me` için token yok / bozuk / sahte imza / `sub` bozuk / `exp` yok / süresi dolmuş / `alg=none`; register için anonim, öğrenci, öğretmen, başka kurum, idare→idare, başarılı kayıt + giriş + tekrar kayıt, zayıf şifre, bilinmeyen rol; OTP için demo kod kapalıyken dönmemesi, numaralandırma koruması, tam akış, tek kullanımlık token, 5 hatalı deneme sonrası yakma, yeni kodun eskiyi geçersiz kılması, süresi dolmuş kod/token, zayıf şifre, sahte token, veli telefon akışı, geçersiz method, kişi başına rate limit; güvenlik header'ları; CORS; production modunda (ayrı süreç) `/docs` 404, HSTS, demo hesap yok, `SECRET_KEY` olmadan başlamama; ayar doğrulamaları.

**Çalıştırılamayan / yapılmayanlar**
- `next lint`: Projede ESLint yapılandırması yok; komut interaktif kurulum sorduğu için çalıştırılmadı. (`next build` içindeki tip kontrolü geçti.)
- Frontend otomatik testleri: Test altyapısı yok; frontend yalnızca build, tsc ve elle tarayıcı testiyle doğrulandı.
- Semgrep, Gitleaks, Trivy, OWASP ZAP: Makinede kurulu değil; kurulmadı. Yerine manuel kod incelemesi + desen tabanlı secret araması yapıldı.
- Postgres ile test: Docker başlatılmadı; tüm testler SQLite üzerinde. (`UPDATE ... RETURNING` Postgres'te de desteklenir, ancak Postgres'te çalıştırılarak doğrulanmadı.)
- Rate limiter'ın çok worker'lı davranışı test edilmedi (tasarım gereği süreç içi).

---

## 5. Kalan Riskler

| ID | Risk | Önem | Öneri |
|---|---|---|---|
| R-01 | **Alembic uyumsuzluğu** (ARCH-01) | High (Postgres öncesi) | Baseline migration'ı yeniden üret, prod'da `create_all` yerine yalnızca Alembic, CI'da `alembic check` |
| R-02 | JWT `localStorage`'da: herhangi bir XSS token'ı çalabilir | Medium | Backend'in `HttpOnly; Secure; SameSite=Strict` çerez set etmesine geçiş (+CSRF koruması), ya da kısa ömürlü access + HttpOnly refresh token |
| R-03 | Token iptali (revocation) yok: şifre değişse de mevcut token'lar süresi dolana kadar (1 gün) geçerli | Medium | `users.token_version` / `password_changed_at` kolonu ve JWT'de kontrol (şema değişikliği + migration gerektirir) |
| R-04 | Gerçek SMS/e-posta sağlayıcısı yok: production'da OTP kullanıcıya ulaşmaz (artık yanıtta da dönmüyor) | Medium (işlevsel) | Sağlayıcı entegrasyonu; gönderim kotaları |
| R-05 | Rate limit süreç belleğinde: çok worker/sunucuda paylaşılmaz, yeniden başlatmada sıfırlanır; proxy arkasında tüm istemciler tek IP görünebilir | Medium | Redis tabanlı limiter; uvicorn `--proxy-headers --forwarded-allow-ips` doğru yapılandırması |
| R-06 | Sıkı Content-Security-Policy yok (frontend) | Medium | Önce `Content-Security-Policy-Report-Only`, inline style'ların azaltılması, `next/font` |
| R-07 | RBAC yalnızca `/register`'da; gelecekteki endpoint'ler için merkezi `require_role()` / tenant filtresi yok | Medium (gelecek) | Ortak dependency'ler: `require_roles(...)`, her sorguda `tenant_id` zorunlu filtre |
| R-08 | Parola politikası yalnızca uzunluk; sızmış parola kontrolü, hesap kilitleme bildirimi yok | Low | Yaygın parola listesi kontrolü, başarısız giriş bildirimleri |
| R-09 | `tsconfig strict:false`, ESLint yok, frontend testi yok, CI yok | Low | Kademeli strict, ESLint, Playwright smoke testleri, GitHub Actions (pytest + pip-audit + npm audit + build) |
| R-10 | Logging/monitoring altyapısı minimal (stdout); audit log (kim kimi oluşturdu, şifre sıfırlamaları) yok | Low | Yapılandırılmış log, güvenlik olayları için audit log, Sentry |
| R-11 | Backup/recovery süreci tanımlı değil (SQLite dosyası / Postgres volume) | Low (prod'da High) | Postgres için otomatik yedek + geri yükleme testi |
| R-12 | Git geçmişinde sabit dev anahtarları | Low | Hiçbir ortamda kullanılmadığından emin olun; kullanıldıysa döndürün |
| R-13 | Eski `password_reset_otps` tablosu yerel DB'lerde artık kullanılmıyor | Informational | İstenirse yerel `oltvia.db` silinip yeniden oluşturulabilir (yalnızca demo veri) |

---

## 6. Sonuç ve Öneriler

**Mevcut durum:** Kimlik doğrulama katmanındaki iki kritik backend açığı (kimliksiz hesap ele geçirme ve kimliksiz yönetici hesabı açma), sahte frontend girişi ve sabit JWT anahtarı giderildi. Uygulama artık "güvenli varsayılan" ile çalışıyor: ortam belirtilmezse production kabul ediliyor ve güvensiz yapılandırmayla başlamıyor. Bağımlılıklar sabitlendi ve bilinen açık içermiyor. Kimlik doğrulama davranışı 51 otomatik testle güvence altında. Hiçbir yazılım için sıfır açık garantisi verilemez; bu çalışma tespit edilebilir riskleri azaltıp doğrulanabilir hale getirmiştir.

**Öncelikli sonraki adımlar**
1. Değişiklikleri inceleyip commit edin (bu çalışmada commit yapılmadı).
2. CI kurun: `pytest`, `pip-audit`, `npm audit`, `npm run build`.
3. Alembic baseline'ını düzeltin (R-01).
4. Yeni endpoint'ler eklenmeden önce merkezi rol/tenant yetkilendirme dependency'lerini yazın (R-07).

**Production'a geçmeden önce mutlaka**
- [ ] `ENVIRONMENT=production`, rastgele ≥32 karakter `SECRET_KEY`, gerçek `CORS_ORIGINS`
- [ ] Postgres + doğru Alembic migration'ları; `create_all` kapalı; yedekleme
- [ ] Gerçek SMS/e-posta sağlayıcısı (R-04)
- [ ] HTTPS arkasında çalışma, proxy header yapılandırması, Redis tabanlı rate limit (R-05)
- [ ] Token saklama stratejisi (R-02) ve iptal mekanizması (R-03)
- [ ] CSP (R-06), merkezi loglama/izleme (R-10)
- [ ] Demo hesapların production DB'de bulunmadığının doğrulanması
