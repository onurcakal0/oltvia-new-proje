"use client";
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { SidebarTheme } from './OltviaStudentSidebar';

interface OltviaStudentHeaderProps {
  theme: SidebarTheme;
  onThemeChange?: (theme: SidebarTheme) => void;
  isExpanded?: boolean;
}

export default function OltviaStudentHeader({
  theme,
  onThemeChange,
  isExpanded = false,
}: OltviaStudentHeaderProps) {
  const isDark = theme === 'dark';
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [hasNotifications, setHasNotifications] = useState(true);

  // ⌘K veya Ctrl+K kısayolu ile arama çubuğuna odaklanma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    if (onThemeChange) onThemeChange(next);
  };

  return (
    <header
      className="fixed top-[31px] left-0 right-0 h-11 z-50 pointer-events-none select-none flex items-center justify-between px-3 md:px-5"
    >
      {/* Sol taraf: Menü logosu ve OLTVIΛ yazısı OltviaStudentSidebar içindedir */}
      <div className="w-12 shrink-0 pointer-events-none" />

      {/* ───────── ORTA: Liquid Glass Arama Çubuğu (Logo ile Kusursuz Hizada) ───────── */}
      <div className="pointer-events-auto absolute left-1/2 top-0 -translate-x-1/2 h-full flex items-center justify-center w-full max-w-[340px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[600px] px-2">
        <div
          className="relative w-full h-11 rounded-full flex items-center px-4 gap-3 transition-all duration-200 group"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.74) 0%, rgba(255,255,255,0.40) 100%)',
            border: isDark
              ? '1px solid rgba(255,255,255,0.14)'
              : '1px solid rgba(255,255,255,0.85)',
            boxShadow: isDark
              ? '0 8px 30px -8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 0 16px rgba(255,255,255,0.03)'
              : '0 8px 30px -8px rgba(26,29,36,0.08), inset 0 1px 0 rgba(255,255,255,1), inset 0 0 16px rgba(255,255,255,0.4)',
            backdropFilter: 'blur(28px) saturate(190%)',
            WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          }}
        >
          <Search
            size={17}
            strokeWidth={2.2}
            className="shrink-0 transition-colors duration-150"
            style={{
              color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(26,29,36,0.55)',
            }}
          />

          <input
            ref={inputRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Ders, konu, ödev veya soru ara..."
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-medium tracking-tight placeholder:transition-opacity"
            style={{
              color: isDark ? '#F3F5F8' : '#1A1D24',
            }}
          />

          <div
            className="shrink-0 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider select-none"
            style={{
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,29,36,0.06)',
              color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(26,29,36,0.6)',
              border: isDark
                ? '1px solid rgba(255,255,255,0.12)'
                : '1px solid rgba(26,29,36,0.08)',
            }}
          >
            <span className="text-[10px]">⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* ───────── SAĞ: Eclipse Butonu + Yuvarlak Bildirimler + Profil ───────── */}
      <div className="pointer-events-auto h-full flex items-center gap-2.5 shrink-0 pr-1">
        {/* 1. Yaratıcı Eclipse (Güneş & Ay Tutulması) Butonu */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Aydınlık Moda Geç (Güneş)' : 'Karanlık Moda Geç (Güneş Tutulması)'}
          title={isDark ? 'Aydınlık Moda Geç' : 'Karanlık Moda Geç (Tutulma)'}
          className={
            'relative w-11 h-11 rounded-full border transition-all duration-300 hover:scale-105 flex items-center justify-center overflow-hidden ' +
            (isDark
              ? 'bg-[#140B25]/85 border-white/15 hover:border-[#FF5A4D]/50 text-[#E2E8F0] shadow-[0_0_15px_rgba(255,90,77,0.15)]'
              : 'bg-white/80 border-white hover:border-[#F59E0B]/60 text-[#1A1D24] shadow-sm hover:shadow-md')
          }
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <div className="relative w-6 h-6 flex items-center justify-center pointer-events-none">
            {/* Güneş Işınları */}
            <div
              className={
                'absolute inset-0 transition-all duration-500 ' +
                (!isDark ? 'opacity-100 scale-100 rotate-45' : 'opacity-0 scale-50 rotate-0')
              }
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <span
                  key={deg}
                  style={{ transform: 'rotate(' + deg + 'deg) translateY(-9px)' }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-1.5 rounded-full bg-amber-500"
                />
              ))}
            </div>

            {/* Güneş Çemberi */}
            <div
              className={
                'w-4 h-4 rounded-full transition-all duration-500 relative z-10 ' +
                (isDark
                  ? 'bg-gradient-to-tr from-[#FF5A4D] to-[#8B6CFF] shadow-[0_0_12px_rgba(255,90,77,0.8)]'
                  : 'bg-gradient-to-tr from-amber-400 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.9)]')
              }
            >
              {isDark && (
                <span className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#fff]" />
              )}
            </div>

            {/* Siyah Ay Diski */}
            <div
              className={
                'absolute w-4 h-4 rounded-full z-20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ' +
                (isDark
                  ? 'translate-x-0 bg-[#080411] border border-[#FF5A4D]/50 shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.2)]'
                  : 'translate-x-6 opacity-0 bg-[#1A1D24]')
              }
            />
          </div>
        </button>

        {/* 2. Yuvarlak Bildirimler Butonu (Liquid Glass) */}
        <button
          type="button"
          onClick={() => setHasNotifications(false)}
          aria-label="Bildirimler"
          title="Bildirimler"
          className="relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.05) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.42) 100%)',
            border: isDark
              ? '1px solid rgba(255,255,255,0.16)'
              : '1px solid rgba(255,255,255,0.85)',
            boxShadow: isDark
              ? '0 6px 20px -6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)'
              : '0 6px 20px -6px rgba(26,29,36,0.1), inset 0 1px 0 rgba(255,255,255,1)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            color: isDark ? '#F3F5F8' : '#1A1D24',
          }}
        >
          <Bell size={19} strokeWidth={2.1} />

          {/* Mercan Işıklı Bildirim Noktası */}
          {hasNotifications && (
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5A4D] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5A4D] shadow-[0_0_8px_#FF5A4D]" />
            </span>
          )}
        </button>

        {/* 3. Profil Kapsülü (Arda Kılıç - AK Avatar) */}
        <div
          className="flex items-center gap-2.5 h-11 pl-1.5 pr-3.5 rounded-full cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] select-none"
          title="Profil ve Hesap Ayarları"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.05) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.42) 100%)',
            border: isDark
              ? '1px solid rgba(255,255,255,0.16)'
              : '1px solid rgba(255,255,255,0.85)',
            boxShadow: isDark
              ? '0 6px 20px -6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)'
              : '0 6px 20px -6px rgba(26,29,36,0.1), inset 0 1px 0 rgba(255,255,255,1)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          }}
        >
          {/* Avatar (AK) + Çevrimiçi Göstergesi */}
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs tracking-tight"
              style={{
                backgroundColor: isDark ? '#14171F' : '#1A1D24',
                color: '#FFFFFF',
                boxShadow: isDark
                  ? '0 0 0 1px rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.4)'
                  : '0 2px 6px rgba(26,29,36,0.25)',
              }}
            >
              AK
            </div>
            {/* Çevrimiçi yeşil nokta */}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"
              style={{
                boxShadow: isDark ? '0 0 0 1.5px #0D0F14' : '0 0 0 1.5px #FFFFFF',
              }}
            />
          </div>

          {/* İsim ve Sınıf Bilgisi */}
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span
              className="text-[13px] font-bold tracking-tight"
              style={{ color: isDark ? '#F3F5F8' : '#1A1D24' }}
            >
              Arda Kılıç
            </span>
            <span
              className="text-[10.5px] font-medium"
              style={{ color: isDark ? 'rgba(243,245,248,0.55)' : 'rgba(26,29,36,0.55)' }}
            >
              12-A • Sayısal
            </span>
          </div>

          <ChevronDown
            size={14}
            strokeWidth={2.4}
            className="transition-transform duration-200"
            style={{
              color: isDark ? 'rgba(243,245,248,0.5)' : 'rgba(26,29,36,0.5)',
            }}
          />
        </div>
      </div>
    </header>
  );
}
