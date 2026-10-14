"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Rocket, Network, Shield, Building2, 
  ArrowLeft, Lock, School, KeyRound, 
  User, CheckCircle2, AlertCircle, Sparkles, Loader2,
  Brain, Zap, Target, Flame, Users, BookOpen,
  ChevronRight, Eye, EyeOff, Laptop, BarChart3, Globe
} from 'lucide-react';

type RoleType = 'ogrenci' | 'ogretmen' | 'veli' | 'kurumsal';

interface RoleConfig {
  id: RoleType;
  title: string;
  tabLabel: string;
  tagline: string;
  subSlogan: string;
  color: string;
  secondaryColor: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  defaultCode: string;
  defaultIdentity: string;
  identityPlaceholder: string;
  identityLabel: string;
  telemetry: {
    tag: string;
    title: string;
    stat: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
  }[];
  floatingBadges: {
    text: string;
    sub: string;
    icon: string;
  }[];
}

const ROLES: Record<RoleType, RoleConfig> = {
  ogrenci: {
    id: 'ogrenci',
    tabLabel: 'Öğrenci',
    title: 'Öğrenci Girişi',
    tagline: 'Sınırların Ötesinde, Kendi Hızında Öğren.',
    subSlogan: 'Sokratik yapay zeka mentörün sorularınla şekillenir, takıldığın her an hedefe giden rotanı yeniden hesaplar.',
    color: '#FF5A4D',
    secondaryColor: '#FF7A6E',
    glowColor: 'rgba(255, 90, 77, 0.35)',
    icon: Rocket,
    defaultCode: 'IST-1094',
    defaultIdentity: '20261048',
    identityLabel: 'Öğrenci Numarası / T.C. Kimlik',
    identityPlaceholder: 'Örn: 20261048 veya 12345678901',
    telemetry: [
      { tag: 'Sokratik Mentör', title: 'Aktif Öğrenme İndeksi', stat: '%98.4 Odak', icon: Brain },
      { tag: 'Hedef Rotası', title: 'Boğaziçi Bilgisayar', stat: '420 Puan Net', icon: Target },
      { tag: 'Günlük Seri', title: 'Düzenli Çalışma', stat: '14 Gün Streak 🔥', icon: Flame },
    ],
    floatingBadges: [
      { text: 'Fizik & Türev Çözümleri', sub: 'Anlık Sokratik Açıklama', icon: '⚡' },
      { text: 'AI Kişisel Müfredat', sub: 'Boşluksuz Öğrenme Algoritması', icon: '🎯' },
    ],
  },
  ogretmen: {
    id: 'ogretmen',
    tabLabel: 'Öğretmen',
    title: 'Öğretmen Girişi',
    tagline: 'Yapay Zeka Destekli Müfredat ve Sınıf Hakimiyeti.',
    subSlogan: 'Öğrencilerinizin zayıf kaldığı kazanımları saniyeler içinde analiz edin, saniyeler içinde kişiselleştirilmiş ödev setleri oluşturun.',
    color: '#8B6CFF',
    secondaryColor: '#A78BFA',
    glowColor: 'rgba(139, 108, 255, 0.35)',
    icon: Network,
    defaultCode: 'IST-1094',
    defaultIdentity: 'ogretmen@fenlisesi.k12.tr',
    identityLabel: 'Kurumsal Eğitmen E-Postası',
    identityPlaceholder: 'ad.soyad@okul.k12.tr',
    telemetry: [
      { tag: 'Sınıf Analitiği', title: '12-A Genel Kavrama', stat: '%94.2 Başarı', icon: BarChart3 },
      { tag: 'AI Ödev Motoru', title: 'Oluşturulan Farklılaşmış Set', stat: '28 Öğrenciye Özel', icon: Zap },
      { tag: 'Aktif Sınıflar', title: 'Toplam Bağlı Öğrenci', stat: '142 Öğrenci', icon: Users },
    ],
    floatingBadges: [
      { text: 'Kazanım Isı Haritası', sub: 'Eksik Konular Önceden Belirlenir', icon: '📊' },
      { text: 'Otomatik Ödev Analizi', sub: 'Detaylı Adım Adım İnceleme', icon: '✨' },
    ],
  },
  veli: {
    id: 'veli',
    tabLabel: 'Veli',
    title: 'Veli Girişi',
    tagline: 'Çocuğunuzun Eğitiminde Tam Şeffaflık ve Güven.',
    subSlogan: 'Ezbere dayalı notlar yerine bilişsel kavrama düzeyini, günlük odaklanma süresini ve ders gelişimini anbean takip edin.',
    color: '#0EA5E9',
    secondaryColor: '#38BDF8',
    glowColor: 'rgba(14, 165, 233, 0.35)',
    icon: Shield,
    defaultCode: 'IST-1094',
    defaultIdentity: '05321234567',
    identityLabel: 'Kayıtlı Veli Telefonu / T.C.',
    identityPlaceholder: '05XX XXX XX XX',
    telemetry: [
      { tag: 'Gelişim Takibi', title: 'Haftalık Verimli Süre', stat: '34 Saat 20 Dk', icon: BookOpen },
      { tag: 'Güvenlik & Gizlilik', title: 'Veri Koruma Standardı', stat: '256-Bit Uçtan Uca', icon: Shield },
      { tag: 'Bilişsel Denge', title: 'Motivasyon & İstikrar', stat: 'Yüksek İstikrar', icon: Sparkles },
    ],
    floatingBadges: [
      { text: 'Canlı Çalışma Bildirimi', sub: 'Matematik Oturumu Tamamlandı', icon: '🔔' },
      { text: 'Haftalık Gelişim Raporu', sub: 'PDR Onaylı Özet', icon: '📈' },
    ],
  },
  kurumsal: {
    id: 'kurumsal',
    tabLabel: 'Okul İdaresi',
    title: 'Okul İdaresi Girişi',
    tagline: 'Tüm Kampüsler İçin Akıllı Bütünleşik Yönetim.',
    subSlogan: 'Sınıf kotalarından öğretmen atamalarına, yapay zeka lisans tüketiminden okul geneli başarı grafiğine kadar tam kurumsal denetim.',
    color: '#F59E0B',
    secondaryColor: '#FBBF24',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    icon: Building2,
    defaultCode: 'IST-1094',
    defaultIdentity: 'yonetim@fenlisesi.k12.tr',
    identityLabel: 'Yetkili Yönetici E-Postası',
    identityPlaceholder: 'mudur@okul.k12.tr',
    telemetry: [
      { tag: 'Lisans Durumu', title: 'Aktif Öğrenci Kotası', stat: '1.250 / 1.500', icon: Laptop },
      { tag: 'Kampüs Senkronu', title: 'Bağlı Şube Sayısı', stat: '4 Kampüs Aktif', icon: Globe },
      { tag: 'Sistem Sağlığı', title: 'Bulut AI Altyapısı', stat: '%99.98 Uptime', icon: Zap },
    ],
    floatingBadges: [
      { text: 'Merkezi Lisans Paneli', sub: 'Anlık AI Token Kullanım Raporu', icon: '🏛️' },
      { text: 'Öğretmen Yetkilendirme', sub: 'Tek Tıkla Sınıf Dağıtımı', icon: '🔑' },
    ],
  },
};

