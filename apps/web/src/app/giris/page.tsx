"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowRight, ArrowLeft, Eye, EyeOff, 
  Sparkles, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';

type RoleType = 'ogrenci' | 'ogretmen' | 'veli' | 'idare';

interface RoleConfig {
  id: RoleType;
  tabLabel: string;
  heading: string;
  subheading: string;
  buttonText: string;
  gradient: string;
  accentColor: string;
  defaultCode: string;
  defaultIdentity: string;
  identityPlaceholder: string;
  identityLabel: string;
  identityType: string;
  hasSchoolCode: boolean;
}

const ROLES: Record<RoleType, RoleConfig> = {
  ogrenci: {
    id: 'ogrenci',
    tabLabel: 'Öğrenci',
    heading: 'Öğrenci Girişi',
    subheading: 'Derslerinize ve hedeflerinize erişmek için bilgilerinizi girin.',
    buttonText: 'Giriş Yap',
    gradient: 'from-[#FF5A4D] to-[#FF7A50]',
    accentColor: '#FF5A4D',
    defaultCode: 'IST-1094',
    defaultIdentity: '20261048',
    identityLabel: 'Öğrenci Numarası veya T.C. Kimlik',
    identityPlaceholder: 'Örn: 20261048',
    identityType: 'text',
    hasSchoolCode: true,
  },
  ogretmen: {
    id: 'ogretmen',
    tabLabel: 'Öğretmen',
    heading: 'Öğretmen Girişi',
    subheading: 'Sınıflarınızı ve ders içeriklerinizi yönetmek için oturum açın.',
    buttonText: 'Giriş Yap',
    gradient: 'from-[#8B6CFF] to-[#A78BFA]',
    accentColor: '#8B6CFF',
    defaultCode: 'IST-1094',
    defaultIdentity: 'ogretmen@fenlisesi.k12.tr',
    identityLabel: 'Kurumsal E-Posta Adresi',
    identityPlaceholder: 'ad.soyad@okul.k12.tr',
    identityType: 'email',
    hasSchoolCode: true,
  },
  veli: {
    id: 'veli',
    tabLabel: 'Veli',
    heading: 'Veli Girişi',
    subheading: 'Öğrencinizin gelişim durumunu ve ders takibini anlık izleyin.',
    buttonText: 'Giriş Yap',
    gradient: 'from-[#0EA5E9] to-[#38BDF8]',
    accentColor: '#0EA5E9',
    defaultCode: '',
    defaultIdentity: '05321234567',
    identityLabel: 'Kayıtlı Telefon Numarası veya T.C.',
    identityPlaceholder: '05XX XXX XX XX',
    identityType: 'tel',
    hasSchoolCode: false,
  },
  idare: {
    id: 'idare',
    tabLabel: 'Okul İdaresi',
    heading: 'Okul İdaresi Girişi',
    subheading: 'Okul lisansları ve kurum ayarlarını yönetmek için giriş yapın.',
    buttonText: 'Giriş Yap',
    gradient: 'from-[#F59E0B] to-[#FBBF24]',
    accentColor: '#F59E0B',
    defaultCode: 'IST-1094',
    defaultIdentity: 'idare@fenlisesi.k12.tr',
    identityLabel: 'Yetkili Yönetici E-Postası',
    identityPlaceholder: 'idare@okul.k12.tr',
    identityType: 'email',
    hasSchoolCode: true,
  },
};

