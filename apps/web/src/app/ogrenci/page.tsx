"use client";
import React, { useEffect, useState } from 'react';
import OltviaStudentSidebar, { SidebarTheme } from '../../components/OltviaStudentSidebar';
import OltviaStudentHeader from '../../components/OltviaStudentHeader';

/**
 * Öğrenci Paneli Ana Sayfası:
 * - Üst Header: Shimmering OLTVIΛ logosu, Liquid Glass Arama Çubuğu, Eclipse Tema Butonu, Yuvarlak Bildirimler ve AK Profil Kapsülü
 * - Yan Menü: Liquid Glass dikey sidebar
 */
export default function OgrenciPage() {
  const [theme, setTheme] = useState<SidebarTheme>('light');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('oltvia-theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      document.documentElement.classList.toggle('dark', saved === 'dark');
      document.documentElement.classList.toggle('light', saved === 'light');
    }
  }, []);

  const handleThemeChange = (next: SidebarTheme) => {
    setTheme(next);
    localStorage.setItem('oltvia-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    document.documentElement.classList.toggle('light', next === 'light');
  };

  const isDark = theme === 'dark';

  return (
    <div
      className="relative w-full h-screen overflow-hidden font-sans antialiased transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#0D0F14' : '#E9E3DE' }}
    >
      {/* Cam ve liquid glass efektinin derinlik kazanması için atmosfer ışıkları */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -top-40 left-1/3 w-[42rem] h-[42rem] rounded-full blur-[140px] transition-opacity duration-500"
          style={{ backgroundColor: 'rgba(91, 63, 217, ' + (isDark ? '0.16' : '0.10') + ')' }}
        />
        <div
          className="absolute -bottom-48 right-0 w-[40rem] h-[40rem] rounded-full blur-[150px] transition-opacity duration-500"
          style={{ backgroundColor: 'rgba(255, 90, 77, ' + (isDark ? '0.12' : '0.10') + ')' }}
        />
      </div>

      {/* Üst Header Bar */}
      <OltviaStudentHeader
        theme={theme}
        onThemeChange={handleThemeChange}
        isExpanded={isExpanded}
      />

      {/* Sol Yüzen Menü Sidebar */}
      <OltviaStudentSidebar
        theme={theme}
        onThemeChange={handleThemeChange}
        isExpanded={isExpanded}
        onExpandChange={setIsExpanded}
      />
    </div>
  );
}
