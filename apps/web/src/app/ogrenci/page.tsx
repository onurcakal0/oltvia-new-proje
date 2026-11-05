"use client";
import React, { useEffect, useState } from 'react';
import OltviaStudentSidebar, { SidebarTheme } from '../../components/OltviaStudentSidebar';

/**
 * Öğrenci paneli: şimdilik yalnızca yüzen Liquid Glass menüye odaklanıyor.
 * Sayfanın geri kalanı bilinçli olarak boş bırakıldı.
 */
export default function OgrenciPage() {
  const [theme, setTheme] = useState<SidebarTheme>('light');

  useEffect(() => {
    const saved = localStorage.getItem('oltvia-theme');
    if (saved === 'light' || saved === 'dark') setTheme(saved);
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
      className="relative w-full h-screen overflow-hidden font-sans antialiased"
      style={{ backgroundColor: isDark ? '#0D0F14' : '#E9E3DE' }}
    >
      {/* Cam efektinin görünmesi için çok hafif atmosfer ışıkları */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute -top-40 left-1/3 w-[42rem] h-[42rem] rounded-full blur-[140px]"
          style={{ backgroundColor: 'rgba(91, 63, 217, ' + (isDark ? '0.16' : '0.10') + ')' }}
        />
        <div
          className="absolute -bottom-48 right-0 w-[40rem] h-[40rem] rounded-full blur-[150px]"
          style={{ backgroundColor: 'rgba(255, 90, 77, ' + (isDark ? '0.12' : '0.10') + ')' }}
        />
      </div>

      <OltviaStudentSidebar theme={theme} onThemeChange={handleThemeChange} />
    </div>
  );
}