// Canvas Shooting Stars Animation Overlay
function ShootingStarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Shooting stars state
    interface Star {
      x: number;
      y: number;
      length: number;
      speed: number;
      size: number;
      opacity: number;
      dx: number;
      dy: number;
      color: string;
    }

    const shootingStars: Star[] = [];

    const createShootingStar = () => {
      // Spawn mainly from the top right / mid upper areas
      const startX = Math.random() * width * 0.9 + width * 0.1;
      const startY = Math.random() * height * 0.45;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // roughly 45 degrees
      const speed = Math.random() * 8 + 6;

      const colors = ['#FFFFFF', '#E9D5FF', '#FECDD3', '#BAE6FD'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 90 + 50,
        speed: speed,
        size: Math.random() * 1.6 + 0.8,
        opacity: 1,
        dx: -Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        color: color,
      });
    };

    let frameCount = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Periodically spawn shooting stars
      frameCount++;
      if (frameCount % 45 === 0 && shootingStars.length < 5) {
        createShootingStar();
      }

      // Update and draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];

        const tailX = star.x - (star.dx / star.speed) * star.length;
        const tailY = star.y - (star.dy / star.speed) * star.length;

        const grad = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
        grad.addColorStop(0, star.color);
        grad.addColorStop(0.3, 'rgba(255, 255, 255, ' + (star.opacity * 0.7) + ')');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = star.size;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Glowing star head
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Move star
        star.x += star.dx;
        star.y += star.dy;
        star.opacity -= 0.012;

        if (star.opacity <= 0 || star.x < -100 || star.y > height + 100) {
          shootingStars.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
}

