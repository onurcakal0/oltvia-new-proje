"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowRight, ArrowLeft, Eye, EyeOff, 
  Sparkles, Loader2, CheckCircle2, AlertCircle, X,
  Mail, Smartphone, ShieldCheck, KeyRound, Lock, RefreshCw, Check
} from 'lucide-react';
import OltviaLandingPage from '../page';

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

// Canvas Shooting Stars Animation Overlay (Slow, occasional, elegant)
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
    let nextSpawnDelay = 180 + Math.floor(Math.random() * 120); // ~4-5 seconds between spawns
    let frameCount = 0;

    const createShootingStar = () => {
      const startX = Math.random() * width * 0.75 + width * 0.2;
      const startY = Math.random() * height * 0.35;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.15;
      const speed = Math.random() * 3.5 + 4; // Smooth, gentle gliding speed

      const colors = ['#FFFFFF', '#E9D5FF', '#FECDD3', '#BAE6FD'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 75 + 45,
        speed: speed,
        size: Math.random() * 1.5 + 0.8,
        opacity: 0.95,
        dx: -Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        color: color,
      });

      // Reset next spawn time to 220-360 frames (arada bir kaysın)
      nextSpawnDelay = 220 + Math.floor(Math.random() * 140);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      frameCount++;
      if (frameCount >= nextSpawnDelay && shootingStars.length < 2) {
        createShootingStar();
        frameCount = 0;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];

        const tailX = star.x - (star.dx / star.speed) * star.length;
        const tailY = star.y - (star.dy / star.speed) * star.length;

        const grad = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
        grad.addColorStop(0, star.color);
        grad.addColorStop(0.25, 'rgba(255, 255, 255, ' + (star.opacity * 0.6) + ')');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = star.size;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Glowing star tip
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        star.x += star.dx;
        star.y += star.dy;
        star.opacity -= 0.009; // Longer, softer fade

        if (star.opacity <= 0 || star.x < -80 || star.y > height + 80) {
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

// 3D Isometric Glass Block Logo (Exact match to user's sketch)
function LiquidGlassLogo({ mousePos }: { mousePos: { x: number; y: number } }) {
  return (
    <div 
      className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center select-none"
      style={{ perspective: '1200px' }}
    >
      {/* Cosmic Caustic Glow & Ambient Space Shadow under the Block */}
      <div 
        className="absolute w-60 h-60 rounded-full blur-3xl opacity-70 pointer-events-none transition-transform duration-300"
        style={{
          transform: `translateY(45px) scaleY(0.48) translate(${mousePos.x * 20}px, ${mousePos.y * 15}px)`,
          background: 'radial-gradient(circle, rgba(139, 108, 255, 0.45) 0%, rgba(255, 90, 77, 0.25) 45%, transparent 75%)',
        }}
      />

      {/* 3D Isometric Glass Block Assembly */}
      <div 
        className="relative w-52 h-52 sm:w-56 sm:h-56 rounded-[2.5rem] transition-transform duration-200 ease-out"
        style={{
          // Isometric tilt matching the sketch: elevated top face, visible bottom/side thickness
          transform: `rotateX(${55 + mousePos.y * 10}deg) rotateZ(${-28 + mousePos.x * 10}deg) rotateY(${3 + mousePos.x * 5}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Base Layer: Translucent glass bottom sitting directly in the nebula */}
        <div 
          className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
          style={{
            transform: 'translateZ(0px)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            boxShadow: `
              0 30px 60px -10px rgba(0, 0, 0, 0.85),
              0 0 45px rgba(139, 108, 255, 0.3)
            `,
          }}
        />

        {/* Transparent Extrusion Slices (Creates physical crystal block thickness) */}
        {[5, 10, 15, 20, 25].map((z) => (
          <div
            key={z}
            className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
            style={{
              transform: `translateZ(${z}px)`,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.015)',
              backdropFilter: 'blur(8px)',
            }}
          />
        ))}

        {/* Top Face: Solid Glass Block Surface where the OLTVIA Logo sits */}
        <div 
          className="absolute inset-0 rounded-[2.5rem] flex items-center justify-center p-6 backdrop-blur-2xl"
          style={{
            transform: 'translateZ(30px)',
            transformStyle: 'preserve-3d',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.45)',
            boxShadow: `
              inset 0 2px 4px rgba(255, 255, 255, 0.75),
              inset 0 -2px 4px rgba(0, 0, 0, 0.4),
              0 10px 25px -5px rgba(0, 0, 0, 0.5)
            `,
          }}
        >
          {/* Prismatic Specular Light Sheen across top glass face */}
          <div 
            className="absolute inset-0 rounded-[2.5rem] pointer-events-none opacity-60"
            style={{
              background: 'linear-gradient(120deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 55%)',
            }}
          />

          {/* Refractive Nebula Glow inside the top surface */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-[#FF5A4D]/20 via-transparent to-[#8B6CFF]/25 pointer-events-none" />

          {/* OLTVIA Logo sitting directly on top of the block (from the user's sketch) */}
          <div 
            className="relative flex items-center justify-center transition-transform duration-200"
            style={{ 
              transform: 'translateZ(18px)',
            }}
          >
            <svg 
              width="100" 
              height="100" 
              viewBox="0 0 100 100" 
              fill="none" 
              className="filter drop-shadow-[0_10px_18px_rgba(0,0,0,0.65)]"
            >
              {/* Main Arc */}
              <path 
                d="M 78 28 A 36 36 0 1 0 78 72" 
                stroke="rgba(255, 255, 255, 0.95)" 
                strokeWidth="15" 
                strokeLinecap="round" 
              />
              {/* Glowing Purple Satellite Orb */}
              <circle 
                cx="78" 
                cy="28" 
                r="8.5" 
                fill="#8B6CFF" 
                className="filter drop-shadow-[0_0_14px_#8B6CFF]" 
              />
              {/* Glowing Coral Satellite Orb */}
              <circle 
                cx="78" 
                cy="72" 
                r="8.5" 
                fill="#FF5A4D" 
                className="filter drop-shadow-[0_0_14px_#FF5A4D]" 
              />
              {/* Center Core Dot and Triangle */}
              <circle cx="45" cy="40" r="10" fill="#FFFFFF" />
              <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="#FFFFFF" />
            </svg>
          </div>
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

  // View mode: 'login' | 'forgot'
  const [viewMode, setViewMode] = useState<'login' | 'forgot'>('login');

  // Forgot password flow states
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3 | 4>(1);
  const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email');
  const [resetContact, setResetContact] = useState('');
  const [resetSchoolCode, setResetSchoolCode] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState<string>('');
  const [demoOtpCode, setDemoOtpCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);


  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Countdown timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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

  // OTP handlers
  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const nextDigits = [...otpDigits];
    nextDigits[index] = val.slice(-1);
    setOtpDigits(nextDigits);

    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const nextDigits = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      nextDigits[i] = pasted[i];
    }
    setOtpDigits(nextDigits);
    const nextIdx = Math.min(pasted.length, 5);
    otpRefs.current[nextIdx]?.focus();
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1/auth';

  // Forgot password flow submit handlers
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (config.hasSchoolCode && !resetSchoolCode.trim()) {
      setErrorMsg('Lütfen okul / kurum kodunuzu giriniz.');
      return;
    }
    if (!resetContact.trim()) {
      setErrorMsg(resetMethod === 'email' ? 'Lütfen kayıtlı e-posta adresinizi giriniz.' : 'Lütfen kayıtlı telefon numaranızı giriniz.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: resetMethod,
          contact: resetContact.trim(),
          school_code: resetSchoolCode.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Doğrulama kodu gönderilemedi. Lütfen bilgilerinizi kontrol ediniz.');
      }

      if (data.demo_code) {
        setDemoOtpCode(data.demo_code);
      }

      setForgotStep(2);
      setTimer(data.expires_in_seconds || 120);
      setIsTimerRunning(true);
      setSuccessMsg(data.message || `${resetContact} adresinize 6 haneli doğrulama kodu gönderildi.`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Sunucuya bağlanırken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const fullCode = otpDigits.join('');
    if (fullCode.length < 6) {
      setErrorMsg('Lütfen 6 haneli doğrulama kodunu eksiksiz giriniz.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: resetContact.trim(),
          code: fullCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Doğrulama kodu geçersiz veya süresi dolmuş.');
      }

      setResetToken(data.reset_token);
      setForgotStep(3);
      setSuccessMsg(data.message || 'Kimliğiniz başarıyla doğrulandı. Lütfen yeni şifrenizi belirleyin.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Kod doğrulanamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: resetMethod,
          contact: resetContact.trim(),
          school_code: resetSchoolCode.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Yeni kod gönderilemedi.');
      }

      if (data.demo_code) {
        setDemoOtpCode(data.demo_code);
      }

      setSuccessMsg(data.message || 'Yeni doğrulama kodu başarıyla iletildi.');
      setTimer(data.expires_in_seconds || 120);
      setIsTimerRunning(true);
      setOtpDigits(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch (err: any) {
      setErrorMsg(err.message || 'Yeni kod gönderilirken hata oluştu.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg('Şifreniz en az 6 karakter uzunluğunda olmalıdır.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Girdiğiniz şifreler birbiriyle eşleşmiyor.');
      return;
    }
    if (!resetToken) {
      setErrorMsg('Doğrulama anahtarı bulunamadı. Lütfen işlemi baştan başlatın.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reset_token: resetToken,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Şifre güncellenemedi.');
      }

      setForgotStep(4);
      setSuccessMsg(data.message || 'Şifreniz başarıyla güncellendi!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Şifre sıfırlanırken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishReset = () => {
    setViewMode('login');
    setForgotStep(1);
    setResetContact('');
    setResetSchoolCode('');
    setOtpDigits(['', '', '', '', '', '']);
    setPassword(newPassword);
    setSuccessMsg('Şifreniz başarıyla güncellendi! Yeni şifrenizle hemen giriş yapabilirsiniz.');
  };

  const handleFillDemoForgot = () => {
    if (forgotStep === 1) {
      setResetSchoolCode(config.defaultCode);
      setResetContact(resetMethod === 'email' ? config.defaultIdentity : '05321234567');
      setErrorMsg(null);
    } else if (forgotStep === 2) {
      const codeToFill = demoOtpCode || '482916';
      setOtpDigits(codeToFill.split('').slice(0, 6));
      setErrorMsg(null);
    } else if (forgotStep === 3) {
      setNewPassword('oltvia2026');
      setConfirmPassword('oltvia2026');
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const payload: Record<string, any> = {
        role: activeRole,
        password: password.trim(),
      };

      if (config.hasSchoolCode) {
        payload.school_code = schoolCode.trim().toUpperCase();
      }

      if (activeRole === 'ogrenci') {
        payload.student_number = identity.trim();
      } else if (activeRole === 'ogretmen' || activeRole === 'idare') {
        payload.email = identity.trim();
      } else if (activeRole === 'veli') {
        payload.phone = identity.trim();
      }

      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Giriş yapılamadı. Bilgilerinizi kontrol ediniz.');
      }

      // Token ve kullanıcı profilini localStorage'a yaz
      if (typeof window !== 'undefined') {
        localStorage.setItem('oltvia_token', data.access_token);
        localStorage.setItem('oltvia_user', JSON.stringify(data.user));
      }

      setSuccessMsg(`Hoş geldiniz, ${data.user?.full_name || 'Kullanıcı'}! Giriş başarılı. Yönlendiriliyorsunuz...`);
      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Sunucuya bağlanırken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-[#FF5A4D]/30 overflow-x-hidden">
      
      {/* 1. ACTUAL SITE IN THE BACKGROUND (Vividly blurred & clearly visible on the sides) */}
      <div 
        className="fixed inset-0 pointer-events-none select-none overflow-hidden -z-20 filter blur-[8px] scale-[1.12] opacity-85 brightness-105"
        aria-hidden="true"
      >
        <OltviaLandingPage />
      </div>

      {/* Vibrant Ambient Glows to enrich the side spaces */}
      <div className="fixed top-1/3 -left-24 w-[28rem] h-[28rem] bg-[#FF5A4D]/25 rounded-full blur-[110px] pointer-events-none -z-15" />
      <div className="fixed bottom-1/3 -right-24 w-[28rem] h-[28rem] bg-[#8B6CFF]/25 rounded-full blur-[110px] pointer-events-none -z-15" />

      {/* 2. TRANSLUCENT FROSTED GLASS BACKDROP (Soft tint so site is fully visible) */}
      <Link 
        href="/"
        className="fixed inset-0 bg-[#07080B]/35 backdrop-blur-[3px] -z-10 cursor-default"
        title="Kapatmak için dışarı tıklayın"
      />

      {/* 3. MODAL CONTAINER WITH CLOSE BUTTON */}
      <div className="relative w-full max-w-4xl lg:max-w-[55rem] z-10 my-auto animate-in fade-in zoom-in-95 duration-300">
        
        {/* Floating Close (X) Button */}
        <Link 
          href="/"
          className="absolute -top-3.5 -right-3.5 sm:-top-5 sm:-right-5 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/30 border border-white/30 text-white flex items-center justify-center backdrop-blur-2xl transition-all shadow-2xl hover:scale-110 z-50 group"
          title="Ana Sayfaya Dön"
        >
          <X size={18} className="transition-transform group-hover:rotate-90 text-white" />
        </Link>

        {/* Main Unified Payoneer-Style Card Container */}
        <div className="w-full rounded-[2.5rem] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.85),_0_0_60px_rgba(139,108,255,0.18)] border border-white/20 flex flex-col lg:flex-row min-h-[620px] bg-[#12141A]">
          
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
            
            {/* Alerts */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-2 animate-shake">
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

            {viewMode === 'login' ? (
              <>
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

                {/* Login Form */}
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
                      onClick={() => {
                        setViewMode('forgot');
                        setForgotStep(1);
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
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
              </>
            ) : (
              /* FORGOT PASSWORD MULTI-STEP VERIFICATION FLOW */
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Top Back to Login Link & Progress Indicator */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('login');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors group"
                  >
                    <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                    <span>Giriş Yap'a Dön</span>
                  </button>

                  {/* Step indicators */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                    <span 
                      className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={{ 
                        backgroundColor: forgotStep === 1 ? config.accentColor + '15' : 'transparent',
                        color: forgotStep === 1 ? config.accentColor : undefined 
                      }}
                    >
                      1. Doğrulama
                    </span>
                    <span>•</span>
                    <span 
                      className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={{ 
                        backgroundColor: forgotStep === 2 ? config.accentColor + '15' : 'transparent',
                        color: forgotStep === 2 ? config.accentColor : undefined 
                      }}
                    >
                      2. Kod
                    </span>
                    <span>•</span>
                    <span 
                      className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                      style={{ 
                        backgroundColor: forgotStep >= 3 ? config.accentColor + '15' : 'transparent',
                        color: forgotStep >= 3 ? config.accentColor : undefined 
                      }}
                    >
                      3. Yeni Şifre
                    </span>
                  </div>
                </div>

                {/* STEP 1: METHOD SELECTION & CONTACT INPUT */}
                {forgotStep === 1 && (
                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                        Şifrenizi mi Unuttunuz?
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
                        Hesabınızı doğrulamak ve şifrenizi sıfırlamak için tercih ettiğiniz yöntemi seçin.
                      </p>
                    </div>

                    {/* Method Switcher: E-Posta vs Telefon */}
                    <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100 rounded-2xl">
                      <button
                        type="button"
                        onClick={() => {
                          setResetMethod('email');
                          setResetContact('');
                          setErrorMsg(null);
                        }}
                        className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                          resetMethod === 'email'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        <Mail size={16} style={{ color: resetMethod === 'email' ? config.accentColor : undefined }} />
                        <span>E-Posta ile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setResetMethod('phone');
                          setResetContact('');
                          setErrorMsg(null);
                        }}
                        className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                          resetMethod === 'phone'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        <Smartphone size={16} style={{ color: resetMethod === 'phone' ? config.accentColor : undefined }} />
                        <span>Telefon ile</span>
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {/* School Code if applicable */}
                      {config.hasSchoolCode && (
                        <div>
                          <input
                            type="text"
                            required
                            value={resetSchoolCode}
                            onChange={(e) => setResetSchoolCode(e.target.value.toUpperCase())}
                            placeholder="Okul / Kurum Kodu (Örn: IST-1094)"
                            className="w-full px-6 py-4 rounded-full border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all font-mono"
                          />
                        </div>
                      )}

                      {/* Contact Input (Email or Phone) */}
                      <div>
                        <input
                          type={resetMethod === 'email' ? 'email' : 'tel'}
                          required
                          value={resetContact}
                          onChange={(e) => setResetContact(e.target.value)}
                          placeholder={
                            resetMethod === 'email' 
                              ? 'Kayıtlı Kurumsal / Şahsi E-Postanız' 
                              : 'Kayıtlı Cep Telefonu (05XX XXX XX XX)'
                          }
                          className="w-full px-6 py-4 rounded-full border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 bg-gradient-to-r ${config.gradient}`}
                      style={{
                        boxShadow: `0 12px 25px -5px ${config.accentColor}50`,
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Kod Gönderiliyor...</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight size={18} />
                          <span>Doğrulama Kodu Gönder</span>
                        </>
                      )}
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleFillDemoForgot}
                        className="text-xs text-gray-400 hover:text-gray-700 transition-colors inline-flex items-center gap-1.5 font-medium"
                      >
                        <Sparkles size={13} style={{ color: config.accentColor }} />
                        <span>Örnek {resetMethod === 'email' ? 'e-posta' : 'telefon'} ile otomatik doldur</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
                {forgotStep === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                        Doğrulama Kodu
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
                        <span className="font-semibold text-gray-800">{resetContact}</span> {resetMethod === 'email' ? 'e-posta adresinize' : 'telefonunuza'} gönderilen 6 haneli güvenlik kodunu girin.
                      </p>
                    </div>

                    {/* 6 OTP Boxes */}
                    <div className="flex items-center justify-between gap-2 sm:gap-2.5">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { otpRefs.current[idx] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={handleOtpPaste}
                          className="w-12 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-bold text-gray-900 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none transition-all duration-200"
                          style={{
                            borderColor: digit ? config.accentColor : undefined,
                            boxShadow: digit ? `0 0 0 2px ${config.accentColor}25` : undefined,
                          }}
                        />
                      ))}
                    </div>

                    {/* Countdown and Resend */}
                    <div className="flex items-center justify-between text-xs px-1 text-gray-500">
                      <span>
                        Kalan Süre:{' '}
                        <span className="font-mono font-bold text-gray-800">
                          {formatTimer(timer)}
                        </span>
                      </span>

                      <button
                        type="button"
                        disabled={timer > 0}
                        onClick={handleResendOtp}
                        className="font-medium text-[#FF5A4D] hover:underline disabled:opacity-40 disabled:hover:no-underline"
                      >
                        Kodu Tekrar Gönder
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 bg-gradient-to-r ${config.gradient}`}
                      style={{
                        boxShadow: `0 12px 25px -5px ${config.accentColor}50`,
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Doğrulanıyor...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          <span>Kodu Doğrula ve Devam Et</span>
                        </>
                      )}
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleFillDemoForgot}
                        className="text-xs text-gray-400 hover:text-gray-700 transition-colors inline-flex items-center gap-1.5 font-medium"
                      >
                        <Sparkles size={13} style={{ color: config.accentColor }} />
                        <span>Test kodunu doldur ({demoOtpCode || '482916'})</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: NEW PASSWORD */}
                {forgotStep === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                        Yeni Şifre Belirleyin
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
                        Hesabınız için güçlü ve yeni bir şifre tanımlayın.
                      </p>
                    </div>

                    {/* New Password Input */}
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Yeni Şifre (En az 8 karakter)"
                        className="w-full px-6 py-4 pr-12 rounded-full border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-5 top-4 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Yeni Şifreyi Tekrar Girin"
                        className="w-full px-6 py-4 pr-12 rounded-full border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:bg-white focus:border-gray-400 focus:ring-4 focus:ring-gray-100 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-5 top-4 text-gray-400 hover:text-gray-700 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-gray-600 font-medium">
                        <span>Şifre Güvenliği:</span>
                        <span className={newPassword.length >= 8 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                          {newPassword.length >= 8 ? 'Güçlü' : newPassword.length > 0 ? 'Orta' : 'Belirtilmedi'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: newPassword.length >= 8 ? '100%' : newPassword.length > 3 ? '50%' : '0%',
                            backgroundColor: newPassword.length >= 8 ? '#10B981' : '#F59E0B',
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 mt-2 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 bg-gradient-to-r ${config.gradient}`}
                      style={{
                        boxShadow: `0 12px 25px -5px ${config.accentColor}50`,
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Güncelleniyor...</span>
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          <span>Şifreyi Güncelle</span>
                        </>
                      )}
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={handleFillDemoForgot}
                        className="text-xs text-gray-400 hover:text-gray-700 transition-colors inline-flex items-center gap-1.5 font-medium"
                      >
                        <Sparkles size={13} style={{ color: config.accentColor }} />
                        <span>Örnek güçlü şifre doldur (Oltvia2026!)</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 4: SUCCESS CONFIRMATION */}
                {forgotStep === 4 && (
                  <div className="text-center py-6 space-y-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg">
                      <CheckCircle2 size={36} />
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                        Şifreniz Değiştirildi!
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                        Yeni şifreniz başarıyla kaydedildi. Artık güncel şifrenizle sisteminize giriş yapabilirsiniz.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleFinishReset}
                      className={`w-full py-4 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:opacity-95 active:scale-[0.99] bg-gradient-to-r ${config.gradient}`}
                      style={{
                        boxShadow: `0 12px 25px -5px ${config.accentColor}50`,
                      }}
                    >
                      <span>Giriş Ekranına Dön</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
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
