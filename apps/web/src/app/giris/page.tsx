"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Rocket, Network, Shield, Building2, 
  ArrowLeft, Lock, School, KeyRound, 
  User, CheckCircle2, AlertCircle, Sparkles, Loader2,
  LucideIcon
} from 'lucide-react';

type RoleType = 'ogrenci' | 'ogretmen' | 'veli' | 'kurumsal';

interface RoleConfig {
  id: RoleType;
  title: string;
  badge: string;
  desc: string;
  color: string;
  borderColor: string;
  bgGlow: string;
  icon: LucideIcon;
  defaultCode: string;
  defaultIdentity: string;
  identityPlaceholder: string;
  identityLabel: string;
}

const ROLES: Record<RoleType, RoleConfig> = {
  ogrenci: {
    id: 'ogrenci',
    title: 'Öğrenci Giriş Portalı',
    badge: 'B2B Öğrenci Paneli',
    desc: 'Okulunuz tarafından verilen öğrenci numarası veya T.C. kimlik bilgilerinizle Sokratik asistanınıza bağlanın.',
    color: '#FF5A4D',
    borderColor: 'border-[#FF5A4D]/40',
    bgGlow: 'bg-[#FF5A4D]/15',
    icon: Rocket,
    defaultCode: 'IST-1094',
    defaultIdentity: '20261048',
    identityLabel: 'Öğrenci Numarası / T.C. Kimlik No',
    identityPlaceholder: 'Örn: 20261048 veya 12345678901',
  },
  ogretmen: {
    id: 'ogretmen',
    title: 'Öğretmen Giriş Portalı',
    badge: 'Eğitmen & Sınıf Yönetimi',
    desc: 'Kurumunuz tarafından tanımlanan eğitmen e-posta adresinizle sınıf başarı haritasına ve ödev paneline erişin.',
    color: '#8B6CFF',
    borderColor: 'border-[#8B6CFF]/40',
    bgGlow: 'bg-[#8B6CFF]/15',
    icon: Network,
    defaultCode: 'IST-1094',
    defaultIdentity: 'ogretmen@fenlisesi.k12.tr',
    identityLabel: 'Kurumsal Eğitmen E-Postası / T.C.',
    identityPlaceholder: 'ad.soyad@okul.k12.tr',
  },
  veli: {
    id: 'veli',
    title: 'Veli Takip Portalı',
    badge: 'Şeffaf Öğrenci Gelişimi',
    desc: 'Okul idarenize kayıtlı telefon numaranız ve öğrenci bilgilerinizle gelişim raporlarını anlık izleyin.',
    color: '#0EA5E9',
    borderColor: 'border-[#0EA5E9]/40',
    bgGlow: 'bg-[#0EA5E9]/15',
    icon: Shield,
    defaultCode: 'IST-1094',
    defaultIdentity: '05321234567',
    identityLabel: 'Kayıtlı Veli Telefonu / T.C.',
    identityPlaceholder: '05XX XXX XX XX',
  },
  kurumsal: {
    id: 'kurumsal',
    title: 'Kurumsal Yönetici Portalı',
    badge: 'Okul & Lisans Yönetimi',
    desc: 'Okul müdürleri ve idari yöneticiler için çoklu sınıf kotaları, öğretmen yetkilendirmesi ve yapay zeka lisans kontrolü.',
    color: '#F59E0B',
    borderColor: 'border-[#F59E0B]/40',
    bgGlow: 'bg-[#F59E0B]/15',
    icon: Building2,
    defaultCode: 'IST-1094',
    defaultIdentity: 'yonetim@fenlisesi.k12.tr',
    identityLabel: 'Yetkili Yönetici E-Postası',
    identityPlaceholder: 'mudur@okul.k12.tr',
  },
};

function GirisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialRole = (searchParams.get('rol') as RoleType) || 'ogrenci';
  const [activeRole, setActiveRole] = useState<RoleType>(
    ROLES[initialRole] ? initialRole : 'ogrenci'
  );

  const [institutionCode, setInstitutionCode] = useState('');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Update form when role changes
  useEffect(() => {
    const roleParam = searchParams.get('rol') as RoleType;
    if (roleParam && ROLES[roleParam]) {
      setActiveRole(roleParam);
    }
  }, [searchParams]);

  const config = ROLES[activeRole];

  // Fill with demo credentials for testing
  const handleFillDemo = () => {
    setInstitutionCode(config.defaultCode);
    setIdentity(config.defaultIdentity);
    setPassword('Oltvia2026!');
    setErrorMsg(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    // Simulate authentication check
    setTimeout(() => {
      setIsLoading(false);
      if (!institutionCode.trim() || !identity.trim() || !password.trim()) {
        setErrorMsg('Lütfen tüm zorunlu alanları eksiksiz doldurunuz.');
        return;
      }

      // Save token simulation
      if (typeof window !== 'undefined') {
        localStorage.setItem('edux_token', 'demo_jwt_token_' + activeRole);
        localStorage.setItem('edux_user_role', activeRole);
      }

      setSuccessMsg(
        config.title + ' doğrulaması başarılı! Güvenli oturum açılıyor...'
      );

      // In real scenario, redirect to dashboard
      // router.push('/dashboard/' + activeRole);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#14161A] text-[#F2F1ED] font-serif selection:bg-[#FF5A4D]/30 relative overflow-hidden flex flex-col justify-between py-8 px-4 sm:px-6">
      
      {/* Background Neon Orbs */}
      <div 
        className="fixed -top-40 -left-40 w-96 h-96 rounded-full blur-[160px] pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: config.color + '25' }}
      />
      <div 
        className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full blur-[160px] pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: config.color + '20' }}
      />

      {/* TOP HEADER */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between mb-8 z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-white transition-colors p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]"
        >
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </Link>

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 78 28 A 36 36 0 1 0 78 72" stroke="#F2F1ED" strokeWidth="16" />
            <circle cx="78" cy="28" r="8" fill="#8B6CFF" />
            <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
            <circle cx="45" cy="40" r="10" fill="#F2F1ED" />
            <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="#F2F1ED" />
          </svg>
          <span className="text-xl font-black tracking-widest text-[#F2F1ED] font-sans">OLTVIA</span>
        </Link>

        <div className="text-xs font-mono text-[#8B6CFF] hidden sm:block tracking-widest">
          B2B OKUL EKOSİSTEMİ
        </div>
      </header>

      {/* MAIN CARD CONTAINER */}
      <main className="max-w-4xl mx-auto w-full z-10 my-auto">
        
        {/* ROLE SELECTOR TABS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {(Object.keys(ROLES) as RoleType[]).map((rKey) => {
            const r = ROLES[rKey];
            const isSelected = activeRole === rKey;
            const Icon = r.icon;

            return (
              <button
                key={rKey}
                onClick={() => {
                  setActiveRole(rKey);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex items-center justify-center gap-2.5 py-3.5 px-3 rounded-2xl border transition-all duration-300 ${
                  isSelected 
                    ? 'bg-white/[0.08] shadow-lg scale-[1.02]' 
                    : 'bg-white/[0.02] border-white/[0.06] text-[#9CA3AF] hover:border-white/20 hover:text-white'
                }`}
                style={{
                  borderColor: isSelected ? r.color : undefined,
                  color: isSelected ? '#FFFFFF' : undefined,
                }}
              >
                <div 
                  className="p-1.5 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: isSelected ? r.color + '25' : 'transparent' }}
                >
                  <Icon size={18} style={{ color: isSelected ? r.color : '#9CA3AF' }} />
                </div>
                <span className="text-xs font-bold tracking-wide">
                  {r.id === 'kurumsal' ? 'Kurumsal' : r.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* LOGIN FORM CARD */}
        <div className="relative rounded-3xl bg-[#14161A]/95 border border-white/[0.1] p-8 sm:p-12 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Subtle Top Glow Line */}
          <div 
            className="absolute top-0 left-0 right-0 h-[2px] transition-colors duration-500" 
            style={{ backgroundColor: config.color }}
          />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/[0.06]">
            <div>
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase mb-2 border"
                style={{ 
                  color: config.color, 
                  backgroundColor: config.color + '15',
                  borderColor: config.color + '30'
                }}
              >
                <config.icon size={13} />
                {config.badge}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {config.title}
              </h2>
            </div>

            {/* Quick Demo Fill Button */}
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-[#8B6CFF] hover:text-white transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              Demo Bilgileriyle Doldur
            </button>
          </div>

          <p className="text-sm text-[#9CA3AF] mb-8 leading-relaxed">
            {config.desc}
          </p>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-semibold mb-6 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold mb-6 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* THE FORM */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Institution Code */}
              <div>
                <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-white/50" />
                    Okul / Kurum Kodu
                  </span>
                  <span className="text-[10px] text-white/40 lowercase">örn: IST-1094</span>
                </label>
                <input
                  type="text"
                  required
                  value={institutionCode}
                  onChange={(e) => setInstitutionCode(e.target.value.toUpperCase())}
                  placeholder="Kurum Kodunuz"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors text-sm font-mono tracking-wider uppercase"
                />
              </div>

              {/* Identity Field */}
              <div>
                <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-white/50" />
                  {config.identityLabel}
                </label>
                <input
                  type="text"
                  required
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder={config.identityPlaceholder}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors text-sm"
                />
              </div>

            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-white/50" />
                  Giriş Şifresi / PIN
                </label>
                <span className="text-xs text-[#9CA3AF]/60 hover:text-white cursor-pointer transition-colors">
                  Şifrenizi mi unuttunuz?
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors text-sm tracking-widest"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-white/10 border-white/20 text-[#FF5A4D] focus:ring-0"
                />
                <span>Bu cihazda beni hatırla</span>
              </label>

              <span className="flex items-center gap-1 text-[#10B981]">
                <Lock className="w-3 h-3" /> 256-Bit SSL Korumalı
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl text-white font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
              style={{
                backgroundColor: config.color,
                boxShadow: '0 0 30px ' + config.color + '40',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Giriş Doğrulanıyor...
                </>
              ) : (
                <>
                  {config.title.replace(' Portalı', '')} Olarak Giriş Yap
                </>
              )}
            </button>
          </form>

          {/* B2B Explanatory Info Card */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-start gap-3 text-xs text-[#9CA3AF] leading-relaxed">
            <School className="w-4 h-4 text-[#8B6CFF] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Hesap Oluşturma Hakkında: </span>
              OLTVIA; okullar, kolejler ve kurs merkezleri ile kurumsal anlaşmalı olarak çalışan bir eğitim ekosistemidir. 
              Sistemimizde halka açık serbest kayıt bulunmamakta olup; kullanıcı hesapları, şifreler ve kurum kodları okul idareniz tarafından oluşturulur ve teslim edilir.
            </div>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-[#9CA3AF]/50 mt-8 z-10">
        © {new Date().getFullYear()} OLTVIA INC. BEYOND WHAT YOU KNOW. TÜM HAKLARI SAKLIDIR.
      </footer>

    </div>
  );
}

export default function GirisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#14161A] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5A4D]" />
      </div>
    }>
      <GirisContent />
    </Suspense>
  );
}