// 3D Liquid Glass Logo Component
function LiquidGlassLogo({ mousePos }: { mousePos: { x: number; y: number } }) {
  return (
    <div 
      className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center transition-transform duration-200 ease-out"
      style={{
        perspective: '1200px',
      }}
    >
      {/* 3D Diagonal Floating Glass Slab */}
      <div 
        className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-[2.8rem] flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${16 + mousePos.y * 18}deg) rotateY(${-22 + mousePos.x * 18}deg) rotateZ(8deg)`,
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.03) 100%)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.35)',
          boxShadow: `
            0 35px 70px -15px rgba(0, 0, 0, 0.75),
            0 0 50px rgba(139, 108, 255, 0.25),
            inset 0 1px 2px rgba(255, 255, 255, 0.7),
            inset 0 -1px 2px rgba(0, 0, 0, 0.4)
          `,
        }}
      >
        {/* Prismatic Fluid Color Glows inside the Glass */}
        <div className="absolute inset-0 rounded-[2.8rem] bg-gradient-to-tr from-[#FF5A4D]/25 via-transparent to-[#8B6CFF]/30 pointer-events-none" />
        
        {/* Specular Diagonal Light Streak */}
        <div 
          className="absolute inset-0 rounded-[2.8rem] pointer-events-none opacity-60"
          style={{
            background: 'linear-gradient(115deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 45%, transparent 60%)',
          }}
        />

        {/* 3D Elevated OLTVIA Logo inside the Glass Prism */}
        <div 
          className="relative transition-transform duration-300"
          style={{
            transform: 'translateZ(50px)',
          }}
        >
          <svg 
            width="105" 
            height="105" 
            viewBox="0 0 100 100" 
            fill="none" 
            className="filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.65)]"
          >
            {/* Liquid Glass Main Ring Arc */}
            <path 
              d="M 78 28 A 36 36 0 1 0 78 72" 
              stroke="rgba(255, 255, 255, 0.9)" 
              strokeWidth="15" 
              strokeLinecap="round"
            />
            {/* Fluid Orbit Spheres */}
            <circle cx="78" cy="28" r="8" fill="#8B6CFF" className="filter drop-shadow-[0_0_12px_#8B6CFF]" />
            <circle cx="78" cy="72" r="8" fill="#FF5A4D" className="filter drop-shadow-[0_0_12px_#FF5A4D]" />
            <circle cx="45" cy="40" r="10" fill="rgba(255, 255, 255, 0.95)" />
            <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="rgba(255, 255, 255, 0.95)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Inner Content
function GirisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL param can be ogrenci, ogretmen, veli, kurumsal/idare
  const roleParam = searchParams.get('rol');
  const mappedRole: RoleType = 
    roleParam === 'ogretmen' ? 'ogretmen' :
    roleParam === 'veli' ? 'veli' :
    (roleParam === 'kurumsal' || roleParam === 'idare') ? 'idare' : 'ogrenci';

  const [activeRole, setActiveRole] = useState<RoleType>(mappedRole);
  const [schoolCode, setSchoolCode] = useState('');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (roleParam) {
      if (roleParam === 'ogretmen') setActiveRole('ogretmen');
      else if (roleParam === 'veli') setActiveRole('veli');
      else if (roleParam === 'kurumsal' || roleParam === 'idare') setActiveRole('idare');
      else setActiveRole('ogrenci');
    }
  }, [roleParam]);

  const config = ROLES[activeRole];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleFillDemo = () => {
    setSchoolCode(config.defaultCode);
    setIdentity(config.defaultIdentity);
    setPassword('oltvia2026');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (config.hasSchoolCode && !schoolCode.trim()) {
      setErrorMsg('Lütfen okul veya kurum kodunuzu giriniz.');
      return;
    }
    if (!identity.trim()) {
      setErrorMsg('Lütfen giriş kimlik bilginizi giriniz.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Lütfen şifrenizi giriniz.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Giriş başarılı. Yönlendiriliyorsunuz...');
      setTimeout(() => {
        router.push('/');
      }, 1200);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0E1015] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-[#FF5A4D]/30">
      
      {/* Main Unified Payoneer-Style Card Container */}
      <div className="w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-white/10 flex flex-col lg:flex-row min-h-[640px] bg-[#12141A]">
        
        {/* ================= LEFT SIDE: SPACE NEBULA + SHOOTING STARS + 3D LIQUID GLASS LOGO ================= */}
        <div 
          onMouseMove={handleMouseMove}
          className="w-full lg:w-1/2 relative min-h-[440px] lg:min-h-full flex flex-col justify-between p-8 sm:p-12 overflow-hidden select-none"
        >
          {/* Background Nebula Image (highlighting bright purple/red nebula clouds) */}
          <div 
            className="absolute inset-0 bg-cover bg-no-repeat bg-[center_right] pointer-events-none scale-105"
            style={{
              backgroundImage: "url('/images/space-nebula.jpg')",
            }}
          />

          {/* Deep Ambient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0F]/90 via-[#0A0B0F]/30 to-[#0A0B0F]/70 pointer-events-none" />

          {/* Shooting Stars Canvas Overlay */}
          <ShootingStarsCanvas />

          {/* Top Subtle Brand Tag */}
          <div className="relative z-20 flex items-center justify-between">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Ana Sayfaya Dön</span>
            </Link>

            <span className="text-[11px] font-mono tracking-widest uppercase text-white/40">
              OLTVIA
            </span>
          </div>

          {/* Center: 3D Liquid Glass Logo & Slogan (No extra telemetry/clutter) */}
          <div className="relative z-20 my-auto py-8 flex flex-col items-center justify-center text-center">
            {/* Liquid Glass 3D Tilted Logo */}
            <LiquidGlassLogo mousePos={mousePos} />

            {/* Slogan */}
            <div className="mt-8 space-y-2 max-w-sm">
              <span className="block text-[11px] font-semibold tracking-[0.3em] uppercase text-white/50">
                BEYOND LEARNING
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight drop-shadow-md">
                Beyond What You Know
              </h2>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="relative z-20 text-[11px] text-white/40 font-light">
            © 2026 OLTVIA Inc. Tüm hakları saklıdır.
          </div>
        </div>

        {/* ================= RIGHT SIDE: CRISP, EYE-FRIENDLY, PAYONEER-STYLE SIGN IN ================= */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-between p-8 sm:p-12 lg:p-14">
          
          {/* Top Brand & Status Row */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            {/* OLTVIA Brand Mark */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
                  <path d="M 78 28 A 36 36 0 1 0 78 72" stroke="#FFFFFF" strokeWidth="16" />
                  <circle cx="78" cy="28" r="8" fill="#8B6CFF" />
                  <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
                  <circle cx="45" cy="40" r="10" fill="#FFFFFF" />
                  <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="#FFFFFF" />
                </svg>
              </div>
              <span className="text-lg font-black tracking-widest text-gray-900 font-sans">
                OLTVIA
              </span>
            </Link>

            <span className="text-xs text-gray-400 font-medium">
              Güvenli Giriş
            </span>
          </div>

          {/* Central Form Container */}
          <div className="my-auto py-6 max-w-md w-full mx-auto">
            
            {/* Clean Minimal Role Switcher (Pill tabs) */}
            <div className="mb-7 p-1 bg-gray-100 rounded-full flex gap-1">
              {(Object.keys(ROLES) as RoleType[]).map((rKey) => {
                const r = ROLES[rKey];
                const isSelected = activeRole === rKey;
                return (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => {
                      setActiveRole(rKey);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all duration-200 text-center truncate ${
                      isSelected 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {r.tabLabel}
                  </button>
                );
              })}
            </div>

            {/* Title */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
                {config.heading}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-normal">
                {config.subheading}
              </p>
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Optional School Code */}
              {config.hasSchoolCode && (
                <div>
                  <input
                    type="text"
                    required
                    value={schoolCode}
                    onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                    placeholder="Okul / Kurum Kodu (Örn: IST-1094)"
                    className="w-full px-6 py-4 rounded-full border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all font-mono"
                  />
                </div>
              )}

              {/* Identity Field */}
              <div>
                <input
                  type={config.identityType}
                  required
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder={config.identityLabel}
                  className="w-full px-6 py-4 rounded-full border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all"
                />
              </div>

              {/* Password Field with Eye */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifre"
                  className="w-full px-6 py-4 pr-12 rounded-full border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-4 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs px-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-gray-500 hover:text-gray-700 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-0 cursor-pointer"
                  />
                  <span>Beni hatırla</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Şifrenizi unuttuysanız lütfen okulunuzun öğrenci işleri veya idaresiyle iletişime geçiniz.')}
                  className="font-medium text-[#FF5A4D] hover:underline"
                >
                  Şifremi unuttum?
                </button>
              </div>

              {/* Payoneer-Style Gradient Pill Sign-In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 mt-2 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all duration-300 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 bg-gradient-to-r ${config.gradient}`}
                style={{
                  boxShadow: `0 12px 25px -5px ${config.accentColor}50`,
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Giriş Yapılıyor...</span>
                  </>
                ) : (
                  <>
                    <ArrowRight size={18} />
                    <span>{config.buttonText}</span>
                  </>
                )}
              </button>

              {/* Subtle Demo Quick Fill Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-xs text-gray-400 hover:text-gray-700 transition-colors inline-flex items-center gap-1.5 font-medium"
                >
                  <Sparkles size={13} style={{ color: config.accentColor }} />
                  <span>{config.tabLabel} demo bilgileriyle otomatik doldur</span>
                </button>
              </div>
            </form>
          </div>

          {/* Clean Minimalist Bottom Footer */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <div>© 2026 OLTVIA Inc.</div>
            <div className="flex items-center gap-4">
              <Link href="/#iletisim" className="hover:text-gray-700 transition-colors">
                Bize Ulaşın
              </Link>
              <span>•</span>
              <Link href="/kullanim-sartlari" className="hover:text-gray-700 transition-colors">
                Kullanım Şartları
              </Link>
              <span>•</span>
              <Link href="/gizlilik" className="hover:text-gray-700 transition-colors">
                Gizlilik
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function GirisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0E1015] flex items-center justify-center text-white font-sans">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin text-[#FF5A4D]" size={24} />
          <span className="text-sm font-medium tracking-wide">Yükleniyor...</span>
        </div>
      </div>
    }>
      <GirisContent />
    </Suspense>
  );
}
