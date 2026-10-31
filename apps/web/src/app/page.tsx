"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Rocket, Network, Shield, Building2, Sparkles, Brain, Cpu, 
  ChevronRight, Target, Flame, Trophy, Gamepad2,
  Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, 
  FileText, Lock, X, Check, ArrowRight,
  Activity, BarChart3, Compass, RotateCcw, CheckCircle2
} from 'lucide-react';

export default function OltivaLandingPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ 
    institution: '', 
    name: '', 
    email: '', 
    phone: '', 
    institutionType: 'K-12 Özel Okul', 
    capacity: '500 - 1500 Öğrenci', 
    message: '' 
  });
  const [legalTab, setLegalTab] = useState<'terms' | 'conditions' | 'privacy'>('terms');
  const [activeFlywheelModule, setActiveFlywheelModule] = useState<number | null>(null);

  // Floating capsule navbar sliding indicator state & items (Portallar before Özellikler)
  const [activeNav, setActiveNav] = useState('home');
  const [navIndicator, setNavIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const navTabRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navItems = [
    { id: 'home', label: 'Ana Sayfa', href: '#' },
    { id: 'girisler', label: 'Portallar', href: '#girisler' },
    { id: 'ozellikler', label: 'Özellikler', href: '#ozellikler' },
    { id: 'misyonumuz', label: 'Misyonumuz', href: '#misyonumuz' },
    { id: 'sss', label: 'S.S.S', href: '#sss' },
    { id: 'iletisim', label: 'İletişim', href: '#iletisim' },
  ];

  const updateNavIndicator = (id: string) => {
    const el = navTabRefs.current[id];
    if (el) {
      setNavIndicator({
        left: el.offsetLeft,
        width: el.offsetWidth,
        opacity: 1,
      });
    }
  };

  const handleNavClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    e.preventDefault();
    isClickScrollingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    
    setActiveNav(item.id);
    
    if (item.href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const targetEl = document.querySelector(item.href);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }

    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 1000);
  };

  useEffect(() => {
    updateNavIndicator(activeNav);
    const handleResize = () => updateNavIndicator(activeNav);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeNav]);

  useEffect(() => {
    const timer = setTimeout(() => updateNavIndicator('home'), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isClickScrollingRef.current) return;

      const scrollPos = window.scrollY + 250;
      const sections = [
        { id: 'iletisim', el: document.getElementById('iletisim') },
        { id: 'sss', el: document.getElementById('sss') },
        { id: 'misyonumuz', el: document.getElementById('misyonumuz') },
        { id: 'ozellikler', el: document.getElementById('ozellikler') },
        { id: 'girisler', el: document.getElementById('girisler') },
      ];

      for (const sec of sections) {
        if (sec.el && sec.el.offsetTop <= scrollPos) {
          setActiveNav(sec.id);
          return;
        }
      }
      setActiveNav('home');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('oltvia-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('oltvia-theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.classList.toggle('light', nextTheme === 'light');
  };

  const flywheelModules = [
    {
      id: 0,
      step: '01',
      title: 'Bireysel Veri Analizi',
      badge: 'Bilişsel Telemetri',
      color: '#8B6CFF',
      borderGlow: 'rgba(139, 108, 255, 0.4)',
      bgGlow: 'rgba(139, 108, 255, 0.12)',
      shadowGlow: 'rgba(139, 108, 255, 0.5)',
      icon: Activity,
      summary: 'Öğrencinin anlık anlama hızı, soru çözme süresi ve kavram yanılgılarını gerçek zamanlı modeller.',
      detail: 'Öğrencinin anlık anlama hızı, bilişsel eğrisi ve soru çözme paternlerini mikro düzeyde analiz ederek benzersiz bir zihinsel profil oluşturur.',
      metric: '50+ Bilişsel Parametre'
    },
    {
      id: 1,
      step: '02',
      title: 'Akıllı Müfredat',
      badge: 'Dinamik Sokratik AI',
      color: '#FF5A4D',
      borderGlow: 'rgba(255, 90, 77, 0.4)',
      bgGlow: 'rgba(255, 90, 77, 0.12)',
      shadowGlow: 'rgba(255, 90, 77, 0.5)',
      icon: Brain,
      summary: 'Eksik kazanımlara göre dinamik zorluk seviyesi ve kişiselleştirilmiş Sokratik öğrenme rotası kurgular.',
      detail: 'Ezberci kalıpları yıkar; eksik kazanımlara göre adapte olan, doğrudan cevap yerine doğru sorularla kavratan Sokratik bir içerik hattı sunar.',
      metric: 'Kişiye Özel Rota'
    },
    {
      id: 2,
      step: '03',
      title: 'Disiplin & Alışkanlık Takibi',
      badge: 'Oyunlaştırılmış Rutin',
      color: '#F59E0B',
      borderGlow: 'rgba(245, 158, 11, 0.4)',
      bgGlow: 'rgba(245, 158, 11, 0.12)',
      shadowGlow: 'rgba(245, 158, 11, 0.5)',
      icon: Flame,
      summary: 'Günlük streak, odak blokları ve çalışma ritmini süreklilik kazandıran ritüellere dönüştürür.',
      detail: 'Öğrenme motivasyonunu anlık heveslere bırakmaz; streak sayaçları, odak kilitleri ve ritim analizleriyle kırılmaz bir çalışma disiplini inşa eder.',
      metric: '%100 Odak ve Süreklilik'
    },
    {
      id: 3,
      step: '04',
      title: 'Hedef Odaklı Çıktı',
      badge: 'Sıfır Sapma ile Sonuç',
      color: '#10B981',
      borderGlow: 'rgba(16, 185, 129, 0.4)',
      bgGlow: 'rgba(16, 185, 129, 0.12)',
      shadowGlow: 'rgba(16, 185, 129, 0.5)',
      icon: Target,
      summary: 'Sınav dereceleri ve hedeflenen netlere veriye dayalı stratejiyle kesin ulaştırır.',
      detail: 'Bireysel hedefleri ve sınav netlerini tesadüflere değil; baştan sona veriyle beslenen 360° ekosistemin kaçınılmaz ve ölçülebilir zaferine dönüştürür.',
      metric: 'Maksimum Net & Derece'
    }
  ];
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-20');
          entry.target.classList.add('opacity-100', 'translate-y-0');
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1, 
      rootMargin: '0px 0px -50px 0px' 
    });

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={"min-h-screen font-serif selection:bg-[#FF5A4D]/30 overflow-x-hidden transition-colors duration-300 " + (theme === 'dark' ? "bg-[#080411] text-[#E2E8F0]" : "bg-[#E9E3DE] text-[#1A1D24]")}>

      {/* Animated Mesh / Glowing Orbs & Cyber Geometric Line Grid (Matching Reference Screenshot) */}
      {theme === 'dark' ? (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* 1. Deep Ambient Lighting Orbs */}
          {/* Top-Left Deep Plum / Violet Spotlight */}
          <div className="absolute top-[-5%] left-[-5%] w-[55vw] h-[55vw] max-w-[850px] max-h-[850px] rounded-full bg-gradient-to-br from-[#7C3AED]/24 via-[#581C87]/16 to-transparent blur-[140px] pointer-events-none" />
          
          {/* Top-Right Warm Coral Flare behind CTA */}
          <div className="absolute top-[6%] right-[-5%] w-[40vw] h-[40vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-bl from-[#FF5A4D]/18 via-[#FF7A50]/10 to-transparent blur-[130px] pointer-events-none" />

          {/* Center-Hero Indigo Nebula Ambiance */}
          <div className="absolute top-[30%] left-[12%] w-[55vw] h-[42vw] max-w-[800px] rounded-full bg-[#6366F1]/12 blur-[160px] pointer-events-none" />

          {/* Bottom Ambient Glow */}
          <div className="absolute bottom-[-10%] right-[12%] w-[48vw] h-[48vw] max-w-[720px] rounded-full bg-[#8B5CF6]/15 blur-[160px] pointer-events-none" />

          {/* 2. Geometric Tech Lines Matching the Reference Screenshot */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 900">
            <defs>
              {/* Violet to Coral Line Gradient */}
              <linearGradient id="refCyberGrad" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
                <stop offset="20%" stopColor="rgba(192,132,252,0.25)" />
                <stop offset="50%" stopColor="rgba(139,108,255,0.2)" />
                <stop offset="80%" stopColor="rgba(255,90,77,0.2)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
              </linearGradient>

              {/* Faint Horizontal Guide Gradient */}
              <linearGradient id="horizonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="30%" stopColor="rgba(168,85,247,0.18)" />
                <stop offset="70%" stopColor="rgba(255,90,77,0.14)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>

              {/* Filter for glowing nodes */}
              <filter id="glowPurple" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Left Side Architectural Facet Paths (Exact to screenshot) */}
            <path d="M -30 360 L 120 360 L 240 210 L 420 210 L 490 110" fill="none" stroke="url(#refCyberGrad)" strokeWidth="1.2" />
            <path d="M 120 360 L 190 530 L 320 600" fill="none" stroke="url(#refCyberGrad)" strokeWidth="1" />
            <path d="M 240 210 L 290 80 L 180 10" fill="none" stroke="url(#refCyberGrad)" strokeWidth="0.9" opacity="0.7" />

            {/* Right Side Horizon & Sweeping Tangent Curve (Exact to screenshot) */}
            <path d="M 1470 310 L 1220 310 L 1080 190 L 960 190" fill="none" stroke="url(#refCyberGrad)" strokeWidth="1.2" />
            <path d="M 1220 310 L 1140 480 L 1050 550" fill="none" stroke="url(#refCyberGrad)" strokeWidth="1" />
            
            {/* Center Faint Horizon Line behind Hero */}
            <line x1="0" y1="310" x2="1440" y2="310" stroke="url(#horizonGrad)" strokeWidth="0.8" />

            {/* Sweeping Elliptical Arc behind Title (From right-hand curve in screenshot) */}
            <path d="M 320 460 Q 720 180 1280 440" fill="none" stroke="url(#refCyberGrad)" strokeWidth="0.8" opacity="0.6" />

            {/* Glowing Accent Intersection Nodes */}
            <circle cx="240" cy="210" r="2.5" fill="#C084FC" filter="url(#glowPurple)" />
            <circle cx="420" cy="210" r="2" fill="#FF7A50" opacity="0.85" />
            <circle cx="120" cy="360" r="2" fill="#818CF8" opacity="0.85" />
            <circle cx="1080" cy="190" r="2.5" fill="#C084FC" filter="url(#glowPurple)" />
            <circle cx="1220" cy="310" r="2" fill="#FF7A50" opacity="0.85" />
          </svg>

          {/* 3. Deep Cinematic Vignette (Softening Canvas Edges) */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 35%, rgba(8, 4, 17, 0.75) 85%, #080411 100%)'
            }}
          />
        </div>
      ) : (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full blur-[140px] bg-[#5B3FD9]/8 opacity-80" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] max-w-[650px] max-h-[650px] rounded-full blur-[140px] bg-[#FF5A4D]/8 opacity-80" />
          <div className="absolute top-[35%] right-[15%] w-[35vw] h-[35vw] max-w-[500px] rounded-full blur-[130px] bg-[#5B3FD9]/5 opacity-60" />
        </div>
      )}

      {/* FLOATING CAPSULE NAVBAR (Adapted from Reference Screenshot) */}
      <header className="fixed top-5 inset-x-0 z-50 px-4 sm:px-6 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
        
        {/* Left: Brand Logo Capsule */}
        <Link 
          href="/"
          className={"pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-2xl border transition-all duration-300 hover:scale-[1.02] " + (
            theme === 'dark' 
              ? "bg-[#140B25]/85 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.45)] text-[#E2E8F0]" 
              : "bg-white/95 border-[#E3E6EB] shadow-md text-[#1A1D24]"
          )}
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 78 28 A 36 36 0 1 0 78 72" stroke={theme === 'dark' ? "#E2E8F0" : "#1A1D24"} strokeWidth="16" />
              <circle cx="78" cy="28" r="8" fill="#5B3FD9" />
              <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
              <circle cx="45" cy="40" r="10" fill={theme === 'dark' ? "#E2E8F0" : "#1A1D24"} />
              <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill={theme === 'dark' ? "#E2E8F0" : "#1A1D24"} />
            </svg>
          </div>
          <span className="text-xl font-black tracking-widest font-sans">
            OLTVIΛ
          </span>
        </Link>
        
        {/* Center: Floating Capsule Pill Nav with Sliding Active Indicator */}
        <nav className={"hidden md:inline-flex items-center p-1.5 rounded-full backdrop-blur-2xl border pointer-events-auto relative transition-colors duration-300 " + (
          theme === 'dark'
            ? "bg-[#140B25]/85 border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.5)]"
            : "bg-white/95 border-[#E3E6EB] shadow-md"
        )}>
          {/* Smooth Sliding Pill Indicator (Light mode uses 10% opacity accent background) */}
          <div 
            className={"absolute top-1.5 bottom-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none " + (
              theme === 'dark'
                ? "bg-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] border border-white/15 backdrop-blur-sm"
                : "bg-[#5B3FD9]/10 border border-[#5B3FD9]/20"
            )}
            style={{
              left: `${navIndicator.left}px`,
              width: `${navIndicator.width}px`,
              opacity: navIndicator.opacity,
            }}
          />

          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <a 
                key={item.id}
                ref={(el) => { navTabRefs.current[item.id] = el; }}
                href={item.href}
                onClick={(e) => handleNavClick(item, e)}
                className={"relative z-10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 text-center " + (
                  isActive
                    ? (theme === 'dark' ? "text-white" : "text-[#5B3FD9] font-bold")
                    : (theme === 'dark' ? "text-[#9D93B3] hover:text-white" : "text-[#68707D] hover:text-[#1A1D24]")
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        
        {/* Right: Glowing Pill CTA Button & Eclipse Switcher */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Glowing Pill Action Button ("Get Started" in Reference) */}
          <Link 
            href="/giris?rol=ogrenci"
            className={"relative group px-5 sm:px-6 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-2 " + (
              theme === 'dark' 
                ? "bg-[#FF5A4D]/10 hover:bg-[#FF5A4D] border-[#FF5A4D]/70 text-white shadow-[0_0_22px_rgba(255,90,77,0.45)] hover:shadow-[0_0_35px_rgba(255,90,77,0.8)]" 
                : "bg-[#FF5A4D] hover:bg-[#ff4536] border-[#FF5A4D] text-white shadow-[0_4px_14px_rgba(255,90,77,0.35)]"
            )}
          >
            <span>Giriş Yap</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Yaratıcı "Tutulma (Eclipse)" Butonu: Güneş ve Ay Geçişi */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? "Aydınlık Moda Geç (Güneş)" : "Karanlık Moda Geç (Güneş Tutulması)"}
            title={theme === 'dark' ? "Aydınlık Moda Geç" : "Karanlık Moda Geç (Tutulma)"}
            className={"relative w-10 h-10 rounded-full border transition-all duration-300 hover:scale-105 flex items-center justify-center overflow-hidden " + (
              theme === 'dark' 
                ? "bg-[#140B25]/85 border-white/10 hover:border-[#FF5A4D]/50 text-[#E2E8F0] shadow-[0_0_15px_rgba(255,90,77,0.15)]" 
                : "bg-white border-[#E3E6EB] hover:border-[#F59E0B]/60 text-[#1A1D24] shadow-sm hover:shadow-md"
            )}
          >
            <div className="relative w-6 h-6 flex items-center justify-center pointer-events-none">
              {/* Güneş Işınları */}
              <div className={"absolute inset-0 transition-all duration-500 " + (theme === 'light' ? "opacity-100 scale-100 rotate-45" : "opacity-0 scale-50 rotate-0")}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <span 
                    key={deg} 
                    style={{ transform: ('rotate(' + deg + 'deg) translateY(-9px)') }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-1.5 rounded-full bg-amber-500"
                  />
                ))}
              </div>

              {/* Güneş Çemberi */}
              <div 
                className={"w-4 h-4 rounded-full transition-all duration-500 relative z-10 " + (
                  theme === 'dark'
                    ? "bg-gradient-to-tr from-[#FF5A4D] to-[#8B6CFF] shadow-[0_0_12px_rgba(255,90,77,0.8)]"
                    : "bg-gradient-to-tr from-amber-400 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.9)]"
                )}
              >
                {theme === 'dark' && (
                  <span className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#fff]" />
                )}
              </div>

              {/* Siyah Ay Diski */}
              <div 
                className={"absolute w-4 h-4 rounded-full z-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] " + (
                  theme === 'dark'
                    ? "translate-x-0 bg-[#080411] border border-[#FF5A4D]/50 shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.2)]"
                    : "translate-x-6 opacity-0 bg-[#1A1D24]"
                )}
              />
            </div>
          </button>
        </div>
      </header>

      <main className="relative z-10">
        
        {/* HERO SECTION - Only Beyond Learning Title shown on initial screen */}
        <section className="min-h-screen max-w-7xl mx-auto px-6 pt-20 pb-12 text-center flex flex-col items-center justify-center relative reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          
          {/* Brand Beyond Learning Title & Hover Reveal */}
          <div className="grid w-full max-w-5xl place-items-center group cursor-default">
            <h1 className="col-start-1 row-start-1 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:blur-[24px] group-hover:opacity-0 group-hover:scale-90 text-center z-10 select-none flex flex-col items-center justify-center w-full">
              <div className="w-full max-w-4xl px-2 py-2 flex items-center justify-center drop-shadow-[0_0_50px_rgba(255,90,95,0.35)]">
                <img 
                  src="/beyond-learning.svg" 
                  alt="Beyond Learning" 
                  className="w-full h-auto max-h-[140px] sm:max-h-[160px] object-contain select-none pointer-events-none drop-shadow-[0_0_35px_rgba(139,108,255,0.3)]" 
                />
              </div>
              <span className="block font-serif text-xs md:text-sm font-semibold uppercase tracking-[0.35em] text-[#A59BB8] mt-3 opacity-90">
                BEYOND WHAT YOU KNOW
              </span>
            </h1>
            
            <p className={"col-start-1 row-start-1 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 blur-[20px] scale-110 group-hover:opacity-100 group-hover:blur-0 group-hover:scale-100 text-2xl md:text-3xl lg:text-4xl leading-relaxed font-normal z-20 text-center max-w-5xl px-4 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] font-serif tracking-wide " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>
              OLTVIA, yapay zeka gücüyle öğrencinin hızına, hislerine ve hedeflerine anında adapte olan yenilikçi bir ekosistemdir.
            </p>
          </div>

        </section>

        {/* 4 ENTRY PORTALS & CTA ACTION BUTTONS (Revealed upon scroll) */}
        <section id="girisler" className="scroll-mt-24 max-w-7xl mx-auto px-6 mb-40 relative reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          
          {/* Dual Pill CTA Buttons (Vibrant Neon Glow as in Reference Screenshot) */}
          <div className="flex flex-wrap items-center justify-center gap-5 z-20 mb-16 pt-6">
            {/* Primary Coral Aura Button */}
            <Link 
              href="/giris?rol=ogrenci"
              className="relative rounded-full px-8 sm:px-9 py-3.5 bg-gradient-to-r from-[#FF5A43] to-[#FF7A50] text-white font-bold text-sm tracking-wide shadow-[0_0_35px_rgba(255,90,67,0.6)] hover:shadow-[0_0_55px_rgba(255,90,67,0.9)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
            >
              <span>Hemen Başla</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary Violet Aura Button */}
            <a 
              href="#portal-cards"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('portal-cards')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative rounded-full px-8 sm:px-9 py-3.5 bg-gradient-to-r from-[#5136CA] to-[#6E4CF2] text-white font-bold text-sm tracking-wide shadow-[0_0_35px_rgba(110,76,242,0.55)] hover:shadow-[0_0_55px_rgba(110,76,242,0.85)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
            >
              <span>Portalları Keşfet</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>
          </div>

          <div id="portal-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Öğrenci", role: "ogrenci", icon: Rocket, desc: "Sokratik Mentör & Hedef Rotası" },
              { title: "Öğretmen", role: "ogretmen", icon: Network, desc: "Sınıf Analitiği & Ödev Yönetimi" },
              { title: "Veli", role: "veli", icon: Shield, desc: "Gelişim Raporları & Odaklanma" },
              { title: "Okul İdaresi", role: "kurumsal", icon: Building2, desc: "Okul Lisansları & Kota Takibi" }
            ].map((portal, idx) => (
              <div key={idx} className={"group relative rounded-[2rem] p-[1px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(139,92,246,0.2)] " + (theme === 'dark' ? "bg-white/[0.05] hover:bg-gradient-to-br hover:from-[#FF5A4D] hover:to-[#8B6CFF]" : "bg-[#E3E6EB] hover:bg-gradient-to-br hover:from-[#FF5A4D] hover:to-[#5B3FD9] shadow-sm")} style={{ transitionDelay: (idx * 100) + 'ms' }}>
                <Link 
                  href={'/giris?rol=' + portal.role} 
                  className={"relative w-full h-full flex flex-col items-center justify-center p-10 backdrop-blur-2xl rounded-[31px] text-center specular-top " + (theme === 'dark' ? "bg-[#130B24]/85 border border-white/[0.08]" : "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#E3E6EB]")}
                >
                  <div className={"w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-inner " + (theme === 'dark' ? "bg-white/[0.04] border border-white/[0.08]" : "bg-[#E9E3DE]/40 border border-[#E3E6EB]")}>
                    <portal.icon size={36} className={(theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]") + " group-hover:text-[#FF5A4D] transition-colors duration-300"} strokeWidth={1.5} />
                  </div>
                  <h3 className={"text-xl font-bold mb-2 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>{portal.title}</h3>
                  <p className={"text-xs max-w-[200px] leading-relaxed mb-6 opacity-75 group-hover:opacity-100 transition-opacity " + (theme === 'dark' ? "text-[#A59BB8]" : "text-[#68707D]")}>
                    {portal.desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B6CFF] group-hover:text-[#FF5A4D] transition-colors">
                    <span>Portala Gir</span>
                    <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURE SHOWCASE */}
        <section id="ozellikler" className="scroll-mt-28 max-w-7xl mx-auto px-6 space-y-40 mb-40">
          
          {/* Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-20 reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex-1 space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-[#8B6CFF]/10 border border-[#8B6CFF]/20 flex items-center justify-center text-[#8B6CFF] mb-6 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                <Brain size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight flex items-center flex-wrap gap-2">
                <span className={theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]"}>Sokratik</span>
                <span className={(theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]") + " flex items-center relative font-sans font-black tracking-wide"}>
                  OLTV
                  <span className="inline-flex items-center relative ml-[1px]">
                    <span className={(theme === 'dark' ? "animate-[swap-i-dark_8s_infinite]" : "animate-[swap-i-light_8s_infinite]") + " inline-block relative z-10"}>I</span>
                    <span className={(theme === 'dark' ? "animate-[swap-a-dark_8s_infinite]" : "animate-[swap-a-light_8s_infinite]") + " inline-block relative"}>Λ</span>
                  </span>
                </span>
              </h2>
              <p className={(theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]") + " text-lg leading-relaxed font-medium"}>
                Öğrenciye doğrudan cevabı vermek yerine, onu düşünmeye iten sorular sorar. Yüksek yapay zeka zekasıyla anlama hızına göre benzersiz diyaloglar kurar.
              </p>
            </div>
            
            <div className="flex-1 w-full">
              <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.08] to-transparent p-[1px]">
                <div className="absolute inset-0 bg-[#8B6CFF]/20 blur-[80px] -z-10 rounded-full" />
                <div className={"rounded-[23px] backdrop-blur-2xl p-8 h-96 flex flex-col justify-end relative overflow-hidden border shadow-2xl specular-top " + (theme === 'dark' ? "bg-[#130B24]/85 border-white/[0.08]" : "bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-[#E3E6EB]")}>
                  
                  <div className={"absolute top-4 left-4 right-4 flex items-center gap-4 border-b pb-6 backdrop-blur-md z-20 " + (theme === 'dark' ? "border-white/[0.08] bg-[#140B25]/60" : "border-[#E3E6EB] bg-white/80")}>
                    <div className={"w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(139,108,255,0.4)] border " + (theme === 'dark' ? "bg-[#130B24] border-white/10" : "bg-white border-[#E3E6EB]")}>
                      <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 78 28 A 36 36 0 1 0 78 72" stroke={theme === 'dark' ? "#E2E8F0" : "#1A1D24"} strokeWidth="16" />
                        <circle cx="78" cy="28" r="8" fill="#5B3FD9" />
                        <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
                        <circle cx="45" cy="40" r="10" fill={theme === 'dark' ? "#E2E8F0" : "#1A1D24"} />
                        <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill={theme === 'dark' ? "#E2E8F0" : "#1A1D24"} />
                      </svg>
                    </div>
                    <div>
                      <span className={"block text-base font-bold tracking-wide " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>Oltvia Zeka</span>
                      <span className="block text-xs text-[#5B3FD9] font-medium mt-1">12. Sınıf İleri Matematik - Limit</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 z-10 pt-20">
                    {/* User Message */}
                    <div className={"opacity-0 animate-[chat-loop-1_12s_infinite] border rounded-3xl rounded-tr-sm p-4 w-[90%] ml-auto backdrop-blur-sm " + (theme === 'dark' ? "bg-white/[0.03] border-white/[0.05]" : "bg-[#E9E3DE]/30 border-[#E3E6EB] shadow-xs")}>
                      <p className={"text-sm font-medium leading-relaxed " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>
                        Hocam, L'Hopital kuralını kullanmadan sin(x)/x'in 0'daki limitinin 1 olduğunu geometrik olarak nasıl ispatlarız?
                      </p>
                    </div>
                    
                    <div className="relative">
                      {/* Typing Indicator */}
                      <div className="opacity-0 animate-[chat-loop-typing_12s_infinite] absolute top-0 left-0 bg-[#8B6CFF]/5 border border-[#8B6CFF]/10 rounded-full p-4 w-20 flex justify-center gap-1.5 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 bg-[#8B6CFF] rounded-full animate-[typing-dot_1s_infinite_0s]"></div>
                        <div className="w-1.5 h-1.5 bg-[#8B6CFF] rounded-full animate-[typing-dot_1s_infinite_0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-[#8B6CFF] rounded-full animate-[typing-dot_1s_infinite_0.4s]"></div>
                      </div>

                      {/* AI Response */}
                      <div className={"opacity-0 animate-[chat-loop-2_12s_infinite] rounded-3xl rounded-tl-sm p-4 w-[95%] backdrop-blur-sm shadow-sm border " + (
                        theme === 'dark' 
                          ? "bg-[#8B6CFF]/10 border-[#8B6CFF]/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]" 
                          : "bg-[#5B3FD9]/10 border-[#5B3FD9]/20 shadow-[0_4px_16px_rgba(91,63,217,0.08)]"
                      )}>
                        <p className={"text-sm font-medium leading-relaxed " + (theme === 'dark' ? "text-[#E9D5FF]" : "text-[#1A1D24]")}>
                          Harika bir soru! L'Hopital bazen ezbere kaçabilir. Birim çember üzerinde çok küçük bir <span className={"font-bold " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#5B3FD9]")}>x açısı</span> çizdiğini hayal et. Sence bu açının gördüğü <span className={"italic font-semibold " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#5B3FD9]")}>yay uzunluğu (x)</span> ile üçgenin yüksekliği <span className={"italic font-semibold " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#5B3FD9]")}>(sin x)</span> birbirine nasıl yaklaşır?
                        </p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Başarı Eğrisi */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-20 reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex-1 space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-[#FF5A4D]/10 border border-[#FF5A4D]/20 flex items-center justify-center text-[#FF5A4D] mb-6 shadow-[0_0_20px_rgba(255,90,95,0.2)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              </div>
              <h2 className={"text-4xl md:text-5xl font-black tracking-tight " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>
                Sıfır Sapma ile <span className="text-[#FF5A4D]">Hedef Rotası</span>
              </h2>
              <p className={(theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]") + " text-lg leading-relaxed font-medium"}>
                Öğrencinin mevcut TYT-AYT netleri ile hayalindeki üniversitenin gerektirdiği net eğrisi arasındaki farkı milimetrik olarak analiz eder. Sistemin tek bir amacı vardır: Eksikleri anında tespit ederek bu iki eğriyi kusursuzca birleştirmek.
              </p>
            </div>
            
            <div className="flex-1 w-full">
              <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.08] to-transparent p-[1px]">
                <div className="absolute inset-0 bg-[#8B6CFF]/20 blur-[80px] -z-10 rounded-full" />
                <div className={"rounded-[23px] backdrop-blur-2xl h-[420px] flex flex-col relative overflow-hidden border shadow-2xl group cursor-crosshair specular-top " + (theme === 'dark' ? "bg-[#130B24]/85 border-white/[0.08]" : "bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-[#E3E6EB]")}>
                  
                  {/* Header */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20 transition-opacity duration-500 group-hover:opacity-0">
                     <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-[#FF5A4D] animate-pulse shadow-[0_0_10px_#FF5A4D]"></div>
                       <span className={"text-sm font-bold tracking-wide " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>TYT/AYT Gelişim Grafiği</span>
                     </div>
                     <span className={"text-xs font-bold border px-3 py-1.5 rounded-full " + (theme === 'dark' ? "bg-white/5 border-white/10 text-[#9CA3AF]" : "bg-white border-[#E3E6EB] text-[#68707D] shadow-xs")}>
                       Detay için üzerine gel
                     </span>
                  </div>

                  {/* Graph Container (Zooms in on hover) */}
                  <div className="absolute inset-0 pt-20 pb-10 px-8 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.3] group-hover:-translate-y-4 group-hover:-translate-x-8">
                    
                    {/* Y-Axis Labels */}
                    <div className={"absolute left-4 top-16 bottom-12 flex flex-col justify-between text-[10px] font-bold transition-opacity duration-500 group-hover:opacity-0 " + (theme === 'dark' ? "text-white/30" : "text-[#68707D]")}>
                      <span>120</span>
                      <span>90</span>
                      <span>60</span>
                      <span>30</span>
                    </div>

                    <div className="relative w-full h-full mt-4">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
                        {/* Grid Lines */}
                        <line x1="0" y1="0" x2="400" y2="0" stroke={theme === 'dark' ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.07)"} strokeWidth="1" />
                        <line x1="0" y1="66" x2="400" y2="66" stroke={theme === 'dark' ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.07)"} strokeWidth="1" />
                        <line x1="0" y1="133" x2="400" y2="133" stroke={theme === 'dark' ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.07)"} strokeWidth="1" />
                        <line x1="0" y1="200" x2="400" y2="200" stroke={theme === 'dark' ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.07)"} strokeWidth="1" />
                        
                        {/* Target Curve (Dashed Orange) */}
                        <path d="M 0 150 C 100 120, 200 80, 400 30" fill="none" stroke="#FF5A4D" strokeWidth="3" strokeDasharray="6 6" className="opacity-60" />
                        
                        {/* Current Curve (Solid Purple) */}
                        <path d="M 0 170 C 100 160, 200 130, 300 110" fill="none" stroke="#8B6CFF" strokeWidth="4" />
                        <path d="M 300 110 C 350 100, 380 90, 400 30" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="4" strokeDasharray="4 4" />
                        
                        {/* Glow under solid purple curve */}
                        <path d="M 0 170 C 100 160, 200 130, 300 110 L 300 200 L 0 200 Z" fill="url(#purpleGlow)" opacity="0.2" />

                        {/* Defs for gradients */}
                        <defs>
                          <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B6CFF" />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                        </defs>

                        {/* Data Point 1: Current vs Target (October) */}
                        <g className="transition-all duration-700 opacity-0 group-hover:opacity-100" style={{ transitionDelay: '300ms' }}>
                          <line x1="150" y1="100" x2="150" y2="145" stroke={theme === 'dark' ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} strokeWidth="1" strokeDasharray="3 3" />
                          {/* Target Node */}
                          <circle cx="150" cy="100" r="5" fill={theme === 'dark' ? "#130B24" : "#FFFFFF"} stroke="#FF5A4D" strokeWidth="2" />
                          <rect x="90" y="60" width="120" height="30" rx="4" fill="#FF5A4D" opacity={theme === 'dark' ? "0.15" : "0.2"} />
                          <text x="150" y="80" fill="#FF5A4D" fontSize="10" fontWeight="bold" textAnchor="middle">Hedef: 85 Net</text>
                          {/* Current Node */}
                          <circle cx="150" cy="145" r="5" fill="#8B6CFF" stroke="#fff" strokeWidth="2" filter="drop-shadow(0 0 4px #8B6CFF)" />
                          <rect x="90" y="160" width="120" height="30" rx="4" fill="#8B6CFF" opacity={theme === 'dark' ? "0.15" : "0.2"} />
                          <text x="150" y="180" fill={theme === 'dark' ? "#E9D5FF" : "#5B3FD9"} fontSize="10" fontWeight="bold" textAnchor="middle">Gerçekleşen: 65 Net</text>
                        </g>

                        {/* Data Point 2: The Future Convergence (May) */}
                        <g className="transition-all duration-700 opacity-0 group-hover:opacity-100" style={{ transitionDelay: '500ms' }}>
                          <circle cx="350" cy="55" r="5" fill={theme === 'dark' ? "#130B24" : "#FFFFFF"} stroke="#FF5A4D" strokeWidth="2" />
                          <rect x="290" y="15" width="120" height="30" rx="4" fill="#FF5A4D" opacity={theme === 'dark' ? "0.15" : "0.2"} />
                          <text x="350" y="35" fill="#FF5A4D" fontSize="10" fontWeight="bold" textAnchor="middle">YKS Hedefi: 110 Net</text>
                        </g>
                      </svg>
                    </div>

                    {/* X-Axis Labels */}
                    <div className={"absolute bottom-4 left-8 right-8 flex justify-between text-[10px] font-bold transition-opacity duration-500 group-hover:opacity-0 uppercase tracking-widest " + (theme === 'dark' ? "text-white/40" : "text-[#68707D] font-bold")}>
                      <span>Eyl</span>
                      <span>Kas</span>
                      <span>Oca</span>
                      <span>Mar</span>
                      <span>May</span>
                    </div>

                  </div>

                  {/* Vignette Overlay for cinematic lens effect */}
                  <div className="absolute inset-0 pointer-events-none rounded-[23px] shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] opacity-0 transition-opacity duration-1000 group-hover:opacity-100"></div>

                </div>
              </div>
            </div>
          </div>
        
        
          {/* Feature 3: OLTVIA 360° Performans Çarkı (System Flywheel) */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20 reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            
            {/* Sol: Açıklama ve Stratejik Vizyon Metni */}
            <div className="flex-1 space-y-8">
              <div className={"inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold text-[#5B3FD9] tracking-wider uppercase backdrop-blur-md shadow-sm transition-colors duration-300 " + (
                theme === 'dark' ? "bg-white/[0.04] border border-white/10" : "bg-white border border-[#E3E6EB] shadow-xs"
              )}>
                <RotateCcw size={14} className="text-[#FF5A4D] animate-spin" style={{ animationDuration: '10s' }} />
                <span>OLTVIA 360° Sistem Mimarisi</span>
              </div>

              <h2 className={"text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.18] transition-colors duration-300 " + (
                theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]"
              )}>
                Sınırları Aşan Öğrenciler İçin{" "}
                <span className="bg-gradient-to-r from-[#FF5A4D] via-[#FF8075] to-[#5B3FD9] bg-clip-text text-transparent">
                  Yeni Nesil Eğitim Ekosistemi
                </span>
              </h2>

              <p className={"text-base sm:text-lg leading-relaxed font-normal transition-colors duration-300 " + (
                theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]"
              )}>
                <strong className={"font-semibold " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>OLTVIA;</strong> disiplin, adanmışlık ve yapay zeka teknolojisini tek bir yapıda buluşturarak öğrenme süreçlerini veriye dayalı bir kesinliğe dönüştürür. Geleneksel müfredat sınırlarının ötesine geçerek, her öğrenciyi potansiyelini en üst düzeyde ortaya çıkaracağı stratejik hedeflere kilitler. Başarı bir tesadüf değil, doğru kurgulanmış bir sistemin kaçınılmaz sonucudur.
              </p>

              {/* 3 Stratejik Güvence Maddesi */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className={"p-3.5 rounded-2xl border backdrop-blur-sm transition-colors duration-300 " + (
                  theme === 'dark' ? "bg-white/[0.03] border-white/[0.06]" : "bg-white border-[#E3E6EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                )}>
                  <div className="text-[11px] font-bold text-[#5B3FD9] uppercase tracking-wider mb-1">Telemetri</div>
                  <div className={"text-xs font-medium " + (theme === 'dark' ? "text-[#D1D5DB]" : "text-[#68707D]")}>Anlık Bilişsel Haritalama</div>
                </div>
                <div className={"p-3.5 rounded-2xl border backdrop-blur-sm transition-colors duration-300 " + (
                  theme === 'dark' ? "bg-white/[0.03] border-white/[0.06]" : "bg-white border-[#E3E6EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                )}>
                  <div className="text-[11px] font-bold text-[#FF5A4D] uppercase tracking-wider mb-1">Adaptasyon</div>
                  <div className={"text-xs font-medium " + (theme === 'dark' ? "text-[#D1D5DB]" : "text-[#68707D]")}>Dinamik Sokratik AI</div>
                </div>
                <div className={"p-3.5 rounded-2xl border backdrop-blur-sm transition-colors duration-300 " + (
                  theme === 'dark' ? "bg-white/[0.03] border-white/[0.06]" : "bg-white border-[#E3E6EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                )}>
                  <div className="text-[11px] font-bold text-[#10B981] uppercase tracking-wider mb-1">Kesinlik</div>
                  <div className={"text-xs font-medium " + (theme === 'dark' ? "text-[#D1D5DB]" : "text-[#68707D]")}>Sıfır Sapma ile Sonuç</div>
                </div>
              </div>
            </div>
            
            {/* Sağ: OLTVIA 360° Performans Çarkı (System Flywheel) */}
            <div className="flex-1 w-full">
              <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent p-[1px]">
                {/* Glow Arka Plan */}
                <div className={"absolute inset-0 bg-gradient-to-br from-[#8B6CFF]/15 via-transparent to-[#FF5A4D]/15 blur-[80px] -z-10 rounded-3xl transition-opacity duration-500 " + (
                  theme === 'dark' ? "opacity-100" : "opacity-60"
                )} />
                
                <div className={"rounded-[23px] relative overflow-hidden border shadow-2xl group min-h-[530px] flex flex-col justify-between p-6 sm:p-7 transition-colors duration-300 specular-top " + (
                  theme === 'dark' ? "bg-[#130B24]/90 border-white/[0.08] backdrop-blur-2xl" : "bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-[#E3E6EB]"
                )}>
                  
                  {/* Üst Durum Çubuğu */}
                  <div className="flex items-center justify-between z-30 mb-2">
                    <div className={"flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors duration-300 " + (
                      theme === 'dark' ? "bg-white/[0.04] border-white/[0.08]" : "bg-[#E9E3DE]/40 border-[#E3E6EB]"
                    )}>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                      </span>
                      <span className={"text-[10px] font-black tracking-[0.2em] uppercase " + (
                        theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]"
                      )}>
                        System Flywheel
                      </span>
                    </div>

                    <div className={"text-[10px] font-semibold border px-2.5 py-1 rounded-full transition-colors " + (
                      theme === 'dark' ? "text-[#9CA3AF] bg-white/[0.03] border-white/[0.06] group-hover:text-white" : "text-[#68707D] bg-white border-[#E3E6EB] group-hover:text-[#1A1D24] shadow-xs"
                    )}>
                      {activeFlywheelModule !== null ? "Dönüş Duraklatıldı" : "Modüle gelip incele"}
                    </div>
                  </div>

                  {/* Flywheel Çark Sahnesi */}
                  <div className="relative w-full h-[320px] sm:h-[350px] flex items-center justify-center my-1 select-none">
                    
                    {/* SVG Yörünge Çizgileri & Işık Hüzmeleri */}
                    <svg className="absolute w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] pointer-events-none" viewBox="0 0 340 340">
                      <defs>
                        <linearGradient id="flywheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8B6CFF" stopOpacity="0.8" />
                          <stop offset="50%" stopColor="#FF5A4D" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#8B6CFF" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>

                      {/* Dış Statik Yörünge */}
                      <circle cx="170" cy="170" r="126" fill="none" stroke={theme === 'dark' ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="1" />
                      
                      {/* Dönen Enerji Akışı */}
                      <circle 
                        cx="170" 
                        cy="170" 
                        r="126" 
                        fill="none" 
                        stroke="url(#flywheelGradient)" 
                        strokeWidth="1.5" 
                        className="animate-particle-flow opacity-70"
                      />

                      {/* İç Destek Çemberi */}
                      <circle cx="170" cy="170" r="65" fill="none" stroke={theme === 'dark' ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} strokeDasharray="3 6" strokeWidth="1" />
                    </svg>

                    {/* MERKEZ: LIQUID GLASS LOGO (AI CORE yazısı kaldırıldı, Liquid Glass Logo yerleştirildi) */}
                    <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none select-none">
                      {/* Ambient Caustic Glow */}
                      <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#FF5A4D]/30 via-transparent to-[#8B6CFF]/40 blur-2xl opacity-75 animate-core-glow pointer-events-none" />
                      
                      {/* Liquid Glass Organik Blok / Disk */}
                      <div 
                        className={"relative w-22 h-22 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center p-3 backdrop-blur-2xl transition-transform duration-300 " + (
                          theme === 'dark' 
                            ? "shadow-[0_16px_36px_rgba(0,0,0,0.65)]" 
                            : "shadow-[0_16px_36px_rgba(0,0,0,0.15)]"
                        )}
                        style={{
                          background: theme === 'dark' 
                            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.02) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.4) 100%)',
                          border: theme === 'dark' 
                            ? '1.5px solid rgba(255, 255, 255, 0.45)' 
                            : '1.5px solid rgba(255, 255, 255, 0.8)',
                          boxShadow: theme === 'dark'
                            ? 'inset 0 2px 4px rgba(255, 255, 255, 0.7), inset 0 -2px 6px rgba(0, 0, 0, 0.4), 0 16px 36px rgba(0, 0, 0, 0.65)'
                            : 'inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(0, 0, 0, 0.1), 0 12px 30px rgba(0, 0, 0, 0.08)'
                        }}
                      >
                        {/* Diagonal Glass Sheen Glare */}
                        <div 
                          className="absolute inset-0 rounded-3xl pointer-events-none opacity-50"
                          style={{
                            background: 'linear-gradient(120deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 55%)'
                          }}
                        />

                        {/* Liquid Nebula Refraction */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#FF5A4D]/20 via-transparent to-[#8B6CFF]/25 pointer-events-none" />

                        {/* OLTVIA Liquid Glass Logo Emblem */}
                        <svg 
                          width="52" 
                          height="52" 
                          viewBox="0 0 100 100" 
                          fill="none" 
                          className="relative z-10 filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
                        >
                          <path 
                            d="M 78 28 A 36 36 0 1 0 78 72" 
                            stroke={theme === 'dark' ? "#E2E8F0" : "#0F172A"} 
                            strokeWidth="15" 
                            strokeLinecap="round" 
                          />
                          <circle 
                            cx="78" 
                            cy="28" 
                            r="8.5" 
                            fill="#8B6CFF" 
                            className="filter drop-shadow-[0_0_10px_#8B6CFF]" 
                          />
                          <circle 
                            cx="78" 
                            cy="72" 
                            r="8.5" 
                            fill="#FF5A4D" 
                            className="filter drop-shadow-[0_0_10px_#FF5A4D]" 
                          />
                          <circle cx="45" cy="40" r="10" fill={theme === 'dark' ? "#E2E8F0" : "#0F172A"} />
                          <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill={theme === 'dark' ? "#E2E8F0" : "#0F172A"} />
                        </svg>
                      </div>
                    </div>

                    {/* DÖNEN ÇARK KATMANI (Kare kutular kaldırıldı, minimalist serbest yüzen simgeler & altlarında yazıları) */}
                    <div 
                      className={"absolute inset-0 w-full h-full flex items-center justify-center animate-flywheel-spin" + (activeFlywheelModule !== null ? " flywheel-paused" : "")}
                    >
                      {flywheelModules.map((mod, idx) => {
                        const isHovered = activeFlywheelModule === idx;
                        const positionStyles = [
                          { top: 'calc(50% - 126px)', left: '50%' }, // 0: Üst (Bireysel Veri Analizi)
                          { top: '50%', left: 'calc(50% + 126px)' }, // 1: Sağ (Akıllı Müfredat)
                          { top: 'calc(50% + 126px)', left: '50%' }, // 2: Alt (Disiplin & Alışkanlık Takibi)
                          { top: '50%', left: 'calc(50% - 126px)' }, // 3: Sol (Hedef Odaklı Çıktı)
                        ][idx];

                        return (
                          <div
                            key={mod.id}
                            style={{
                              position: 'absolute',
                              top: positionStyles.top,
                              left: positionStyles.left,
                              transform: 'translate(-50%, -50%)',
                            }}
                            className="z-30 pointer-events-auto"
                          >
                            {/* Dik Tutucu (Counter-rotation): Çark dönerken simge ve yazıların dik kalmasını sağlar */}
                            <div className={"animate-flywheel-counter" + (activeFlywheelModule !== null ? " flywheel-paused" : "")}>
                              <button
                                type="button"
                                onMouseEnter={() => setActiveFlywheelModule(idx)}
                                onMouseLeave={() => setActiveFlywheelModule(null)}
                                onClick={() => setActiveFlywheelModule(activeFlywheelModule === idx ? null : idx)}
                                aria-label={mod.title}
                                className={"relative flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group/node " + (isHovered ? "scale-120" : "hover:scale-110")}
                              >
                                {/* Minimalist Serbest Süzülen Simge (Arkasında kare kutu yok) */}
                                <div className="relative flex items-center justify-center p-2">
                                  {/* Doğal Neon Halo */}
                                  <div 
                                    className="absolute inset-0 rounded-full blur-md transition-opacity duration-300 pointer-events-none"
                                    style={{
                                      backgroundColor: mod.color,
                                      opacity: isHovered ? 0.65 : 0.15
                                    }}
                                  />

                                  {/* Simgeler */}
                                  <mod.icon 
                                    size={28} 
                                    style={{ 
                                      color: mod.color,
                                      filter: isHovered ? ('drop-shadow(0 0 14px ' + mod.color + ')') : ('drop-shadow(0 0 6px ' + mod.color + ')')
                                    }}
                                    className="relative z-10 transition-transform duration-300" 
                                  />
                                </div>

                                {/* Simgenin Altındaki İlgili Başlık Yazısı */}
                                <span 
                                  className={"mt-1 whitespace-nowrap text-[11px] sm:text-xs font-bold tracking-wide transition-all duration-200 text-center " + (
                                    isHovered 
                                      ? (theme === 'dark' ? "text-[#E2E8F0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" : "text-[#1A1D24] drop-shadow-sm")
                                      : (theme === 'dark' ? "text-[#E2E8F0]/75 group-hover/node:text-[#E2E8F0]" : "text-[#68707D] group-hover/node:text-[#1A1D24]")
                                  )}
                                  style={{ color: isHovered ? mod.color : undefined }}
                                >
                                  {mod.title}
                                </span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* ALT: Mikro Detay Paneli (Hover yapıldığında açılır / yapılmadığında rehber & butonlar gösterilir) */}
                  <div className="relative z-30 mt-2">
                    {activeFlywheelModule !== null ? (
                      /* Aktif Modül Mikro Detay Kartı */
                      <div 
                        className={"rounded-2xl p-4 border backdrop-blur-2xl shadow-2xl transition-all duration-300 " + (
                          theme === 'dark' ? "bg-[#181B22]/95" : "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                        )}
                        style={{
                          borderColor: flywheelModules[activeFlywheelModule].borderGlow,
                          boxShadow: ('0 10px 30px -10px ' + flywheelModules[activeFlywheelModule].shadowGlow)
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <span 
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black text-white"
                              style={{ backgroundColor: flywheelModules[activeFlywheelModule].color }}
                            >
                              {flywheelModules[activeFlywheelModule].step}
                            </span>
                            <span className={"text-sm font-black tracking-wide " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>
                              {flywheelModules[activeFlywheelModule].title}
                            </span>
                          </div>
                          
                          <span 
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                            style={{
                              color: flywheelModules[activeFlywheelModule].color,
                              borderColor: flywheelModules[activeFlywheelModule].borderGlow,
                              backgroundColor: flywheelModules[activeFlywheelModule].bgGlow
                            }}
                          >
                            {flywheelModules[activeFlywheelModule].badge}
                          </span>
                        </div>

                        <p className={"text-xs sm:text-[13px] leading-relaxed font-normal " + (
                          theme === 'dark' ? "text-[#D1D5DB]" : "text-[#68707D]"
                        )}>
                          {flywheelModules[activeFlywheelModule].detail}
                        </p>

                        <div className={"mt-2.5 pt-2 border-t flex items-center justify-between text-[11px] " + (
                          theme === 'dark' ? "border-white/[0.06]" : "border-[#E3E6EB]"
                        )}>
                          <span className={theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]"}>Sistem Çıktısı:</span>
                          <span className={"font-bold flex items-center gap-1.5 " + (theme === 'dark' ? "text-white" : "text-[#1A1D24]")}>
                            <CheckCircle2 size={13} style={{ color: flywheelModules[activeFlywheelModule].color }} />
                            {flywheelModules[activeFlywheelModule].metric}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Varsayılan 4'lü Seçim Barı & Rehber */
                      <div className={"rounded-2xl p-3 border backdrop-blur-md transition-colors duration-300 " + (
                        theme === 'dark' ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-[#E3E6EB] shadow-xs"
                      )}>
                        <div className={"text-[11px] text-center mb-2.5 font-medium flex items-center justify-center gap-1.5 " + (
                          theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]"
                        )}>
                          <RotateCcw size={12} className="text-[#5B3FD9]" />
                          <span>Çark üzerindeki simgelerin üzerine gelerek mikro detayları açın:</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {flywheelModules.map((m, idx) => (
                            <button
                              key={m.id}
                              type="button"
                              onMouseEnter={() => setActiveFlywheelModule(idx)}
                              onMouseLeave={() => setActiveFlywheelModule(null)}
                              onClick={() => setActiveFlywheelModule(idx)}
                              className={"px-2 py-1.5 rounded-xl border text-left transition-all duration-200 flex items-center gap-1.5 group/btn " + (
                                theme === 'dark' 
                                  ? "bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.06]" 
                                  : "bg-white hover:bg-[#E9E3DE]/30 border-[#E3E6EB] shadow-xs"
                              )}
                            >
                              <span 
                                className="w-4 h-4 rounded text-[9px] font-black flex items-center justify-center text-white"
                                style={{ backgroundColor: m.color }}
                              >
                                {m.step}
                              </span>
                              <span className={"text-[10px] font-bold truncate transition-colors " + (
                                theme === 'dark' ? "text-[#D1D5DB] group-hover/btn:text-white" : "text-[#68707D] group-hover/btn:text-[#1A1D24]"
                              )}>
                                {m.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* Feature 4: Oyunlaştırma & Streak */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] mt-40">
            
            {/* Left: Streak Animation */}
            <div className="col-span-1">
              <div className={"border rounded-[23px] p-8 h-[420px] flex flex-col justify-center items-center shadow-2xl relative overflow-hidden group cursor-crosshair specular-top " + (theme === 'dark' ? "bg-[#130B24]/85 border-white/[0.08] backdrop-blur-2xl" : "bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-[#E3E6EB]")}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF5A4D]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div className={(theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]") + " text-xs font-bold uppercase tracking-[0.3em] mb-10 z-10"}>Günlük Seri</div>
                
                <div className="flex items-center gap-2 md:gap-3 z-10">
                  {["Pzt", "Sal", "Çar", "Per"].map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                       <Flame size={24} className="text-[#FF5A4D] drop-shadow-[0_0_8px_rgba(255,90,95,0.8)]" />
                       <span className={"text-[10px] font-bold uppercase " + (theme === 'dark' ? "text-white/50" : "text-[#68707D]")}>{d}</span>
                    </div>
                  ))}
                  
                  {/* Today (Animates on hover) */}
                  <div className="flex flex-col items-center gap-3 relative">
                     <div className="absolute inset-0 bg-[#FF5A4D] blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-1000 delay-300 rounded-full scale-150"></div>
                     <Flame size={28} className={"group-hover:text-[#FF5A4D] group-hover:drop-shadow-[0_0_15px_rgba(255,90,95,1)] transition-colors duration-1000 delay-300 relative z-10 group-hover:scale-110 " + (theme === 'dark' ? "text-white/10" : "text-[#68707D]/30")} />
                     <span className={"text-[10px] font-black group-hover:text-[#FF5A4D] transition-colors duration-1000 delay-300 uppercase " + (theme === 'dark' ? "text-white/50" : "text-[#68707D]")}>Cum</span>
                  </div>
                  
                  {["Cmt", "Paz"].map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                       <Flame size={24} className={theme === 'dark' ? "text-white/10" : "text-[#E3E6EB]"} />
                       <span className={"text-[10px] font-bold uppercase " + (theme === 'dark' ? "text-white/20" : "text-[#68707D]/40")}>{d}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 text-center z-10">
                  <div className="text-[6rem] font-black leading-none relative flex justify-center items-center h-[100px] overflow-hidden">
                    <span className={"absolute text-transparent bg-clip-text group-hover:-translate-y-full group-hover:opacity-0 transition-all duration-[800ms] delay-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] " + (theme === 'dark' ? "bg-gradient-to-b from-[#E2E8F0] to-white/20" : "bg-gradient-to-b from-[#1A1D24] to-[#68707D]")}>12</span>
                    <span className="absolute translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[800ms] delay-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-[#FF5A4D] drop-shadow-[0_0_30px_rgba(255,90,95,0.4)]">13</span>
                  </div>
                  <div className="text-[#FF5A4D] font-bold tracking-widest mt-4 uppercase text-xs animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-[1200ms]">Gündür İlerliyorsun</div>
                </div>
              </div>
            </div>

            {/* Center: Text Content */}
            <div className="col-span-1 flex flex-col justify-center text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] mx-auto mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <Gamepad2 size={32} />
              </div>
              <h2 className={"text-4xl md:text-5xl font-black tracking-tight mb-6 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>
                Oyunlaştırılmış <span className="text-[#F59E0B]">Eğitim</span>
              </h2>
              <p className={(theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]") + " text-lg leading-relaxed font-medium"}>
                Öğrenmeyi sıkıcı bir zorunluluk olmaktan çıkarıp, bağımlılık yapan bir serüvene dönüştürüyoruz. Kesintisiz çalışma serilerini <span className="text-[#FF5A4D] font-bold">(Streak)</span> koruyarak motivasyonunu zirvede tut ve kendi sınıfının liderlik tablosunda kıyasıya bir rekabete katıl!
              </p>
            </div>

            {/* Right: Leaderboard Animation */}
            <div className="col-span-1">
              <div className={"border rounded-[23px] p-8 h-[420px] flex flex-col justify-center shadow-2xl relative overflow-hidden group cursor-crosshair specular-top " + (theme === 'dark' ? "bg-[#130B24]/85 border-white/[0.08] backdrop-blur-2xl" : "bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-[#E3E6EB]")}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#F59E0B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <div className={"flex justify-between items-center mb-8 border-b pb-4 z-10 " + (theme === 'dark' ? "border-white/5" : "border-[#E3E6EB]")}>
                  <span className={(theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]") + " text-xs font-bold tracking-[0.2em] uppercase"}>10/A SINIFI LİDERLERİ</span>
                  <Trophy className="text-[#F59E0B] w-5 h-5 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                </div>

                <div className="relative h-56 w-full z-10">
                   {/* Row 1 (Drops to 2) */}
                   <div className={"absolute top-0 w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-[1000ms] delay-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:top-[4.5rem] " + (theme === 'dark' ? "bg-white/5 border-white/5" : "bg-[#E9E3DE]/30 border-[#E3E6EB]")}>
                     <div className="flex items-center gap-4">
                        <span className={"font-bold w-4 text-center " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]")}>1</span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-[#5B3FD9] flex items-center justify-center text-xs font-bold text-white">DK</div>
                        <span className={"font-semibold text-sm " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>Deniz K.</span>
                     </div>
                     <span className="text-[#5B3FD9] font-bold text-sm">1450 XP</span>
                   </div>

                   {/* Row 2 (Drops to 3) */}
                   <div className={"absolute top-[4.5rem] w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-[1000ms] delay-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:top-[9rem] " + (theme === 'dark' ? "bg-white/5 border-white/5" : "bg-[#E9E3DE]/30 border-[#E3E6EB]")}>
                     <div className="flex items-center gap-4">
                        <span className={"font-bold w-4 text-center " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]")}>2</span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">AM</div>
                        <span className={"font-semibold text-sm " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>Ayşe M.</span>
                     </div>
                     <span className="text-[#5B3FD9] font-bold text-sm">1320 XP</span>
                   </div>

                   {/* Row 3 (User) -> Rises to 1 */}
                   <div className={"absolute top-[9rem] w-full flex items-center justify-between p-4 rounded-xl transition-all duration-[1000ms] delay-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:top-0 " + (theme === 'dark' ? "bg-[#FF5A4D]/10 border border-[#FF5A4D]/30 group-hover:bg-[#F59E0B]/20 group-hover:border-[#F59E0B]/50 shadow-[0_0_15px_rgba(255,90,95,0.1)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]" : "bg-[#FF5A4D]/10 border border-[#FF5A4D]/40 group-hover:bg-[#F59E0B]/15 group-hover:border-[#F59E0B]/50 shadow-sm")}>
                     <div className="flex items-center gap-4">
                        <span className="font-bold text-[#FF5A4D] group-hover:text-[#F59E0B] transition-colors duration-[1000ms] delay-[800ms] w-4 text-center">
                          <span className="group-hover:opacity-0 absolute transition-opacity duration-500">3</span>
                          <span className="opacity-0 group-hover:opacity-100 absolute transition-opacity duration-500 delay-[1200ms]">1</span>
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF5A4D] to-[#F59E0B] flex items-center justify-center text-xs font-bold text-white shadow-inner border border-white/20">SEN</div>
                        <span className={"font-bold text-sm " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>Sen</span>
                     </div>
                     <div className="relative flex items-center justify-end w-20">
                        <span className="text-[#FF5A4D] font-bold text-sm absolute group-hover:opacity-0 transition-opacity duration-300">1280 XP</span>
                        {/* Point counting up effect */}
                        <span className="text-[#F59E0B] font-bold text-sm absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-[1200ms] drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">+1500 XP</span>
                     </div>
                   </div>
                </div>
              </div>
            </div>

          </div>

        </section>
              {/* 1. MISYONUMUZ SECTION */}
        <section id="misyonumuz" className="scroll-mt-28 max-w-7xl mx-auto px-6 mb-44 relative reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className={"relative rounded-3xl border p-8 md:p-16 overflow-hidden shadow-2xl transition-colors duration-300 specular-top " + (theme === 'dark' ? "bg-gradient-to-b from-[#130B24] via-[#0E061B] to-[#130B24] border-white/[0.08] backdrop-blur-2xl" : "bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-[#E3E6EB]")}>
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FF5A4D]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#8B6CFF]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
              <div className={"inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[#5B3FD9] text-xs font-semibold tracking-[0.25em] uppercase mb-6 " + (theme === 'dark' ? "bg-white/[0.04] border-white/[0.08]" : "bg-white border-[#E3E6EB] shadow-xs")}>
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A4D]" />
                Misyonumuz & Vizyonumuz
              </div>
              <h2 className={"text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>
                Sınırların Ötesinde Bir <span className="bg-gradient-to-r from-[#FF5A4D] to-[#5B3FD9] bg-clip-text text-transparent">Eğitim Devrimi</span>
              </h2>
              <p className={"text-lg md:text-xl leading-relaxed font-normal " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]")}>
                Ezbere dayalı, tek tip ve pasif eğitim modellerini tarihe gömüyoruz. OLTVIA; yapay zekanın hesaplama gücünü insan odaklı pedagoji ve Sokratik sorgulama ile harmanlayarak her öğrencinin benzersiz zihinsel potansiyelini gerçeğe dönüştürür.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 mb-12">
              <div className={"p-8 rounded-2xl border hover:border-[#FF5A4D]/40 transition-all duration-500 hover:-translate-y-2 group " + (theme === 'dark' ? "bg-[#160D2A]/60 border-white/[0.08] backdrop-blur-xl" : "bg-white border-[#E3E6EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)]")}>
                <div className="w-14 h-14 rounded-xl bg-[#FF5A4D]/10 border border-[#FF5A4D]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-[#FF5A4D]" />
                </div>
                <h3 className={"text-xl font-bold mb-3 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>Sokratik Bilişsel Mentörlük</h3>
                <p className={(theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]") + " text-sm leading-relaxed"}>
                  Cevapları hazır sunmak yerine, zihni açan doğru sorular ve analojilerle öğrencinin mantık yürütmesini sağlarız. Ezber değil, kalıcı ve derin kavrayış inşa ederiz.
                </p>
              </div>

              <div className={"p-8 rounded-2xl border hover:border-[#8B6CFF]/40 transition-all duration-500 hover:-translate-y-2 group " + (theme === 'dark' ? "bg-[#160D2A]/60 border-white/[0.08] backdrop-blur-xl" : "bg-white border-[#E3E6EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)]")}>
                <div className="w-14 h-14 rounded-xl bg-[#5B3FD9]/10 border border-[#5B3FD9]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-[#5B3FD9]" />
                </div>
                <h3 className={"text-xl font-bold mb-3 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>Sıfır Sapma ile Hedef Rotası</h3>
                <p className={(theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]") + " text-sm leading-relaxed"}>
                  Her deneme ve soruyu analiz eden algoritmamız, öğrencinin bilişsel zayıf noktalarını milimetrik hassasiyetle tespit ederek hedefe giden en optimize rotayı çizer.
                </p>
              </div>

              <div className={"p-8 rounded-2xl border hover:border-white/30 transition-all duration-500 hover:-translate-y-2 group " + (theme === 'dark' ? "bg-[#160D2A]/60 border-white/[0.08] backdrop-blur-xl" : "bg-white border-[#E3E6EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)]")}>
                <div className={"w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform " + (theme === 'dark' ? "bg-white/[0.06] border border-white/[0.1]" : "bg-[#E9E3DE]/40 border-[#E3E6EB]")}>
                  <Flame className="w-7 h-7 text-[#F59E0B]" />
                </div>
                <h3 className={"text-xl font-bold mb-3 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>Bütünleşik & Canlı Ekosistem</h3>
                <p className={(theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]") + " text-sm leading-relaxed"}>
                  Öğrenci, öğretmen, veli ve okulu tek bir şeffaf veri ağında birleştirir; streak ve seviye sistemleriyle çalışma disiplinini bağımlılık yaratan bir tutkuya dönüştürürüz.
                </p>
              </div>
            </div>

            {/* Manifesto Callout Box */}
            <div className={"p-8 rounded-2xl border text-center max-w-4xl mx-auto " + (theme === 'dark' ? "bg-gradient-to-r from-[#FF5A4D]/10 via-[#8B6CFF]/10 to-transparent border-white/[0.1]" : "bg-[#E9E3DE]/30 border-[#E3E6EB] shadow-xs")}>
              <h4 className={"text-lg font-bold mb-2 " + (theme === 'dark' ? "text-white" : "text-[#1A1D24]")}>Eğitim Manifestomuz</h4>
              <p className={(theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]") + " text-sm leading-relaxed"}>
                "Hiçbir öğrenci yeteneksiz değildir; yalnızca kendi hızına ve zihinsel ritmine uygun bir yol göstericiye ihtiyaç duyar. OLTVIA, öğrencinin hızına adapte olarak imkansız sanılan hedefleri tam 12'den vurması için tasarlandı."
              </p>
            </div>
          </div>
        </section>

        {/* 2. S.S.S (FAQ) SECTION */}
        <section id="sss" className="scroll-mt-28 max-w-5xl mx-auto px-6 mb-44 relative reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="text-center mb-16">
            <div className={"inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[#5B3FD9] text-xs font-semibold tracking-[0.25em] uppercase mb-4 " + (theme === 'dark' ? "bg-white/[0.04] border-white/[0.08]" : "bg-white border-[#E3E6EB] shadow-xs")}>
              <HelpCircle className="w-3.5 h-3.5 text-[#5B3FD9]" />
              Sıkça Sorulan Sorular
            </div>
            <h2 className={"text-4xl md:text-5xl font-black tracking-tight mb-4 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>
              Aklınıza Takılan Her Şey
            </h2>
            <p className={(theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]") + " text-base md:text-lg"}>
              OLTVIA'nın yapay zeka dinamikleri, çalışma yöntemleri ve güvenliği hakkında merak edilenler.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "OLTVIA'nın klasik soru çözüm uygulamalarından farkı nedir?",
                a: "Geleneksel uygulamalar genellikle sorunun hazır çözüm videosunu veya doğrudan cevabını gösterir; bu da ezbere ve pasif öğrenmeye yol açar. OLTVIA ise Sokratik yöntem uygular: Sorunun cevabını doğrudan vermez, öğrencinin takıldığı adımı tespit ederek yönlendirici sorular, ipuçları ve görsel analojilerle doğru cevaba kendisinin ulaşmasını sağlar."
              },
              {
                q: "Sokratik Yapay Zeka mentörü hangi dersleri ve sınavları kapsar?",
                a: "Sokratik Mentör; YKS (TYT & AYT), LGS ve lise ara sınıflarının tüm Matematik, Geometri, Fizik, Kimya, Biyoloji, Türkçe/Edebiyat ve Sosyal Bilimler müfredatlarını kapsar. MEB ve ÖSYM kazanımlarına tam uyumlu olarak sürekli güncellenir."
              },
              {
                q: "Hedef rotası ve 'Sıfır Sapma' analizi nasıl hesaplanır?",
                a: "Platform, çözdüğünüz her sorunun harcadığı süreyi, yanlış yapılan konulardaki bilişsel haritayı ve hedeflediğiniz üniversite/bölümün taban net verilerini işler. 'Sıfır Sapma' motoru, sizi hedefinize ulaştıracak haftalık net gelişim eğrisini hesaplar ve saptığınız anda rotanızı yeniden optimize eder."
              },
              {
                q: "Öğretmenler ve Kurumlar OLTVIA'yı nasıl entegre edebilir?",
                a: "Kurumsal panel sayesinde okullar ve kurs merkezleri tüm sınıfların konu bazlı başarı oranlarını, bilişsel zayıf noktalarını ve çalışma disiplinini tek ekrandan izler. Öğretmenler saniyeler içinde yapay zeka destekli kişiselleştirilmiş ödev setleri oluşturabilir ve velilere otomatik rapor iletebilir."
              },
              {
                q: "Günlük Seri (Streak) ve Liderlik Tablosu motivasyonu nasıl artırır?",
                a: "Eğitimi oyunlaştırma ilkeleriyle harmanladık. Her gün en az bir çalışma oturumu tamamlamak serinizi (Streak) korur. Çözülen zor sorular ve kazanılan kavramlar size XP kazandırır ve sınıfınızın liderlik tablosunda adınızı yukarılara taşır. Bu mekanizma düzenli çalışma disiplinini kalıcı alışkanlığa dönüştürür."
              },
              {
                q: "Öğrenci verileri nasıl korunur ve gizlilik standartları nelerdir?",
                a: "OLTVIA, 6698 sayılı KVKK ve Avrupa Birliği GDPR yönergeleriyle tam uyumlu çalışır. Öğrenci verileri, deneme netleri ve yapay zeka yazışmaları uçtan uca askeri düzeyde (AES-256) şifrelenir. Verileriniz asla üçüncü taraflara satılmaz veya ticari reklam hedeflemesinde kullanılmaz."
              }
            ].map((faq, idx) => (
              <div 
                key={idx}
                className={"rounded-2xl border overflow-hidden transition-all duration-300 " + (theme === 'dark' ? "bg-[#130B24]/70 border-white/[0.08] hover:border-white/20 backdrop-blur-xl" : "bg-white border-[#E3E6EB] hover:border-[#5B3FD9]/40 shadow-[0_2px_12px_rgba(0,0,0,0.03)]")}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                >
                  <span className={"text-base md:text-lg font-bold flex items-center gap-3 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>
                    <span className="text-xs font-mono text-[#5B3FD9] px-2 py-1 rounded bg-[#5B3FD9]/10">0{idx + 1}</span>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-[#9CA3AF] transition-transform duration-300 flex-shrink-0 ${openFaq === idx ? 'rotate-180 text-[#FF5A4D]' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className={"px-6 pb-6 pt-2 text-sm md:text-base leading-relaxed border-t " + (theme === 'dark' ? "text-[#9CA3AF] border-white/[0.04]" : "text-[#68707D] border-[#E3E6EB]")}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 3. YASAL VE GUVENLIK ILKELERI (SARTLAR, KOSULLAR, GIZLILIK) */}
        <section id="yasal" className="scroll-mt-28 max-w-5xl mx-auto px-6 mb-44 relative reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="text-center mb-12">
            <div className={"inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[#10B981] text-xs font-semibold tracking-[0.25em] uppercase mb-4 " + (theme === 'dark' ? "bg-white/[0.04] border-white/[0.08]" : "bg-white border-[#E3E6EB] shadow-xs")}>
              <Shield className="w-3.5 h-3.5 text-[#10B981]" />
              Yasal & Güvenlik Esasları
            </div>
            <h2 className={"text-4xl md:text-5xl font-black tracking-tight mb-4 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>
              Şartlar, Koşullar ve Gizlilik
            </h2>
            <p className={(theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]") + " text-base md:text-lg max-w-2xl mx-auto"}>
              Şeffaflık, güvenilirlik ve veri koruma standartlarımız; tüm platform kullanımınızı yasal güvence altına alır.
            </p>
          </div>

          <div className={"rounded-3xl border overflow-hidden shadow-2xl backdrop-blur-2xl transition-colors duration-300 specular-top " + (theme === 'dark' ? "bg-[#130B24]/80 border-white/[0.08]" : "bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-[#E3E6EB]")}>
            {/* Interactive Tab Switcher */}
            <div className={"flex border-b overflow-x-auto " + (theme === 'dark' ? "border-white/[0.08] bg-[#0E061B]/80" : "border-[#E3E6EB] bg-[#E9E3DE]/30")}>
              <button
                onClick={() => setLegalTab('terms')}
                className={`py-4 px-6 text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  legalTab === 'terms' 
                    ? (theme === 'dark' ? 'border-[#FF5A4D] text-[#FF5A4D] bg-white/[0.04]' : 'border-[#FF5A4D] text-[#FF5A4D] bg-[#FF5A4D]/10 font-bold') 
                    : (theme === 'dark' ? 'border-transparent text-[#9CA3AF] hover:text-[#E2E8F0]' : 'border-transparent text-[#68707D] hover:text-[#1A1D24]')
                }`}
              >
                <FileText className="w-4 h-4" /> Kullanım Şartları
              </button>
              <button
                onClick={() => setLegalTab('conditions')}
                className={`py-4 px-6 text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  legalTab === 'conditions' 
                    ? (theme === 'dark' ? 'border-[#8B6CFF] text-[#8B6CFF] bg-white/[0.04]' : 'border-[#5B3FD9] text-[#5B3FD9] bg-[#5B3FD9]/10 font-bold') 
                    : (theme === 'dark' ? 'border-transparent text-[#9CA3AF] hover:text-[#E2E8F0]' : 'border-transparent text-[#68707D] hover:text-[#1A1D24]')
                }`}
              >
                <Check className="w-4 h-4" /> Şartlar ve Koşullar
              </button>
              <button
                onClick={() => setLegalTab('privacy')}
                className={`py-4 px-6 text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  legalTab === 'privacy' 
                    ? (theme === 'dark' ? 'border-[#0EA5E9] text-[#0EA5E9] bg-white/[0.04]' : 'border-[#5B3FD9] text-[#5B3FD9] bg-[#5B3FD9]/10 font-bold') 
                    : (theme === 'dark' ? 'border-transparent text-[#9CA3AF] hover:text-[#E2E8F0]' : 'border-transparent text-[#68707D] hover:text-[#1A1D24]')
                }`}
              >
                <Lock className="w-4 h-4" /> Gizlilik & KVKK
              </button>
            </div>

            {/* Active Tab Content Area */}
            <div className={"p-8 md:p-12 text-sm md:text-base leading-relaxed space-y-6 " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]")}>
              
              {legalTab === 'terms' && (
                <div className="space-y-6 animate-fade-in">
                  <div className={"flex items-center justify-between pb-4 border-b " + (theme === 'dark' ? "border-white/[0.06]" : "border-[#E3E6EB]")}>
                    <div>
                      <h3 className={"text-xl md:text-2xl font-bold " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>Kullanım Şartları Sözleşmesi</h3>
                      <p className={"text-xs mt-1 " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D] font-medium")}>Son Güncelleme: 13 Ekim 2026 • Versiyon 2.4</p>
                    </div>
                    <span className="text-xs font-mono text-[#FF5A4D] px-3 py-1 rounded bg-[#FF5A4D]/10">RESMİ SÖZLEŞME</span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h4 className={"font-bold text-base mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>1. Taraflar ve Hizmetin Tanımı</h4>
                      <p className={theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D] font-normal"}>
                        İşbu Kullanım Şartları, OLTVIA Eğitim Teknolojileri A.Ş. ("OLTVIA") tarafından sunulan internet sitesi, mobil uygulamalar, Sokratik yapay zeka ders asistanı ve kurumsal yönetim panellerini kapsar. Platforma kaydolan veya içeriklerden faydalanan her gerçek ve tüzel kişi ("Kullanıcı"), işbu şartları peşinen kabul etmiş sayılır.
                      </p>
                    </div>

                    <div>
                      <h4 className={"font-bold text-base mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>2. Hesap Güvenliği ve Tekil Kullanım İlkesi</h4>
                      <p className={theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D] font-normal"}>
                        Kullanıcı, oluşturduğu hesabın kullanıcı adı ve şifre güvenliğinden bizzat sorumludur. Hesabın üçüncü kişilere devredilmesi, satılması veya eşzamanlı olarak yetkisiz kişilerce paylaşılması yasaktır. OLTVIA, tek hesap üzerinden olağandışı çoklu IP erişimi veya şüpheli aktivite tespit etmesi halinde hesabı geçici veya kalıcı olarak askıya alma hakkını saklı tutar.
                      </p>
                    </div>

                    <div>
                      <h4 className={"font-bold text-base mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>3. Kabul Edilebilir Kullanım ve Yasak Faaliyetler</h4>
                      <p className={theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D] font-normal"}>
                        Kullanıcılar; platform üzerindeki soru havuzlarını, yapay zeka yanıt modellerini, algoritmik gelişim eğrilerini veya arayüz tasarımlarını kazıma (scraping), tersine mühendislik (reverse engineering) veya bot yazılımlar vasıtasıyla kopyalayamaz. Ayrıca hileli yöntemlerle XP, puan veya seri (Streak) artışı üretmek kesinlikle yasaktır.
                      </p>
                    </div>

                    <div>
                      <h4 className={"font-bold text-base mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>4. Fikri Mülkiyet Hakları</h4>
                      <p className={theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D] font-normal"}>
                        Platformda yer alan tüm yazılımlar, Sokratik AI istem mühendisliği (prompt engineering) modelleri, logolar, grafikler ve özgün eğitim içerikleri OLTVIA'nın münhasır mülkiyetindedir ve 5846 sayılı Fikir ve Sanat Eserleri Kanunu ile korunmaktadır.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {legalTab === 'conditions' && (
                <div className="space-y-6 animate-fade-in">
                  <div className={"flex items-center justify-between pb-4 border-b " + (theme === 'dark' ? "border-white/[0.06]" : "border-[#E3E6EB]")}>
                    <div>
                      <h3 className={"text-xl md:text-2xl font-bold " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>Şartlar ve Koşullar (Abonelik Esasları)</h3>
                      <p className={"text-xs mt-1 " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D] font-medium")}>Yürürlük Tarihi: 13 Ekim 2026</p>
                    </div>
                    <span className="text-xs font-mono text-[#5B3FD9] px-3 py-1 rounded bg-[#5B3FD9]/10">HİZMET POLİTİKASI</span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h4 className={"font-bold text-base mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>1. Abonelik Paketleri ve Ödeme Koşulları</h4>
                      <p className={theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D] font-normal"}>
                        OLTVIA, bireysel öğrencilere yönelik aylık/yıllık B2C abonelikler ile okullara ve kurs merkezlerine yönelik çoklu lisanslı B2B kurumsal paketler sunar. Abonelik bedelleri, kayıt esnasında belirtilen periyotlarla kredi kartı veya kurumsal faturalandırma kanalıyla peşin tahsil edilir. Fiyat değişiklikleri en az 30 gün önceden kullanıcılara bildirilir.
                      </p>
                    </div>

                    <div>
                      <h4 className={"font-bold text-base mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>2. Cayma Hakkı ve İade Politikası</h4>
                      <p className={theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D] font-normal"}>
                        Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca; anında ifa edilen dijital hizmetler ve elektronik ortamda teslim edilen yapay zeka eğitim yazılımlarında, kullanıcı hizmeti aktif olarak kullanmaya başladıktan sonra cayma hakkı istisna kapsamındadır. Bununla birlikte, teknik arızalardan kaynaklanan ve 72 saat içinde giderilemeyen aksaklıklarda orantılı iade süreci işletilir.
                      </p>
                    </div>

                    <div>
                      <h4 className={"font-bold text-base mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>3. Yapay Zeka Çıktıları ve Pedagojik Sorumluluk Sınırı</h4>
                      <p className={theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D] font-normal"}>
                        OLTVIA'nın sunduğu Sokratik Yapay Zeka asistanı, öğrencinin zihinsel gelişimine rehberlik etmek üzere tasarlanmış ileri düzey bir pedagojik araçtır. Yapay zekanın sağladığı ipuçları ve yönlendirmeler resmi sınav başarısını doğrudan garanti eden bir taahhüt niteliğinde olmayıp, öğrencinin bireysel çalışma disiplinini destekleme amacı taşır.
                      </p>
                    </div>

                    <div>
                      <h4 className={"font-bold text-base mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>4. Uyuşmazlıkların Çözümü ve Yetkili Mahkeme</h4>
                      <p className={theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D] font-normal"}>
                        İşbu sözleşmeden doğabilecek her türlü ihtilafın çözümünde Türk Hukuku uygulanacak olup, İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri münhasıran yetkilidir.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {legalTab === 'privacy' && (
                <div className="space-y-6 animate-fade-in">
                  <div className={"flex items-center justify-between pb-4 border-b " + (theme === 'dark' ? "border-white/[0.06]" : "border-[#E3E6EB]")}>
                    <div>
                      <h3 className={"text-xl md:text-2xl font-bold " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>Gizlilik Politikası ve KVKK Aydınlatma Metni</h3>
                      <p className={"text-xs mt-1 " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D] font-medium")}>6698 sayılı KVKK ve Uluslararası GDPR Uyumlu</p>
                    </div>
                    <span className="text-xs font-mono text-[#10B981] px-3 py-1 rounded bg-[#10B981]/10">VERİ GÜVENCESİ</span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h4 className={"font-bold text-base mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>1. Veri Sorumlusu ve Kapsam</h4>
                      <p className={theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D] font-normal"}>
                        6698 sayılı KVKK uyarınca, OLTVIA Eğitim Teknolojileri A.Ş. veri sorumlusu sıfatıyla hareket etmektedir. Kişisel verileriniz; hukuka ve dürüstlük kurallarına uygun, doğru ve güncel olarak, pedagojik analiz ve kişiselleştirilmiş öğrenme amacıyla sınırlı şekilde işlenmektedir.
                      </p>
                    </div>

                    <div>
                      <h4 className={"font-bold text-base mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>2. İşlenen Kişisel Veri Kategorileri</h4>
                      <ul className={"list-disc pl-5 space-y-1.5 text-sm " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]")}>
                        <li><strong className={theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]"}>Kimlik ve İletişim Bilgileri:</strong> Ad, soyad, e-posta adresi, telefon numarası, sınıf düzeyi.</li>
                        <li><strong className={theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]"}>Akademik ve Bilişsel Veriler:</strong> Çözülen deneme netleri, soru çözüm süreleri, yanlış yapılan konu haritaları, yapay zeka mentörlük diyalogları.</li>
                        <li><strong className={theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]"}>İşlem ve Güvenlik Logları:</strong> IP adresi, cihaz bilgisi, oturum açma süreleri ve Streak serisi kayıtları.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className={"font-bold text-base mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>3. Veri Güvenliği ve Şifreleme İlkeleri</h4>
                      <p className={theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D] font-normal"}>
                        Platformumuzda saklanan tüm hassas öğrenci verileri AES-256 standardıyla şifrelenir. Ağ üzerindeki tüm iletişim TLS 1.3 güvenlik protokolü ile korunur. OLTVIA, öğrenci verilerini reklam ağlarıyla asla paylaşmaz ve hiçbir ticari kuruluşa satmaz.
                      </p>
                    </div>

                    <div>
                      <h4 className={"font-bold text-base mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>4. KVKK Madde 11 Kapsamındaki Haklarınız</h4>
                      <p className={theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D] font-normal"}>
                        Veri sahibi olarak; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, eksik veya yanlış işlenmişse düzeltilmesini isteme ve silinmesini talep etme hakkına sahipsiniz. Başvurularınızı <span className={"font-mono font-bold " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>kvkk@oltvia.com</span> adresine iletebilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* 4. BIZE ULASIN (KURUMSAL ILETISIM) SECTION */}
        <section id="iletisim" className="scroll-mt-28 max-w-7xl mx-auto px-6 mb-32 relative reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className={"inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[#FF5A4D] text-xs font-semibold tracking-[0.25em] uppercase mb-4 transition-colors " + (
                  theme === 'dark' ? "bg-white/[0.04] border border-white/[0.08]" : "bg-[#FF5A4D]/10 border border-[#FF5A4D]/20"
                )}>
                  <Building2 className="w-3.5 h-3.5 text-[#FF5A4D]" />
                  Kurumsal İş Birliği & Demo
                </div>
                <h2 className={"text-4xl md:text-5xl font-black tracking-tight mb-4 transition-colors duration-300 " + (
                  theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]"
                )}>
                  Yeni Nesil Eğitim Serüvenine <span className="bg-gradient-to-r from-[#FF5A4D] to-[#5B3FD9] bg-clip-text text-transparent">Birlikte Başlayalım</span>
                </h2>
                <p className={"text-base leading-relaxed transition-colors duration-300 " + (
                  theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]"
                )}>
                  K-12 Özel Okulları, kolejler ve eğitim kurumları için yapay zeka destekli, çok kiracılı (multi-tenant) Sokratik ekosistem. Okulunuza özel kurumsal sunum, pilot uygulama ve toplu lisanslama için eğitim teknolojileri danışmanlarımızla hemen irtibata geçin.
                </p>
              </div>

              <div className="space-y-4">
                <div className={"flex items-start gap-4 p-5 rounded-2xl border transition-colors duration-300 " + (
                  theme === 'dark' ? "bg-[#130B24]/70 border-white/[0.08] backdrop-blur-xl" : "bg-white border-[#E3E6EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                )}>
                  <div className="p-3 rounded-xl bg-[#5B3FD9]/10 text-[#5B3FD9]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={"text-sm font-bold mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>Genel Merkez & Ar-Ge</h4>
                    <p className={"text-xs leading-relaxed " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]")}>Büyükdere Caddesi No: 195, Kanyon Ofis Kuleleri, Levent / İstanbul</p>
                  </div>
                </div>

                <div className={"flex items-start gap-4 p-5 rounded-2xl border transition-colors duration-300 " + (
                  theme === 'dark' ? "bg-[#130B24]/70 border-white/[0.08] backdrop-blur-xl" : "bg-white border-[#E3E6EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                )}>
                  <div className="p-3 rounded-xl bg-[#FF5A4D]/10 text-[#FF5A4D]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={"text-sm font-bold mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>Kurumsal E-Posta Masası</h4>
                    <p className={"text-xs " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]")}>Kurumsal Demo & Lisanslama: <span className={"font-semibold " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>kurumsal@oltvia.com</span></p>
                    <p className={"text-xs " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]")}>Okul Entegrasyon Destek: <span className={"font-semibold " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>okul@oltvia.com</span></p>
                  </div>
                </div>

                <div className={"flex items-start gap-4 p-5 rounded-2xl border transition-colors duration-300 " + (
                  theme === 'dark' ? "bg-[#130B24]/70 border-white/[0.08] backdrop-blur-xl" : "bg-white border-[#E3E6EB] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
                )}>
                  <div className="p-3 rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={"text-sm font-bold mb-1 " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>Kurumsal Danışma & Destek Hattı</h4>
                    <p className={"text-xs " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]")}>+90 (212) 800 12 12 • Hafta içi 09:00 - 18:30</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Corporate Contact Form Column */}
            <div className="lg:col-span-7">
              <div className={"p-8 md:p-12 rounded-3xl border relative shadow-2xl transition-colors duration-300 specular-top " + (
                theme === 'dark' ? "bg-[#130B24]/85 border-white/[0.08] backdrop-blur-2xl" : "bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-[#E3E6EB]"
              )}>
                {contactSubmitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className={"text-2xl font-bold " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>Kurumsal Talebiniz Başarıyla Alındı!</h3>
                    <p className={"text-sm max-w-md mx-auto " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]")}>
                      Kurumunuza özel demo takvimi ve teknik entegrasyon bilgilendirmesi için eğitim teknolojileri direktörümüz en geç 2 iş saati içinde yetkili e-posta adresinizden sizinle iletişime geçecektir.
                    </p>
                    <button
                      onClick={() => {
                        setContactSubmitted(false);
                        setContactForm({ institution: '', name: '', email: '', phone: '', institutionType: 'K-12 Özel Okul', capacity: '500 - 1500 Öğrenci', message: '' });
                      }}
                      className={"mt-6 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors " + (
                        theme === 'dark' ? "bg-white/10 hover:bg-white/20 text-[#E2E8F0]" : "bg-[#5B3FD9]/10 hover:bg-[#5B3FD9]/20 text-[#5B3FD9]"
                      )}
                    >
                      Yeni Talep Gönder
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitted(true);
                    }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={"block text-xs font-bold uppercase tracking-wider mb-2 " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#1A1D24]")}>
                          Kurum Adı (Okul / Kolej)
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.institution}
                          onChange={(e) => setContactForm({ ...contactForm, institution: e.target.value })}
                          placeholder="Örn: Bilge Koleji / Özel Fen Lisesi"
                          className={"w-full px-4 py-3.5 rounded-xl border transition-colors text-sm focus:outline-none " + (
                            theme === 'dark' 
                              ? "bg-[#150C2C]/80 border-white/10 text-[#E2E8F0] placeholder-white/25 focus:border-[#FF5A4D] focus:ring-2 focus:ring-[#FF5A4D]/20" 
                              : "bg-[#E9E3DE]/30 border-[#E3E6EB] text-[#1A1D24] placeholder-[#68707D]/60 focus:border-[#FF5A4D]"
                          )}
                        />
                      </div>
                      <div>
                        <label className={"block text-xs font-bold uppercase tracking-wider mb-2 " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#1A1D24]")}>
                          Yetkili Adı Soyadı
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Örn: Dr. Ahmet Yılmaz (Kurucu / Müdür)"
                          className={"w-full px-4 py-3.5 rounded-xl border transition-colors text-sm focus:outline-none " + (
                            theme === 'dark' 
                              ? "bg-[#150C2C]/80 border-white/10 text-[#E2E8F0] placeholder-white/25 focus:border-[#FF5A4D] focus:ring-2 focus:ring-[#FF5A4D]/20" 
                              : "bg-[#E9E3DE]/30 border-[#E3E6EB] text-[#1A1D24] placeholder-[#68707D]/60 focus:border-[#FF5A4D]"
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={"block text-xs font-bold uppercase tracking-wider mb-2 " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#1A1D24]")}>
                          Kurumsal E-Posta Adresi
                        </label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="yonetim@kolej.k12.tr"
                          className={"w-full px-4 py-3.5 rounded-xl border transition-colors text-sm focus:outline-none " + (
                            theme === 'dark' 
                              ? "bg-[#150C2C]/80 border-white/10 text-[#E2E8F0] placeholder-white/25 focus:border-[#FF5A4D] focus:ring-2 focus:ring-[#FF5A4D]/20" 
                              : "bg-[#E9E3DE]/30 border-[#E3E6EB] text-[#1A1D24] placeholder-[#68707D]/60 focus:border-[#FF5A4D]"
                          )}
                        />
                      </div>
                      <div>
                        <label className={"block text-xs font-bold uppercase tracking-wider mb-2 " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#1A1D24]")}>
                          İletişim / Telefon Numarası
                        </label>
                        <input
                          type="tel"
                          required
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          placeholder="+90 (5XX) XXX XX XX"
                          className={"w-full px-4 py-3.5 rounded-xl border transition-colors text-sm focus:outline-none " + (
                            theme === 'dark' 
                              ? "bg-[#150C2C]/80 border-white/10 text-[#E2E8F0] placeholder-white/25 focus:border-[#FF5A4D] focus:ring-2 focus:ring-[#FF5A4D]/20" 
                              : "bg-[#E9E3DE]/30 border-[#E3E6EB] text-[#1A1D24] placeholder-[#68707D]/60 focus:border-[#FF5A4D]"
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={"block text-xs font-bold uppercase tracking-wider mb-2 " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#1A1D24]")}>
                        Kurum Türü
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {['K-12 Özel Okul', 'Kolej & Zincir Okul', 'Kurs / Etüt Merkezi', 'Eğitim Vakfı / STK'].map((type) => (
                          <button
                            type="button"
                            key={type}
                            onClick={() => setContactForm({ ...contactForm, institutionType: type })}
                            className={"py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center " + (
                              contactForm.institutionType === type 
                                ? 'bg-gradient-to-r from-[#FF5A4D] to-[#5B3FD9] text-white border-transparent shadow-md' 
                                : (theme === 'dark' ? 'bg-white/[0.02] text-[#9CA3AF] border-white/[0.08] hover:border-white/20' : 'bg-white text-[#68707D] border-[#E3E6EB] hover:border-[#5B3FD9]/40')
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={"block text-xs font-bold uppercase tracking-wider mb-2 " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#1A1D24]")}>
                        Tahmini Öğrenci / Lisans Kapasitesi
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {['100 - 500 Öğrenci', '500 - 1500 Öğrenci', '1500+ Öğrenci'].map((cap) => (
                          <button
                            type="button"
                            key={cap}
                            onClick={() => setContactForm({ ...contactForm, capacity: cap })}
                            className={"py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center " + (
                              contactForm.capacity === cap 
                                ? 'bg-gradient-to-r from-[#5B3FD9] to-[#FF5A4D] text-white border-transparent shadow-md' 
                                : (theme === 'dark' ? 'bg-white/[0.02] text-[#9CA3AF] border-white/[0.08] hover:border-white/20' : 'bg-white text-[#68707D] border-[#E3E6EB] hover:border-[#5B3FD9]/40')
                            )}
                          >
                            {cap}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={"block text-xs font-bold uppercase tracking-wider mb-2 " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#1A1D24]")}>
                        Kurumsal Talep / Mesajınız
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Kurumunuz için demo takvimi, pilot çalışma planı veya müfredat entegrasyonu talebinizi paylaşın..."
                        className={"w-full px-4 py-3 rounded-xl border transition-colors text-sm focus:outline-none " + (
                          theme === 'dark' 
                            ? "bg-[#150C2C]/80 border-white/10 text-[#E2E8F0] placeholder-white/25 focus:border-[#8B6CFF] focus:ring-2 focus:ring-[#8B6CFF]/20" 
                            : "bg-[#E9E3DE]/30 border-[#E3E6EB] text-[#1A1D24] placeholder-[#68707D]/60 focus:border-[#5B3FD9]"
                        )}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF5A43] via-[#FF7A50] to-[#5B3FD9] text-white font-bold text-sm uppercase tracking-widest shadow-[0_4px_24px_rgba(255,90,67,0.4)] hover:shadow-[0_6px_30px_rgba(255,90,67,0.6)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      <Building2 size={16} />
                      <span>Kurumsal Demo ve Bilgi Talebi Oluştur</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className={"border-t pt-20 pb-12 relative z-10 reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] " + (theme === 'dark' ? "border-white/[0.08] bg-[#0A0515]/95 backdrop-blur-2xl" : "border-[#E3E6EB] bg-white shadow-sm")}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b " + (theme === 'dark' ? "border-white/[0.06]" : "border-[#E3E6EB]")}>
            
            {/* Col 1: Brand & Bio */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 78 28 A 36 36 0 1 0 78 72" stroke={theme === 'dark' ? "#E2E8F0" : "#1A1D24"} strokeWidth="16" />
                  <circle cx="78" cy="28" r="8" fill="#5B3FD9" />
                  <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
                  <circle cx="45" cy="40" r="10" fill={theme === 'dark' ? "#E2E8F0" : "#1A1D24"} />
                  <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill={theme === 'dark' ? "#E2E8F0" : "#1A1D24"} />
                </svg>
                <span className={"text-2xl font-black tracking-widest font-sans " + (theme === 'dark' ? "text-[#E2E8F0]" : "text-[#1A1D24]")}>OLTVIΛ</span>
              </div>
              <p className={(theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]") + " text-sm max-w-sm leading-relaxed"}>
                Yapay zekanın bilişsel gücüyle her öğrenciye özel Sokratik eğitim ekosistemi. Sıfır sapma, yüksek motivasyon ve hedefe tam odaklanma.
              </p>
              <div className="pt-2 text-xs font-mono text-[#5B3FD9] tracking-widest uppercase">
                BEYOND WHAT YOU KNOW
              </div>
            </div>

            {/* Col 2: Platform Links */}
            <div>
              <h4 className={"text-xs font-bold uppercase tracking-[0.25em] mb-4 " + (theme === 'dark' ? "text-white" : "text-[#1A1D24]")}>Platform</h4>
              <ul className={"space-y-3 text-sm " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]")}>
                <li><a href="#ozellikler" className="hover:text-[#FF5A4D] transition-colors">Sokratik Mentör</a></li>
                <li><a href="#ozellikler" className="hover:text-[#FF5A4D] transition-colors">Hedef Rotası Analizi</a></li>
                <li><a href="#ozellikler" className="hover:text-[#FF5A4D] transition-colors">Performans Çarkı (Flywheel)</a></li>
                <li><a href="#ozellikler" className="hover:text-[#FF5A4D] transition-colors">Streak & Liderlik Tablosu</a></li>
                <li><a href="#girisler" className="hover:text-[#FF5A4D] transition-colors">Giriş Portalları</a></li>
              </ul>
            </div>

            {/* Col 3: Kurumsal Links */}
            <div>
              <h4 className={"text-xs font-bold uppercase tracking-[0.25em] mb-4 " + (theme === 'dark' ? "text-white" : "text-[#1A1D24]")}>Kurumsal</h4>
              <ul className={"space-y-3 text-sm " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]")}>
                <li><a href="#misyonumuz" className="hover:text-[#5B3FD9] transition-colors">Misyonumuz</a></li>
                <li><a href="#sss" className="hover:text-[#5B3FD9] transition-colors">Sıkça Sorulan Sorular</a></li>
                <li><a href="#yasal" className="hover:text-[#5B3FD9] transition-colors">Yasal İlkeler</a></li>
                <li><a href="#iletisim" className="hover:text-[#5B3FD9] transition-colors">Bize Ulaşın</a></li>
                <li><a href="#girisler" className="hover:text-[#5B3FD9] transition-colors">Kurumsal Yönetici Paneli</a></li>
              </ul>
            </div>

            {/* Col 4: Yasal & Güvenlik Links */}
            <div>
              <h4 className={"text-xs font-bold uppercase tracking-[0.25em] mb-4 " + (theme === 'dark' ? "text-white" : "text-[#1A1D24]")}>Yasal & Güvenlik</h4>
              <ul className={"space-y-3 text-sm " + (theme === 'dark' ? "text-[#9CA3AF]" : "text-[#68707D]")}>
                <li>
                  <button 
                    onClick={() => {
                      setLegalTab('terms');
                      document.getElementById('yasal')?.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    className={(theme === 'dark' ? "hover:text-[#E2E8F0]" : "hover:text-[#1A1D24]") + " transition-colors text-left"}
                  >
                    Kullanım Şartları
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setLegalTab('conditions');
                      document.getElementById('yasal')?.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    className={(theme === 'dark' ? "hover:text-[#E2E8F0]" : "hover:text-[#1A1D24]") + " transition-colors text-left"}
                  >
                    Şartlar ve Koşullar
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setLegalTab('privacy');
                      document.getElementById('yasal')?.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    className={(theme === 'dark' ? "hover:text-[#E2E8F0]" : "hover:text-[#1A1D24]") + " transition-colors text-left"}
                  >
                    Gizlilik Politikası
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setLegalTab('privacy');
                      document.getElementById('yasal')?.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    className={(theme === 'dark' ? "hover:text-[#E2E8F0]" : "hover:text-[#1A1D24]") + " transition-colors text-left"}
                  >
                    KVKK Aydınlatma Metni
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]/60">
            <div>
              © {new Date().getFullYear()} OLTVIA INC. TÜM HAKLARI SAKLIDIR.
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-[#10B981]">
                <Shield className="w-3.5 h-3.5" /> KVKK & GDPR Uyumlu
              </span>
              <span>256-Bit Uçtan Uca Şifreleme</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}