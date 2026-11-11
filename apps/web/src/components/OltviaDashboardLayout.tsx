"use client";
import React, { useEffect, useState } from 'react';
import OltviaStudentSidebar, { PortalRole, SidebarTheme } from './OltviaStudentSidebar';
import OltviaStudentHeader from './OltviaStudentHeader';
import OltviaStudentDashboardView from './OltviaStudentDashboardView';

interface OltviaDashboardLayoutProps {
  role: PortalRole;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  children?: React.ReactNode;
}

export default function OltviaDashboardLayout({
  role,
  activeTab: controlledActiveTab,
  onTabChange,
  children,
}: OltviaDashboardLayoutProps) {
  const [theme, setTheme] = useState<SidebarTheme>('light');
  const [isExpanded, setIsExpanded] = useState(false);
  const [internalActiveTab, setInternalActiveTab] = useState('ana-sayfa');

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const handleTabChange = (next: string) => {
    if (onTabChange) onTabChange(next);
    else setInternalActiveTab(next);
  };

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
        role={role}
      />

      {/* Sol Yüzen Menü Sidebar */}
      <OltviaStudentSidebar
        theme={theme}
        onThemeChange={handleThemeChange}
        isExpanded={isExpanded}
        onExpandChange={setIsExpanded}
        role={role}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {children ? (
        <main className="relative z-10 w-full h-full pt-20 pl-24 pr-6 pb-6 overflow-y-auto">
          {children}
        </main>
      ) : role === 'ogrenci' ? (
        <OltviaStudentDashboardView
          activeTab={activeTab}
          theme={theme}
          isExpanded={isExpanded}
        />
      ) : null}
    </div>
  );
}
