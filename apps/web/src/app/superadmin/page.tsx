"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Database, 
  Search, 
  Loader2, 
  Eye, 
  EyeOff,
  Sparkles,
  ShieldCheck,
  Lock,
  User,
  LogOut,
  ArrowRight,
  ShieldAlert,
  Trash2,
  AlertTriangle,
  X
} from "lucide-react";

interface School {
  id: string;
  school_name: string;
  school_code: string;
  schema_name: string;
  created_at: string;
  is_active: boolean;
}

export default function SuperAdminPage() {
  // SuperAdmin Kurucu Kimlik Doğrulama Durumları
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Kurucu Giriş Formu Durumları
  const [loginUser, setLoginUser] = useState<string>("");
  const [loginPass, setLoginPass] = useState<string>("");
  const [loginRemember, setLoginRemember] = useState<boolean>(true);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showLoginPass, setShowLoginPass] = useState<boolean>(false);

  // Dashboard Durumları
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ title: string; desc: string } | null>(null);

  // Okul Silme ve Durum Güncelleme
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form State
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Backend API Uç Noktaları (8001 ve 8000 fallback'leri ile)
  const getApiEndpoints = (path: string) => {
    const envBackend = process.env.NEXT_PUBLIC_BACKEND_URL;
    const envApi = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '') : null;
    
    const candidateBases = [
      envBackend,
      envApi,
      "http://localhost:8001",
      "http://localhost:8000"
    ].filter(Boolean) as string[];

    const uniqueBases = Array.from(new Set(candidateBases));
    const endpoints: string[] = [];
    
    for (const base of uniqueBases) {
      endpoints.push(`${base}${path}`);
      if (path.startsWith('/api/superadmin')) {
        endpoints.push(`${base}/api/v1${path.replace('/api', '')}`);
      }
    }
    return Array.from(new Set(endpoints));
  };

  // Sayfa yüklendiğinde oturum kontrolü
  useEffect(() => {
    try {
      const sessionAuth = typeof window !== "undefined" ? (
        sessionStorage.getItem("oltvia_superadmin_auth") === "true" ||
        localStorage.getItem("oltvia_superadmin_auth") === "true"
      ) : false;
      if (sessionAuth) {
        setIsAuthenticated(true);
      }
    } catch {
      // Storage okuma hatası olursa güvenli kalsın
    } finally {
      setAuthChecking(false);
    }
  }, []);

  // Okulları Listele (Sadece yetkili olunca çağrılır)
  const fetchSchools = async () => {
    setLoading(true);
    setErrorMsg(null);
    let success = false;
    let errorDetail = "";

    const endpoints = getApiEndpoints('/api/superadmin/schools');

    for (const url of endpoints) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data: School[] = await res.json();
          setSchools(data);
          success = true;
          break;
        } else {
          errorDetail = `Sunucu yanıtı: ${res.status} ${res.statusText}`;
        }
      } catch (err: any) {
        errorDetail = err?.message || "Bağlantı kurulamadı";
      }
    }

    if (!success) {
      console.warn("Okul listesi alınamadı, denenen uç noktalar:", endpoints);
      setErrorMsg(
        "Okul listesi sunucudan alınamadı. Backend servisinin (FastAPI) çalıştığından emin olun. " +
        "(Terminalde: 'cd apps/backend && python run.py' komutuyla 8001 portunda başlatabilirsiniz.)"
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSchools();
    }
  }, [isAuthenticated]);

  // Okul ve İlgili Tüm Şema/Verilerini Sil
  const handleConfirmDelete = async () => {
    if (!schoolToDelete) return;
    setIsDeleting(true);
    setErrorMsg(null);
    setModalError(null);

    try {
      const endpoints = getApiEndpoints(`/api/superadmin/schools/${schoolToDelete.id}`);
      let res: Response | null = null;
      let errorDetail = "";

      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
          });
          if (response.ok) {
            res = response;
            break;
          } else {
            const errJson = await response.json().catch(() => ({}));
            errorDetail = errJson.detail || `Hata (${response.status})`;
          }
        } catch {
          // sonraki portu dene
        }
      }

      if (!res) {
        throw new Error(errorDetail || "Okul silinemedi. Backend sunucusuna ulaşılamıyor.");
      }

      // Başarılı: State'i güncelle ve bildir
      setSchools((prev) => prev.filter((s) => s.id !== schoolToDelete.id));
      setToastMsg({
        title: "Okul ve Tüm Veritabanı Verileri Silindi!",
        desc: `"${schoolToDelete.school_name}" kurumu ve '${schoolToDelete.schema_name}' izole şeması altındaki tüm veriler (öğrenciler, öğretmenler, veliler vb.) kalıcı olarak silindi.`,
      });
      setSchoolToDelete(null);
      setTimeout(() => setToastMsg(null), 8000);
    } catch (err: any) {
      console.error("Okul silme hatası:", err);
      setModalError(err.message || "Okul silinirken bir hata oluştu.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Okul Erişimini Aç/Kapat (Aktif/Pasif)
  const handleToggleStatus = async (school: School) => {
    try {
      const endpoints = getApiEndpoints(`/api/superadmin/schools/${school.id}/toggle-status`);
      let res: Response | null = null;

      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }
          });
          if (response.ok) {
            res = response;
            break;
          }
        } catch {
          // sonraki portu dene
        }
      }

      if (res && res.ok) {
        const updated: School = await res.json();
        setSchools((prev) => prev.map((s) => (s.id === school.id ? updated : s)));
        setToastMsg({
          title: "Durum Güncellendi",
          desc: `"${school.school_name}" okulu ${updated.is_active ? "aktif" : "pasif"} hale getirildi.`,
        });
        setTimeout(() => setToastMsg(null), 4000);
      }
    } catch (err) {
      console.error("Durum değiştirilemedi:", err);
    }
  };

  // SuperAdmin Kurucu Giriş Fonksiyonu
  const handleSuperAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    const userTrim = loginUser.trim();
    const passTrim = loginPass;

    try {
      // 1. Backend üzerinden doğrulamayı dene
      let backendValidated = false;
      const endpoints = getApiEndpoints('/api/superadmin/login');

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: userTrim, password: passTrim })
          });
          if (res.ok) {
            backendValidated = true;
            break;
          } else if (res.status === 401) {
            setLoginError("Giriş yetkisi reddedildi: Kullanıcı adı veya şifre hatalı.");
            setLoginLoading(false);
            return;
          }
        } catch {
          // Bir sonraki portu dene
        }
      }

      // 2. Özel Kurucu Kimlik Bilgileri Kontrolü
      // Kullanıcı Adı: oltvia2026..
      // Şifre: oltrevia..2026
      if (backendValidated || (userTrim === "oltvia2026.." && passTrim === "oltrevia..2026")) {
        if (typeof window !== "undefined") {
          if (loginRemember) {
            localStorage.setItem("oltvia_superadmin_auth", "true");
            localStorage.setItem("oltvia_superadmin_user", userTrim);
          } else {
            sessionStorage.setItem("oltvia_superadmin_auth", "true");
            sessionStorage.setItem("oltvia_superadmin_user", userTrim);
          }
        }
        setIsAuthenticated(true);
      } else {
        setLoginError("Giriş yetkisi reddedildi: Kullanıcı adı veya şifre hatalı.");
      }
    } catch (err: any) {
      if (userTrim === "oltvia2026.." && passTrim === "oltrevia..2026") {
        setIsAuthenticated(true);
      } else {
        setLoginError("Giriş yapılamadı. Lütfen bilgilerinizi kontrol ediniz.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Kurucu Oturumu Kapatma
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("oltvia_superadmin_auth");
      localStorage.removeItem("oltvia_superadmin_user");
      sessionStorage.removeItem("oltvia_superadmin_auth");
      sessionStorage.removeItem("oltvia_superadmin_user");
    }
    setIsAuthenticated(false);
    setLoginPass("");
    setLoginError(null);
  };

  // Rastgele Benzersiz Okul Kodu Üretici
  const handleGenerateCode = () => {
    if (schoolName.trim()) {
      // Okul isminden slug üret
      const slug = schoolName
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")
        .slice(0, 16);
      const randSuffix = Math.floor(100 + Math.random() * 900);
      setSchoolCode(`${slug}_${randSuffix}`);
    } else {
      const randStr = Math.random().toString(36).substring(2, 6);
      const randNum = Math.floor(1000 + Math.random() * 9000);
      setSchoolCode(`okul_${randStr}_${randNum}`);
    }
  };

  // Rastgele Güçlü Şifre Üretici
  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAdminPassword(pwd);
  };

  // Yeni Okul Ekle (Tenant Provisioning)
  const handleSubmitSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !schoolCode.trim() || !adminPassword.trim()) {
      alert("Lütfen zorunlu alanları (Okul Adı, Kod, Şifre) eksiksiz doldurun.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const endpoints = getApiEndpoints('/api/superadmin/schools');
      let res: Response | null = null;
      let errorDetail = "";

      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              school_name: schoolName.trim(),
              school_code: schoolCode.trim().toLowerCase(),
              initial_admin_password: adminPassword,
              admin_email: adminEmail.trim() || undefined,
            }),
          });
          if (response.ok) {
            res = response;
            break;
          } else {
            const errJson = await response.json().catch(() => ({}));
            errorDetail = errJson.detail || `Hata (${response.status})`;
          }
        } catch {
          // sonraki portu dene
        }
      }

      if (!res) {
        throw new Error(errorDetail || "Sunucuya bağlanılamadı. FastAPI servisinin (port 8001) açık olduğundan emin olun.");
      }

      const result = await res.json();

      // Başarılı bildirim göster
      setToastMsg({
        title: "Okul ve PostgreSQL Şeması Başarıyla Kuruldu!",
        desc: `"${result.school_name}" için '${result.schema_name}' izole şeması, tabloları ve okul yöneticisi hazırlandı.`,
      });

      // Formu temizle ve listeye dön
      setSchoolName("");
      setSchoolCode("");
      setAdminPassword("");
      setAdminEmail("");
      await fetchSchools();
      setActiveTab("list");

      // Bildirimi 8 saniye sonra kapat
      setTimeout(() => setToastMsg(null), 8000);
    } catch (err: any) {
      console.error("Şema oluşturma hatası:", err);
      setErrorMsg(err.message || "Bilinmeyen bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtrelenmiş okul listesi
  const filteredSchools = schools.filter(
    (s) =>
      s.school_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.school_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.schema_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Yükleme sırasında titreşimi engelle
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        <span className="text-xs text-slate-400 font-mono">Güvenlik protokolleri doğrulanıyor...</span>
      </div>
    );
  }

  // Yetkisiz ise Kurucu Giriş Kapısını Göster
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090E] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-purple-500/30">
        {/* Glow Arka Plan Efektleri */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b08_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Üst Rozet / Başlık Kartı */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4 shadow-lg shadow-purple-950/40">
              <ShieldCheck size={14} className="text-purple-400" />
              <span>OLTVIA FOUNDER ACCESS GATEWAY</span>
            </div>
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-600 p-0.5 mx-auto mb-4 shadow-xl shadow-purple-600/25">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Database className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              SuperAdmin Girişi
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Sadece kurucu ortakların erişebileceği izole yönetim portalı
            </p>
          </div>

          {/* Giriş Formu Kartı */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative">
            <form onSubmit={handleSuperAdminLogin} className="space-y-4">
              
              {/* Hata Bildirimi */}
              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
                  <ShieldAlert size={16} className="text-red-400 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Kullanıcı Adı */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kurucu Kullanıcı Adı
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                    placeholder="Kullanıcı adınızı girin"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 font-mono transition-all"
                  />
                </div>
              </div>

              {/* Şifre */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kurucu Güvenlik Şifresi
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showLoginPass ? "text" : "password"}
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 font-mono transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showLoginPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Beni Hatırla */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={loginRemember}
                    onChange={(e) => setLoginRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Bu cihazda oturumu hatırla</span>
                </label>
              </div>

              {/* Giriş Butonu */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/45 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loginLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Doğrulanıyor...</span>
                  </>
                ) : (
                  <>
                    <span>Sisteme Güvenli Giriş</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
              <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <Lock size={12} className="text-purple-400/80" />
                <span>256-Bit SSL Uçtan Uca Şifreli Kurucu Paneli</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ÜST BAŞLIK & TABS */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Database size={20} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  OLTVIA SuperAdmin
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/50">
                    Schema-per-Tenant
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Çoklu kurum PostgreSQL şema yönetimi ve izole veritabanı orkestrasyonu
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab("list")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "list"
                    ? "bg-purple-600 text-white shadow"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Building2 size={15} />
                Kayıtlı Okullar ({schools.length})
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "create"
                    ? "bg-purple-600 text-white shadow"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Plus size={15} />
                Yeni Okul Ekle
              </button>
            </div>

            {/* Kurucu Rozeti & Çıkış Yap Butonu */}
            <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-slate-800">
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/20 text-purple-300 text-xs font-medium">
                <ShieldCheck size={14} className="text-purple-400" />
                <span>Kurucu Ortak</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
                title="SuperAdmin Oturumunu Kapat"
              >
                <LogOut size={14} />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </header>

        {/* TOAST / BİLDİRİM KARTI */}
        {toastMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 flex items-start justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-300">{toastMsg.title}</h4>
                <p className="text-xs text-emerald-200/80 mt-0.5">{toastMsg.desc}</p>
              </div>
            </div>
            <button
              onClick={() => setToastMsg(null)}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-200"
            >
              Kapat
            </button>
          </div>
        )}

        {/* HATA BİLDİRİMİ */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 flex items-start justify-between gap-3 shadow-lg animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div>
                  <span className="font-bold">Hata: </span>
                  {errorMsg}
                </div>
              </div>
            </div>
            <button
              onClick={() => fetchSchools()}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>Tekrar Dene</span>
            </button>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
            SAYFA 1: OKUL LİSTESİ (DATA GRID)
           ──────────────────────────────────────────────────────────── */}
        {activeTab === "list" && (
          <div className="space-y-4">
            {/* Arama ve Yenileme Barı */}
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Okul adı, kod veya şema ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                onClick={fetchSchools}
                disabled={loading}
                className="h-9 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <RefreshCw size={14} className={loading ? "animate-spin text-purple-400" : ""} />
                Yenile
              </button>
            </div>

            {/* Data Grid Tablosu */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Okul Adı</th>
                      <th className="py-3 px-4">Kurum Kodu</th>
                      <th className="py-3 px-4">PostgreSQL Şeması</th>
                      <th className="py-3 px-4">Durum</th>
                      <th className="py-3 px-4">Kayıt Tarihi</th>
                      <th className="py-3 px-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <Loader2 size={24} className="animate-spin text-purple-500 mx-auto mb-2" />
                          Okul şemaları taranıyor...
                        </td>
                      </tr>
                    ) : filteredSchools.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <Building2 size={28} className="mx-auto mb-2 text-slate-600" />
                          Kayıtlı okul bulunamadı.
                          <div className="mt-2">
                            <button
                              onClick={() => setActiveTab("create")}
                              className="text-xs font-semibold text-purple-400 hover:underline"
                            >
                              + İlk Okulu Sisteme Ekle
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredSchools.map((school) => (
                        <tr key={school.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-200">
                            {school.school_name}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-purple-400">
                            {school.school_code}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                              {school.schema_name}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {school.is_active ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Aktif Şema
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                                Pasif
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                            {new Date(school.created_at).toLocaleString("tr-TR")}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleStatus(school)}
                                title={school.is_active ? "Erişimi Askıya Al (Pasif Yap)" : "Erişimi Yeniden Aç (Aktif Yap)"}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                                  school.is_active
                                    ? "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                                    : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                }`}
                              >
                                {school.is_active ? "Askıya Al" : "Aktifleştir"}
                              </button>
                              <button
                                onClick={() => setSchoolToDelete(school)}
                                title="Okulu ve Tüm Şema Verilerini Kalıcı Olarak Sil"
                                className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-600/80 border border-rose-500/20 hover:border-rose-600 transition-all cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────
            SAYFA 2: YENİ OKUL EKLE (ADD NEW SCHOOL & PROVISION SCHEMA)
           ──────────────────────────────────────────────────────────── */}
        {activeTab === "create" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Alanı (8 Kolon) */}
            <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow">
              <div className="mb-5 pb-4 border-b border-slate-800">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck size={18} className="text-purple-400" />
                  Yeni Okul ve İzole Şema Kaydı
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Bu işlem PostgreSQL üzerinde yeni bir şema açar, standart tabloları derler ve ilk okul yöneticisini yetkilendirir.
                </p>
              </div>

              <form onSubmit={handleSubmitSchool} className="space-y-4">
                {/* 1. Okul Adı */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Okul / Kurum Tam Adı <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: İstanbul Atatürk Fen Lisesi"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* 2. Benzersiz Okul Kodu */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Benzersiz Okul Kodu <span className="text-red-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateCode}
                      className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <Sparkles size={12} />
                      Kod Üret
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Örn: ist_fen_101"
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-purple-400 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Sadece küçük harf (a-z), rakam ve alt çizgi. Şema adı: <code className="text-slate-400">schema_{schoolCode || "okulkodu"}</code>
                  </p>
                </div>

                {/* 3. İlk Yönetici Şifresi */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Okul Admini İlk Şifresi <span className="text-red-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      <Key size={12} />
                      Güçlü Şifre Üret
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Minimum 6 karakter şifre"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full h-10 pl-3.5 pr-10 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* 4. Opsiyonel Yönetici E-Postası */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Okul Yöneticisi E-Postası (Opsiyonel)
                  </label>
                  <input
                    type="email"
                    placeholder={`Örn: admin@${schoolCode || "okul"}.olvia.internal`}
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Gönder Butonu ve Yükleniyor Durumu */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-white" />
                        PostgreSQL Şeması ve Tablolar Kuruluyor (Lütfen Bekleyiniz)...
                      </>
                    ) : (
                      <>
                        <Database size={16} />
                        Okulu Kaydet ve Şemayı Oluştur
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Sağ Bilgi & Şema Önizleme Paneli (5 Kolon) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Database size={14} className="text-purple-400" />
                  Şema İzolasyonu Önizlemesi
                </h3>
                
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono">
                  <div className="text-slate-400">
                    <span className="text-slate-500">Katalog: </span>
                    <span className="text-emerald-400 font-semibold">public.tenants</span>
                  </div>
                  <div className="text-slate-400">
                    <span className="text-slate-500">Hedef Şema: </span>
                    <span className="text-purple-300 font-semibold">
                      schema_{schoolCode || "..."}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-800">
                    Otomatik kurulacak tablolar:
                    <ul className="text-slate-400 list-disc list-inside mt-1 space-y-0.5">
                      <li>users (Kullanıcılar)</li>
                      <li>students (Öğrenciler)</li>
                      <li>teachers (Öğretmenler)</li>
                      <li>parents (Veliler)</li>
                    </ul>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 leading-relaxed bg-purple-950/20 border border-purple-900/40 p-3 rounded-lg">
                  💡 <span className="font-semibold text-purple-300">Strict Multi-Tenancy:</span> Her okul kendi PostgreSQL şemasıyla tamamen yalıtılır. Bir okulun verileri başka bir okulun sorgularına kesinlikle karışamaz.
                </div>
              </div>
            </div>

          </div>
        )}

        {/* OKUL SİLME VE VERİTABANI ŞEMA TEMİZLEME ONAY MODALI */}
        {schoolToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-rose-500/30 p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
              
              <button
                onClick={() => setSchoolToDelete(null)}
                disabled={isDeleting}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Okulu ve Tüm Şema Verilerini Sil
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Bu kurum ve ait olduğu tüm izole PostgreSQL veritabanı tabloları kalıcı olarak yok edilecektir.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2.5 font-mono mb-5">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Silinecek Kurum:</span>
                  <span className="font-bold text-white">{schoolToDelete.school_name}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Kurum Kodu:</span>
                  <span className="text-purple-400 font-semibold">{schoolToDelete.school_code}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Fiziksel Şema:</span>
                  <span className="text-rose-400 font-semibold">{schoolToDelete.schema_name}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-rose-300/90 font-sans leading-relaxed">
                  ⚠️ <span className="font-semibold">Kritik Uyarı:</span> Bu işlem veritabanında <code className="bg-rose-950/50 px-1 py-0.5 rounded text-rose-200">DROP SCHEMA CASCADE</code> çalıştıracaktır. Okula ait tüm kullanıcılar, öğrenciler, veliler, öğretmenler ve not tabloları tamamen silinecektir.
                </div>
              </div>

              {/* Hata Durumu Göstergesi */}
              {modalError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle size={15} className="text-rose-400 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSchoolToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 hover:shadow-rose-600/40 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Veriler Temizleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      <span>Evet, Tüm Verilerle Birlikte Sil</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