// 3D Canvas / Particle Mesh Visualizer
function Interactive3DScene({ roleConfig }: { roleConfig: RoleConfig }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 42;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2.5 + 1.2,
      depth: Math.random() * 0.8 + 0.2,
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle gradient background glow
      const cx = width * 0.5 + mousePos.x * 30;
      const cy = height * 0.45 + mousePos.y * 30;
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.55);
      grad.addColorStop(0, roleConfig.glowColor);
      grad.addColorStop(0.6, 'rgba(20, 22, 26, 0.4)');
      grad.addColorStop(1, 'rgba(11, 12, 15, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw connecting neural lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = roleConfig.color;
            ctx.globalAlpha = (1 - dist / 120) * 0.18;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update & Draw particles
      particles.forEach((p) => {
        p.x += p.vx + mousePos.x * 0.3 * p.depth;
        p.y += p.vy + mousePos.y * 0.3 * p.depth;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.depth, 0, Math.PI * 2);
        ctx.fillStyle = roleConfig.color;
        ctx.globalAlpha = 0.45 * p.depth;
        ctx.fill();
      });

      // Central rotating 3D orbital rings
      angle += 0.015;
      const ringRadius = 140;

      // Outer ellipse
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle * 0.7);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRadius, ringRadius * 0.42, Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = roleConfig.color;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.stroke();
      ctx.restore();

      // Inner counter-rotating ellipse
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-angle * 1.1);
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRadius * 0.75, ringRadius * 0.3, -Math.PI / 3, 0, Math.PI * 2);
      ctx.strokeStyle = roleConfig.secondaryColor;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.restore();

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [roleConfig, mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full min-h-[520px] lg:min-h-full flex flex-col justify-between p-8 lg:p-14 overflow-hidden select-none"
    >
      {/* Dynamic Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Top Brand & Tag */}
      <div className="relative z-10 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-3 group transition-transform hover:scale-105"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center backdrop-blur-md shadow-lg group-hover:border-white/30 transition-all">
            <svg width="26" height="26" viewBox="0 0 100 100" fill="none">
              <path d="M 78 28 A 36 36 0 1 0 78 72" stroke="#F2F1ED" strokeWidth="16" />
              <circle cx="78" cy="28" r="8" fill="#8B6CFF" />
              <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
              <circle cx="45" cy="40" r="10" fill="#F2F1ED" />
              <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="#F2F1ED" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-widest text-[#F2F1ED] font-sans">OLTVIA</span>
        </Link>

        {/* Ambient Mode Pill */}
        <div 
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 border backdrop-blur-xl transition-all duration-500 shadow-md"
          style={{
            borderColor: roleConfig.color + '40',
            backgroundColor: roleConfig.color + '15',
            color: roleConfig.secondaryColor,
          }}
        >
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: roleConfig.color }} />
          <span>{roleConfig.tabLabel} Ekosistemi</span>
        </div>
      </div>

      {/* Central 3D Interactive Emblem & Floating Badges */}
      <div className="relative z-10 my-auto py-12 flex flex-col items-center justify-center">
        {/* 3D Holographic Core */}
        <div 
          className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transform: `perspective(1000px) rotateY(${mousePos.x * 25}deg) rotateX(${-mousePos.y * 25}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Luminous Core Glow */}
          <div 
            className="absolute inset-4 rounded-full blur-3xl opacity-60 animate-pulse transition-colors duration-700"
            style={{ backgroundColor: roleConfig.color, animationDuration: '4s' }}
          />

          {/* Concentric Gyro Rings */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-dashed opacity-40 animate-spin"
            style={{ 
              borderColor: roleConfig.color, 
              animationDuration: '24s' 
            }}
          />
          <div 
            className="absolute inset-4 rounded-full border border-white/20 animate-spin"
            style={{ 
              animationDuration: '18s',
              animationDirection: 'reverse' 
            }}
          />

          {/* Central 3D Floating Logo Badge */}
          <div 
            className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#14161A]/85 border border-white/20 backdrop-blur-2xl flex items-center justify-center shadow-2xl transition-transform duration-300"
            style={{
              transform: 'translateZ(40px)',
              boxShadow: `0 20px 50px -10px ${roleConfig.color}50, inset 0 1px 1px rgba(255,255,255,0.4)`
            }}
          >
            <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
              <path d="M 78 28 A 36 36 0 1 0 78 72" stroke="#F2F1ED" strokeWidth="16" />
              <circle cx="78" cy="28" r="8" fill={roleConfig.color} />
              <circle cx="78" cy="72" r="8" fill={roleConfig.secondaryColor} />
              <circle cx="45" cy="40" r="10" fill="#F2F1ED" />
              <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="#F2F1ED" />
            </svg>
          </div>

          {/* Floating Orbiting Satellite Badges */}
          <div 
            className="absolute -top-4 -right-12 sm:-right-8 px-4 py-2 rounded-2xl bg-[#14161A]/90 border border-white/15 backdrop-blur-xl shadow-xl flex items-center gap-2.5 transition-all duration-500 hover:scale-105"
            style={{ transform: `translateZ(60px) translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)` }}
          >
            <span className="text-base">{roleConfig.floatingBadges[0].icon}</span>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-none">{roleConfig.floatingBadges[0].text}</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">{roleConfig.floatingBadges[0].sub}</p>
            </div>
          </div>

          <div 
            className="absolute -bottom-6 -left-12 sm:-left-8 px-4 py-2 rounded-2xl bg-[#14161A]/90 border border-white/15 backdrop-blur-xl shadow-xl flex items-center gap-2.5 transition-all duration-500 hover:scale-105"
            style={{ transform: `translateZ(50px) translate(${-mousePos.x * 15}px, ${-mousePos.y * 15}px)` }}
          >
            <span className="text-base">{roleConfig.floatingBadges[1].icon}</span>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-none">{roleConfig.floatingBadges[1].text}</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">{roleConfig.floatingBadges[1].sub}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Punchy Hero Slogan (Envato style) */}
        <div className="text-center max-w-lg mt-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F2F1ED] leading-[1.15] tracking-tight">
            {roleConfig.tagline}
          </h1>
          <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed font-light">
            {roleConfig.subSlogan}
          </p>
        </div>
      </div>

      {/* Bottom Live Telemetry Strip */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/[0.08]">
        {roleConfig.telemetry.map((t, idx) => {
          const IconComp = t.icon;
          return (
            <div 
              key={idx}
              className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md flex items-center gap-3 group hover:border-white/20 transition-all"
            >
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: roleConfig.color + '20', color: roleConfig.color }}
              >
                <IconComp size={18} />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]/80 block truncate">
                  {t.tag}
                </span>
                <span className="text-xs font-bold text-white block truncate">
                  {t.stat}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Main Sign In Content Component
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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const roleParam = searchParams.get('rol') as RoleType;
    if (roleParam && ROLES[roleParam]) {
      setActiveRole(roleParam);
    }
  }, [searchParams]);

  const config = ROLES[activeRole];

  // Fill demo credentials
  const handleFillDemo = () => {
    setInstitutionCode(config.defaultCode);
    setIdentity(config.defaultIdentity);
    setPassword('oltvıa2026');
    setErrorMsg(null);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (activeRole !== 'veli' && !institutionCode.trim()) {
      setErrorMsg('Lütfen okulunuz tarafından sağlanan Kurum Kodunu giriniz.');
      return;
    }
    if (!identity.trim()) {
      setErrorMsg('Lütfen giriş kimlik bilginizi eksiksiz doldurunuz.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Lütfen şifrenizi giriniz.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Kimlik başarıyla doğrulandı. Portala aktarılıyorsunuz...');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0D0E12] text-[#F2F1ED] font-sans flex flex-col lg:flex-row overflow-hidden selection:bg-[#FF5A4D]/30">
      
      {/* ================= LEFT VISUAL / 3D CANVAS STAGE (55%) ================= */}
      <div className="w-full lg:w-[54%] xl:w-[56%] bg-gradient-to-br from-[#12141A] via-[#0E1015] to-[#0A0B0E] relative border-b lg:border-b-0 lg:border-r border-white/[0.08] flex items-center">
        <Interactive3DScene roleConfig={config} />
      </div>

      {/* ================= RIGHT AUTHENTICATION COLUMN (45%) ================= */}
      <div className="w-full lg:w-[46%] xl:w-[44%] bg-[#121418] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-y-auto">
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#9CA3AF] hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Ana Sayfaya Dön</span>
          </Link>

          <span className="text-xs font-mono text-[#9CA3AF]/60 tracking-wider">
            v2.6 SECURE SIGN-IN
          </span>
        </div>

        {/* Central Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          
          {/* Role Switcher Pills */}
          <div className="mb-8">
            <span className="block text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]/70 mb-3">
              Giriş Profilini Seçin
            </span>
            <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
              {(Object.keys(ROLES) as RoleType[]).map((rKey) => {
                const r = ROLES[rKey];
                const isSelected = activeRole === rKey;
                const IconComponent = r.icon;

                return (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => {
                      setActiveRole(rKey);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                      isSelected 
                        ? 'bg-white/[0.09] text-white shadow-lg scale-[1.02]' 
                        : 'text-[#9CA3AF] hover:text-white hover:bg-white/[0.03]'
                    }`}
                    style={{
                      borderBottom: isSelected ? '2px solid ' + r.color : '2px solid transparent',
                    }}
                  >
                    <IconComponent 
                      size={15} 
                      style={{ color: isSelected ? r.color : '#9CA3AF' }} 
                    />
                    <span className="tracking-tight truncate">{r.tabLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-2 mb-2">
              <span 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span 
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: config.color }}
              >
                {config.tabLabel} Portalı
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {config.title}
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">
              Okul idareniz tarafından verilen kurumsal bilgilerinizle oturum açın.
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 animate-shake">
              <AlertCircle size={18} className="flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Institution Code (Except Veli) */}
            {activeRole !== 'veli' && (
              <div>
                <label className="text-xs font-semibold text-[#9CA3AF] flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5">
                    <School size={14} className="text-white/40" />
                    Okul / Kurum Kodu
                  </span>
                  <span className="text-[11px] text-[#9CA3AF]/60 font-mono">Örn: IST-1094</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={institutionCode}
                    onChange={(e) => setInstitutionCode(e.target.value.toUpperCase())}
                    placeholder="Örn: IST-1094"
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white placeholder-white/20 text-sm font-mono tracking-wider focus:outline-none focus:border-white/40 transition-all"
                    style={{
                      caretColor: config.color,
                    }}
                  />
                  <div className="absolute right-3 top-3.5 text-xs text-white/30 font-mono">K12</div>
                </div>
              </div>
            )}

            {/* Identity Field */}
            <div>
              <label className="text-xs font-semibold text-[#9CA3AF] flex items-center gap-1.5 mb-2">
                <User size={14} className="text-white/40" />
                {config.identityLabel}
              </label>
              <input
                type={activeRole === 'ogretmen' || activeRole === 'kurumsal' ? 'email' : 'text'}
                required
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder={config.identityPlaceholder}
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/40 transition-all"
                style={{
                  caretColor: config.color,
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#9CA3AF] flex items-center gap-1.5">
                  <KeyRound size={14} className="text-white/40" />
                  Giriş Şifresi / PIN
                </label>
                <button
                  type="button"
                  onClick={() => alert('Şifrenizi unuttuysanız lütfen okulunuzun bilgi işlem birimi veya idaresiyle iletişime geçiniz.')}
                  className="text-xs text-[#9CA3AF]/70 hover:text-white transition-colors"
                >
                  Şifremi Unuttum?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white placeholder-white/20 text-sm tracking-widest focus:outline-none focus:border-white/40 transition-all pr-12"
                  style={{
                    caretColor: config.color,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me & SSL Badge */}
            <div className="flex items-center justify-between text-xs text-[#9CA3AF] pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/10 border-white/20 text-white focus:ring-0 cursor-pointer"
                />
                <span>Bu cihazda beni hatırla</span>
              </label>

              <span className="flex items-center gap-1 text-[#10B981] font-mono text-[11px]">
                <Lock size={12} /> 256-Bit SSL
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-2 rounded-xl text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 shadow-xl"
              style={{
                backgroundColor: config.color,
                boxShadow: `0 10px 30px -5px ${config.color}50`,
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Doğrulanıyor...</span>
                </>
              ) : (
                <>
                  <span>{config.title} Yap</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>

            {/* Demo Quick Fill Button */}
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-semibold text-[#9CA3AF] hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={14} style={{ color: config.color }} />
              <span>{config.tabLabel} Demo Bilgileriyle Doldur</span>
            </button>
          </form>

          {/* Institutional Note */}
          <div className="mt-8 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 text-xs text-[#9CA3AF] leading-relaxed">
            <School size={16} className="text-[#8B6CFF] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Kurumsal Erişim Bilgisi: </span>
              OLTVIA kapalı devre okul ve kolej ekosistemidir. Genel halka açık kayıt bulunmaz; tüm öğrenci, eğitmen ve veli erişimleri okul yönetimi tarafından tanımlanır.
            </div>
          </div>
        </div>

        {/* Bottom Footer Links */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9CA3AF]/60">
          <div>© 2026 OLTVIA INC. BEYOND WHAT YOU KNOW.</div>
          <div className="flex items-center gap-4">
            <Link href="/kullanim-sartlari" className="hover:text-white transition-colors">
              Kullanım Şartları
            </Link>
            <span>•</span>
            <Link href="/gizlilik" className="hover:text-white transition-colors">
              Gizlilik Politikası
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function GirisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D0E12] flex items-center justify-center text-white font-sans">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin text-[#FF5A4D]" size={24} />
          <span className="text-sm font-semibold tracking-wider">OLTVIA Portalı Yükleniyor...</span>
        </div>
      </div>
    }>
      <GirisContent />
    </Suspense>
  );
}
