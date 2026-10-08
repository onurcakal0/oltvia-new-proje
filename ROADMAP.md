# OLTVIA: Gelecek Geliştirme Yol Haritası (Roadmap)

Dün sistemin temel omurgasını (Veritabanı, Backend, Kimlik Doğrulama, Frontend Giriş Ekranı) başarıyla kurduk. OLTVIA'i sıradan bir uygulamadan çıkarıp saniyede binlerce isteği işleyebilen, Yapay Zeka destekli bir B2B/B2C devine dönüştürmek için önümüzde geçeceğimiz aşamalar şunlardır:

---

## 📍 Aşama 4: Güvenli Rotalar ve Yönetim Paneli (Dashboard)
Kullanıcı giriş yaptıktan sonra sistemin merkezine adım atmasını sağlayacağımız aşama.
* **Frontend (Next.js):**
  * `middleware.ts` yazılarak Token'ı olmayan kişilerin Dashboard'a erişimi kesin olarak engellenecek (Route Protection).
  * Kimi AI'ın veya güncel trendlerin tasarım diline (Tailwind/Shadcn) uygun; sol menüsü (Sidebar), üst barı (Navbar) ve profil ayarları olan **Dashboard Layout** (Şablonu) oluşturulacak.
  * **Zustand** ile "Global State" kurularak, giriş yapan kullanıcının verileri (`tenant_id`, `role`, `email`) bellekte tutulacak.
* **Backend (FastAPI):**
  * `/api/v1/users/me` endpoint'i yazılarak Frontend'in her sayfa yenilenmesinde kullanıcı verisini güvenle çekmesi sağlanacak.

## 📍 Aşama 5: Rol Bazlı Erişim ve Çoklu Kiracı (Multi-Tenancy)
OLTVIA'in kalbi olan B2B (Okul/Kurum) ve B2C (Bireysel Öğrenci) ayrımının koda dökülmesi.
* **Rol Bazlı Yetkilendirme (RBAC):** `Sistem Yöneticisi`, `Okul Müdürü`, `Öğretmen` ve `Öğrenci` rolleri tanımlanacak. 
* **Backend Middleware:** Bir öğretmen işlem yaparken *sadece* kendi okuluna (`tenant_id`) ait verileri görebilmesini sağlayan güvenlik kilitleri (SQL filtreleri) eklenecek.
* **Kurum (Tenant) Yönetimi:** Sisteme yeni okullar/kurumlar eklemek için CRUD (Oluşturma, Okuma, Güncelleme, Silme) API'leri yazılacak.

## 📍 Aşama 6: Yapay Zeka (AI) Motorları
Projenin "Akıllı" hale geldiği, OLTVIA'in rakiplerinden ayrıştığı en heyecan verici aşama.
* **Sokratik Asistan (Backend `ai/socratic.py`):** Öğrenciye cevabı doğrudan vermek yerine, sorular sorarak cevabı *bulduran* LLM (Gemini/OpenAI) entegrasyonu.
* **Dinamik Zorluk Motoru:** Öğrencinin testlerdeki başarı oranını analiz edip, bir sonraki sorunun zorluk derecesini anlık olarak belirleyen algoritma (Python tabanlı).
* **AI Chat Arayüzü (Frontend):** Öğrencilerin asistanla konuşabileceği, Markdown ve kod bloğu destekli şık bir sohbet ekranı geliştirilecek.

## 📍 Aşama 7: Mobil Uygulama (React Native / Expo)
Eğitimin cebe girdiği, B2C (Son kullanıcı) tarafının inşa edileceği aşama.
* `apps/mobile` dizininde Expo altyapısı ayağa kaldırılacak.
* Web tarafında yazdığımız `api.ts` ve iş mantıkları mobil uygulamaya entegre edilecek (Monorepo'nun faydası!).
* Öğrenciler için test çözme, AI ile sohbet etme ekranları mobil formata uygun (bottom navigation vb.) tasarlanacak.

## 📍 Aşama 8: Analitik ve Öğretmen Raporlamaları
* **Veri Görselleştirme (Web):** Recharts veya Chart.js kullanılarak öğretmen ve müdürler için sınıf başarı grafikleri, öğrencilerin AI asistanını kullanım süreleri gibi dashboard grafikleri kodlanacak.

## 📍 Aşama 9: DevOps, Canlıya Alma (Production) ve İzleme
Sistemin dış dünyaya açılıp binlerce isteği karşılamaya hazırlandığı son aşama.
* Frontend ve Backend için Production-ready `Dockerfile` yazılacak.
* **CI/CD Pipeline (.github/workflows):** Git'e kod yüklendiğinde otomatik test eden ve sunucuya aktaran otomasyon kurulacak.
* **İzleme (Monitoring):** Sentry (hata takibi) ve Datadog (performans ve RPS - saniyedeki istek takibi) entegre edilerek sistemin çökme riski sıfıra indirilecek.
