"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sun, Moon, LogOut, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function OgrenciDashboardPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ana Menü Linkleri (Büyük Puntolu Başlık Tipografisi)
  const mainNavLinks = [
    { title: 'Hakkımızda', href: '/#misyonumuz' },
    { title: 'Sokratik Mentör', href: '#' },
    { title: 'Hedef Rotası', href: '#' },
    { title: 'Dersler & Konular', href: '#' },
    { title: 'Performans Çarkı', href: '/#ozellikler' },
    { title: 'Deneme Sınavları', href: '#' },
    { title: 'İletişim', href: '/#iletisim' },
  ];

  // İkincil Alt Linkler (Body Text, Yatay Sıralı)
  const subNavLinks = [
    { title: 'Gizlilik Politikası', href: '/gizlilik' },
    { title: 'Kullanım Şartları', href: '/kullanim-sartlari' },
    { title: 'KVKK Aydınlatma', href: '/gizlilik' },
    { title: 'LinkedIn', href: 'https://linkedin.com', external: true },
    { title: 'Çıkış Yap', href: '/', isLogout: true },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('oltvia-theme') as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle('dark', saved === 'dark');
      document.documentElement.classList.toggle('light', saved === 'light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('oltvia-theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    document.documentElement.classList.toggle('light', nextTheme === 'light');
  };

  // ESC tuşu ile menüyü kapatma & body scroll kilidi
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div className={"min-h-screen font-sans selection:bg-[#FF5A4D]/30 overflow-hidden transition-colors duration-300 relative " + (theme === 'dark' ? "bg-[#07040F] text-[#E2E8F0]" : "bg-[#E9E3DE] text-[#1A1D24]")}>
      
      {/* Atmosferik OLTVIA Kozmik Işıklandırma */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[55rem] h-[30rem] bg-gradient-to-b from-[#8B6CFF]/15 via-[#FF5A4D]/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-[30rem] h-[30rem] bg-[#6366F1]/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 right-0 w-[35rem] h-[35rem] bg-[#FF5A4D]/10 blur-[140px] rounded-full" />
        <div className={"absolute inset-0 opacity-[0.03] " + (theme === 'dark' ? "invert" : "")} style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '36px 36px' }} />
      </div>

      {/* =========================================================================
          ÜST BAR:
          1. Sol Üst: Logo (OLTVIΛ)
          2. Ortada: Menü Butonu (Çizimdeki Dairesel Logo Butonu)
          3. Sağ Üst: Mod Değiştirme Tuşu + Profil Kısmı + Hamburger İkonu (Tetikleyici)
          ========================================================================= */}
      <header className={"fixed top-0 left-0 right-0 h-20 z-40 px-6 sm:px-10 flex items-center justify-between border-b backdrop-blur-2xl transition-colors duration-300 " + (
        theme === 'dark' 
          ? "bg-[#090514]/80 border-white/[0.08]" 
          : "bg-white/90 border-[#E3E6EB] shadow-xs"
      )}>
        
        {/* 1. SOL ÜST: OLTVIΛ Logo */}
        <Link href="/" className="flex items-center gap-3 group">
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

        {/* 2. ORTADAKİ MENÜ: Çizimdeki Dairesel Logo Menü Butonu */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label="Menüyü Aç"
            className={"group relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none " + (
              isMenuOpen 
                ? "ring-2 ring-[#FF5A4D] shadow-[0_0_35px_rgba(255,90,77,0.8)]" 
                : "shadow-[0_0_25px_rgba(139,108,255,0.4)] hover:shadow-[0_0_35px_rgba(255,90,77,0.7)]"
            )}
            title="Menüyü Aç"
          >
            {/* Dış Çember */}
            <div className={"absolute inset-0 rounded-full border transition-all duration-500 " + (
              theme === 'dark'
                ? "border-white/25 group-hover:border-[#FF5A4D]"
                : "border-[#E3E6EB] group-hover:border-[#FF5A4D]"
            )} />

            {/* İç Dairesel Amblem */}
            <div className={"w-9 h-9 rounded-full flex items-center justify-center p-1.5 transition-transform duration-500 group-hover:rotate-45 " + (
              theme === 'dark' 
                ? "bg-gradient-to-tr from-[#1B0E33] to-[#2D1654] border border-white/25 shadow-inner" 
                : "bg-gradient-to-tr from-[#1A1D24] to-[#2A2E39] text-white"
            )}>
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                <path d="M 78 28 A 36 36 0 1 0 78 72" stroke="#FFFFFF" strokeWidth="16" />
                <circle cx="78" cy="28" r="8" fill="#5B3FD9" />
                <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
                <circle cx="45" cy="40" r="10" fill="#FFFFFF" />
                <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="#FFFFFF" />
              </svg>
            </div>

            {/* Arka plan ışık aurası */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FF5A4D]/30 to-[#8B6CFF]/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          </button>
          
          {/* Ortadaki logonun altına küçük menü yazısı */}
          <span className={"text-[10px] font-bold tracking-widest uppercase mt-1 select-none pointer-events-none transition-colors " + (
            theme === 'dark' ? "text-white/45" : "text-[#68707D]"
          )}>
            Menü
          </span>
        </div>

        {/* 3. SAĞ ÜST: Mod Değiştirme Tuşu + Profil Kısmı */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Mod Değiştirme Tuşu (Tema / Tutulma Butonu) */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Aydınlık / Karanlık Mod"
            title={theme === 'dark' ? "Aydınlık Moda Geç" : "Karanlık Moda Geç"}
            className={"w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 " + (
              theme === 'dark' 
                ? "bg-white/[0.04] border-white/10 text-amber-300 hover:border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]" 
                : "bg-white border-[#E3E6EB] text-[#1A1D24] hover:border-[#5B3FD9]/40 shadow-xs"
            )}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Profil Kısmı (Avatar) */}
          <div 
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF5A4D] to-[#5B3FD9] p-[1.5px] cursor-pointer hover:scale-105 active:scale-95 transition-transform" 
            title="Öğrenci Profili"
          >
            <div className={"w-full h-full rounded-full flex items-center justify-center font-bold text-xs " + (
              theme === 'dark' ? "bg-[#090514] text-white" : "bg-white text-[#1A1D24]"
            )}>
              AK
            </div>
          </div>

        </div>
      </header>

      {/* =========================================================================
          TAM EKRAN MENÜ (FULLSCREEN OVERLAY MENU)
          Tetiklendiğinde (Sağ üst hamburger veya ortadaki logo) tüm ekranı kaplar.
          ========================================================================= */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 w-screen h-screen z-50 overflow-hidden animate-overlay-in flex flex-col justify-between"
          style={{
            backgroundColor: theme === 'dark' ? 'rgba(7, 4, 15, 0.97)' : 'rgba(233, 227, 222, 0.98)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
          }}
        >
          
          {/* Arka Plan Atmosferik Aura Parıltıları */}
          <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[50rem] h-[25rem] bg-gradient-to-b from-[#8B6CFF]/20 via-[#FF5A4D]/10 to-transparent blur-[140px] rounded-full" />
            <div className="absolute bottom-10 left-10 w-[35rem] h-[35rem] bg-[#6366F1]/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-10 right-10 w-[35rem] h-[35rem] bg-[#FF5A4D]/15 blur-[150px] rounded-full" />
          </div>

          {/* 1. ÜST KISIM / KAPATMA BUTONU: Dairesel 'X' Butonu */}
          <div className="relative w-full pt-8 sm:pt-10 px-6 sm:px-12 flex items-center justify-between z-20">
            {/* Sol üst marka kimliği */}
            <div className="flex items-center gap-2.5 opacity-80">
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-1">
                <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
                  <path d="M 78 28 A 36 36 0 1 0 78 72" stroke={theme === 'dark' ? "#FFFFFF" : "#1A1D24"} strokeWidth="16" />
                  <circle cx="78" cy="28" r="8" fill="#5B3FD9" />
                  <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
                </svg>
              </div>
              <span className={"text-sm font-black tracking-widest font-sans " + (theme === 'dark' ? "text-white" : "text-[#1A1D24]")}>
                OLTVIΛ
              </span>
            </div>

            {/* Dairesel Kapatma 'X' Butonu (Merkeze yakın / üst sağ-orta alan) */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Menüyü Kapat"
              title="Kapat (ESC)"
              className={"group w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-95 shadow-[0_0_25px_rgba(0,0,0,0.5)] " + (
                theme === 'dark'
                  ? "bg-white/[0.05] border-white/15 text-white/80 hover:text-white hover:border-[#FF5A4D] hover:bg-white/[0.1]"
                  : "bg-white border-[#E3E6EB] text-[#1A1D24] hover:text-[#FF5A4D] hover:border-[#FF5A4D] shadow-sm"
              )}
            >
              <X size={20} className="group-hover:text-[#FF5A4D] transition-colors" />
            </button>
          </div>

          {/* 2. MERKEZ İÇERİK (MAIN NAVIGATION):
                 Büyük puntolu ana menü linkleri (Heading tipografisi, dikey ortalanmış, stagger animasyonlu)
                 Hemen altında yatay sub-navigation linkleri
          */}
          <div className="my-auto px-6 py-6 flex flex-col items-center justify-center text-center z-10 max-w-4xl mx-auto w-full">
            
            {/* Ana Menü Linkleri */}
            <nav className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 w-full">
              {mainNavLinks.map((link, idx) => (
                <div 
                  key={link.title}
                  className="animate-menu-item overflow-hidden"
                  style={{ animationDelay: `${idx * 60 + 80}ms` }}
                >
                  <a
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={"group block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif tracking-wide transition-all duration-300 hover:scale-105 active:scale-98 select-none " + (
                      theme === 'dark' 
                        ? "text-[#E2E8F0]/90 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#FF7A50] hover:via-[#FF5A4D] hover:to-[#C084FC]" 
                        : "text-[#1A1D24] hover:text-[#5B3FD9]"
                    )}
                  >
                    <span className="relative inline-block transition-transform duration-300 group-hover:translate-x-1">
                      {link.title}
                    </span>
                  </a>
                </div>
              ))}
            </nav>

            {/* Alt Linkler (Sub-navigation):
                Ana linklerin hemen altında, daha küçük puntolu (Body text), yatay dizilmiş
            */}
            <div 
              className={"mt-10 sm:mt-12 pt-6 border-t flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm font-sans animate-sub-item " + (
                theme === 'dark' ? "border-white/[0.08]" : "border-[#E3E6EB]"
              )}
              style={{ animationDelay: `${mainNavLinks.length * 60 + 150}ms` }}
            >
              {subNavLinks.map((sub, idx) => (
                <div key={sub.title} className="flex items-center gap-6 sm:gap-8">
                  {sub.external ? (
                    <a
                      href={sub.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={"transition-colors duration-200 flex items-center gap-1 hover:scale-105 " + (
                        theme === 'dark' ? "text-white/45 hover:text-white" : "text-[#68707D] hover:text-[#1A1D24]"
                      )}
                    >
                      <span>{sub.title}</span>
                      <ArrowUpRight size={13} className="opacity-60" />
                    </a>
                  ) : (
                    <Link
                      href={sub.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={"transition-colors duration-200 hover:scale-105 flex items-center gap-1.5 " + (
                        sub.isLogout 
                          ? "text-[#FF5A4D] hover:text-[#FF5A4D]/80 font-semibold" 
                          : (theme === 'dark' ? "text-white/45 hover:text-white" : "text-[#68707D] hover:text-[#1A1D24]")
                      )}
                    >
                      {sub.isLogout && <LogOut size={13} />}
                      <span>{sub.title}</span>
                    </Link>
                  )}
                  {idx < subNavLinks.length - 1 && (
                    <span className={(theme === 'dark' ? "text-white/20" : "text-[#68707D]/30") + " select-none hidden sm:inline"}>•</span>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* 3. ALT ŞERİT (BOTTOM BAR):
                 Ekranın en alt kısmına sabitlenmiş, sol tarafta logo, sağ tarafa doğru uzanan yatay footer bar
          */}
          <footer className={"w-full h-16 sm:h-20 px-6 sm:px-12 flex items-center justify-between border-t transition-colors z-20 " + (
            theme === 'dark' 
              ? "border-white/[0.08] bg-[#06030E]/85 backdrop-blur-md text-white/50" 
              : "border-[#E3E6EB] bg-white/95 backdrop-blur-md text-[#68707D]"
          )}>
            
            {/* Sol: Logo ve İsim */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
                  <path d="M 78 28 A 36 36 0 1 0 78 72" stroke="currentColor" strokeWidth="16" />
                  <circle cx="78" cy="28" r="8" fill="#5B3FD9" />
                  <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
                </svg>
              </div>
              <span className={"text-sm font-black tracking-widest font-sans " + (theme === 'dark' ? "text-white/80" : "text-[#1A1D24]")}>
                OLTVIΛ
              </span>
              <span className={"hidden md:inline text-xs font-serif italic pl-2 border-l " + (theme === 'dark' ? "text-white/30 border-white/10" : "text-[#68707D]/60 border-[#E3E6EB]")}>
                Beyond What You Know
              </span>
            </div>

            {/* Sağ: Telif ve Güvenlik Göstergesi */}
            <div className="flex items-center gap-6 text-[11px] sm:text-xs">
              <span className="flex items-center gap-1.5 text-emerald-500 font-medium hidden sm:inline-flex">
                <ShieldCheck size={14} /> KVKK & GDPR Uyumlu
              </span>
              <span className={theme === 'dark' ? "text-white/40" : "text-[#68707D]"}>
                © {new Date().getFullYear()} OLTVIA Inc.
              </span>
            </div>

          </footer>

        </div>
      )}

      {/* Ana Sayfa Tuvali (Temiz) */}
      <main className="w-full h-screen" />

    </div>
  );
}
