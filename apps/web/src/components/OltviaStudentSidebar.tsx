"use client";
import React, { useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  HeartHandshake,
  Home,
  LucideIcon,
  School,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';

export type SidebarTheme = 'light' | 'dark';
export type PortalRole = 'ogrenci' | 'ogretmen' | 'veli' | 'yonetim' | 'idare';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge: string | null;
  isOltvia?: boolean;
}

export interface RoleConfig {
  badge: string;
  userName: string;
  userSubtitle: string;
  userInitials: string;
  searchPlaceholder: string;
  navItems: NavItem[];
}

export const ROLE_CONFIGS: Record<'ogrenci' | 'ogretmen' | 'veli' | 'yonetim', RoleConfig> = {
  ogrenci: {
    badge: 'STUDENT',
    userName: 'Arda Kılıç',
    userSubtitle: '12-A • Sayısal',
    userInitials: 'AK',
    searchPlaceholder: 'Ders, konu, ödev veya soru ara...',
    navItems: [
      { id: 'ana-sayfa', label: 'Ana Sayfa', icon: Home, badge: null },
      { id: 'ders-programi', label: 'Ders Programı', icon: CalendarDays, badge: null },
      { id: 'gunluk-ilerleme', label: 'Günlük İlerleme Durumu', icon: TrendingUp, badge: null },
      { id: 'gorevler-odevler', label: 'Görevler & Ödevler', icon: CheckSquare, badge: null },
      { id: 'oltvia', label: 'OLTVIA', icon: Sparkles, badge: null, isOltvia: true },
      { id: 'sinav-sonuclari', label: 'Sınav Sonuçları', icon: GraduationCap, badge: null },
      { id: 'yks-not-analizi', label: 'YKS Not Analizi', icon: BarChart3, badge: null },
      { id: 'detayli-rapor', label: 'Detaylı Rapor', icon: FileText, badge: null },
      { id: 'okulum', label: 'Okulum', icon: School, badge: null },
      { id: 'ogretmenler', label: 'Öğretmenler', icon: Users, badge: null },
      { id: 'rehberlik-pdr', label: 'Rehberlik & PDR', icon: HeartHandshake, badge: null },
    ],
  },
  ogretmen: {
    badge: 'TEACHER',
    userName: 'Burak Aksoy',
    userSubtitle: 'Matematik Zümre Bşk.',
    userInitials: 'BA',
    searchPlaceholder: 'Öğrenci, sınıf, sınav veya ödev ara...',
    navItems: [
      { id: 'ana-sayfa', label: 'Ana Sayfa', icon: Home, badge: null },
      { id: 'ders-programi', label: 'Ders Programı', icon: CalendarDays, badge: null },
      { id: 'siniflarim', label: 'Sınıflarım & Öğrenciler', icon: Users, badge: null },
      { id: 'odev-takip', label: 'Ödev & Görev Takibi', icon: CheckSquare, badge: null },
      { id: 'oltvia', label: 'OLTVIA', icon: Sparkles, badge: null, isOltvia: true },
      { id: 'sinav-degerlendirme', label: 'Sınav Değerlendirme', icon: GraduationCap, badge: null },
      { id: 'kazanim-analizi', label: 'Başarı & Kazanım Analizi', icon: BarChart3, badge: null },
      { id: 'sinif-raporu', label: 'Detaylı Sınıf Raporu', icon: FileText, badge: null },
      { id: 'zumre-mufredat', label: 'Zümre & Müfredat', icon: School, badge: null },
      { id: 'veli-gorusmeleri', label: 'Veli Görüşmeleri', icon: HeartHandshake, badge: null },
      { id: 'rehberlik-pdr', label: 'Rehberlik & PDR', icon: TrendingUp, badge: null },
    ],
  },
  veli: {
    badge: 'PARENT',
    userName: 'Mehmet Kılıç',
    userSubtitle: 'Veli • Arda Kılıç (12-A)',
    userInitials: 'MK',
    searchPlaceholder: 'Gelişim raporu, devamsızlık veya ödev ara...',
    navItems: [
      { id: 'ana-sayfa', label: 'Ana Sayfa', icon: Home, badge: null },
      { id: 'haftalik-program', label: 'Haftalık Ders Programı', icon: CalendarDays, badge: null },
      { id: 'gunluk-takip', label: 'Günlük İlerleme & Takip', icon: TrendingUp, badge: null },
      { id: 'odev-durumu', label: 'Ödev & Proje Durumu', icon: CheckSquare, badge: null },
      { id: 'oltvia', label: 'OLTVIA', icon: Sparkles, badge: null, isOltvia: true },
      { id: 'sinav-sonuclari', label: 'Sınav & Deneme Sonuçları', icon: GraduationCap, badge: null },
      { id: 'gelisim-analizi', label: 'Akademik Gelişim Analizi', icon: BarChart3, badge: null },
      { id: 'detayli-karne', label: 'Detaylı Gelişim Raporu', icon: FileText, badge: null },
      { id: 'devamsizlik', label: 'Devamsızlık Durumu', icon: CalendarDays, badge: null },
      { id: 'ogretmen-iletisim', label: 'Öğretmen İletişim', icon: Users, badge: null },
      { id: 'rehberlik-pdr', label: 'Rehberlik & PDR', icon: HeartHandshake, badge: null },
    ],
  },
  yonetim: {
    badge: 'ADMIN',
    userName: 'Kemal Demir',
    userSubtitle: 'Okul Müdürü • Fen Lisesi',
    userInitials: 'KD',
    searchPlaceholder: 'Öğrenci, öğretmen, sınıf veya kurumsal rapor ara...',
    navItems: [
      { id: 'ana-sayfa', label: 'Ana Sayfa', icon: Home, badge: null },
      { id: 'kurumsal-genel-bakis', label: 'Kurumsal Genel Bakış', icon: BarChart3, badge: null },
      { id: 'siniflar-subeler', label: 'Sınıflar & Şubeler', icon: School, badge: null },
      { id: 'akademik-performans', label: 'Akademik Performans', icon: TrendingUp, badge: null },
      { id: 'oltvia', label: 'OLTVIA', icon: Sparkles, badge: null, isOltvia: true },
      { id: 'deneme-istatistikleri', label: 'Deneme & Sınav İstatistikleri', icon: GraduationCap, badge: null },
      { id: 'ogretmen-zumre-takip', label: 'Öğretmen & Zümre Takibi', icon: Users, badge: null },
      { id: 'kurumsal-rapor', label: 'Detaylı Kurumsal Rapor', icon: FileText, badge: null },
      { id: 'devamsizlik-disiplin', label: 'Devamsızlık & Disiplin', icon: CalendarDays, badge: null },
      { id: 'pdr-yonetimi', label: 'Rehberlik & PDR Yönetimi', icon: HeartHandshake, badge: null },
      { id: 'idari-islemler', label: 'İdari İşlemler & Görevler', icon: CheckSquare, badge: null },
    ],
  },
};

interface OltviaStudentSidebarProps {
  theme: SidebarTheme;
  onThemeChange?: (theme: SidebarTheme) => void;
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  role?: PortalRole;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const PURPLE = '#5B3FD9';
const CORAL = '#FF5A4D';

/** OLTVIA yuvarlak amblem (koyu daire veya cam üzerinde O/C + mor & mercan noktalar) */
function OltviaEmblem({
  size = 22,
  isDark = true,
}: {
  size?: number;
  isDark?: boolean;
}) {
  const ink = isDark ? '#FFFFFF' : '#1A1D24';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path d="M 78 28 A 36 36 0 1 0 78 72" stroke={ink} strokeWidth="15" />
      <circle cx="78" cy="28" r="8.5" fill={PURPLE} />
      <circle cx="78" cy="72" r="8.5" fill={CORAL} />
      <circle cx="45" cy="40" r="10" fill={ink} />
      <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill={ink} />
    </svg>
  );
}

export default function OltviaStudentSidebar({
  theme,
  isExpanded: controlledExpanded,
  onExpandChange,
  role = 'ogrenci',
  activeTab: controlledActiveTab,
  onTabChange,
}: OltviaStudentSidebarProps) {
  const roleKey: 'ogrenci' | 'ogretmen' | 'veli' | 'yonetim' =
    role === 'idare' ? 'yonetim' : (role || 'ogrenci');
  const roleConfig = ROLE_CONFIGS[roleKey] || ROLE_CONFIGS.ogrenci;
  const navItems = roleConfig.navItems;

  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const toggleExpanded = () => {
    const next = !isExpanded;
    if (onExpandChange) onExpandChange(next);
    else setInternalExpanded(next);
  };
  const isDark = theme === 'dark';

  const [internalActiveTab, setInternalActiveTab] = useState('ana-sayfa');
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const selectTab = (id: string) => {
    if (onTabChange) onTabChange(id);
    else setInternalActiveTab(id);
  };
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [viewportH, setViewportH] = useState(900);
  const [isAiMode, setIsAiMode] = useState(false);

  // OLTVIΛ <-> OLTVΛI geçişi: sakin, acele etmeyen ve akıcı bir döngü
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const runCycle = () => {
      // 5.5 saniye boyunca OLTVIΛ olarak kalır
      timeoutId = setTimeout(() => {
        setIsAiMode(true);
        // 3.6 saniye boyunca OLTVΛI olarak kalır, sonra geri döner
        timeoutId = setTimeout(() => {
          setIsAiMode(false);
          runCycle();
        }, 3600);
      }, 5500);
    };

    runCycle();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const update = () => setViewportH(window.innerHeight);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // 12 öğeli menünün ekrana rahatça sığması için dikey boyuta göre satır yüksekliği
  const compact = viewportH < 860;
  const rowH = compact ? 33 : 37;

  // Liquid glass: yarı saydam, tek renk yok; vurgu yalnızca beyaz/mürekkep tonları
  const t = isDark
    ? {
        surface: 'linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 55%, rgba(255,255,255,0.09) 100%)',
        edge: '1px solid rgba(255,255,255,0.18)',
        text: '#F3F5F8',
        sub: 'rgba(243,245,248,0.62)',
        divider: 'rgba(255,255,255,0.10)',
        card: 'rgba(255,255,255,0.06)',
        cardBorder: 'rgba(255,255,255,0.12)',
        pill: 'rgba(255,255,255,0.12)',
        pillBorder: 'rgba(255,255,255,0.22)',
        chip: 'rgba(255,255,255,0.14)',
        chipText: '#F3F5F8',
        ink: 'rgba(255,255,255,0.92)',
        inkText: '#14171F',
        ring: 'rgba(255,255,255,0.25)',
        shadow:
          '0 30px 80px -16px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(255,255,255,0.06), inset 0 0 24px rgba(255,255,255,0.04)',
      }
    : {
        surface: 'linear-gradient(145deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.28) 55%, rgba(255,255,255,0.46) 100%)',
        edge: '1px solid rgba(255,255,255,0.75)',
        text: '#1A1D24',
        sub: 'rgba(26,29,36,0.58)',
        divider: 'rgba(26,29,36,0.08)',
        card: 'rgba(255,255,255,0.40)',
        cardBorder: 'rgba(255,255,255,0.7)',
        pill: 'rgba(255,255,255,0.62)',
        pillBorder: 'rgba(255,255,255,0.9)',
        chip: 'rgba(26,29,36,0.08)',
        chipText: '#1A1D24',
        ink: '#1A1D24',
        inkText: '#FFFFFF',
        ring: 'rgba(255,255,255,0.9)',
        shadow:
          '0 30px 70px -18px rgba(26,29,36,0.22), 0 2px 8px rgba(26,29,36,0.06), inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(255,255,255,0.5), inset 0 0 24px rgba(255,255,255,0.35)',
      };

  return (
    // Sabit kapsayıcı: dikeyde ortalar, menü asla ekran dışına taşmaz
    <div
      style={{
        position: 'fixed',
        top: 12,
        bottom: 12,
        left: 12,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? 280 : 68 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="group select-none"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: 24,
          pointerEvents: 'auto',
          background: t.surface,
          border: t.edge,
          boxShadow: t.shadow,
          backdropFilter: 'blur(32px) saturate(190%) brightness(1.04)',
          WebkitBackdropFilter: 'blur(32px) saturate(190%) brightness(1.04)',
        }}
      >
        {/* Liquid glass speküler parlama */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: 24,
            background: `radial-gradient(120% 60% at 0% 0%, rgba(255,255,255,${isDark ? '0.16' : '0.55'}) 0%, transparent 55%), radial-gradient(90% 45% at 100% 100%, rgba(255,255,255,${isDark ? '0.08' : '0.30'}) 0%, transparent 60%)`,
          }}
        />

        {/* Kenar oku: sınırın üstüne gelince belirir */}
        <button
          type="button"
          onClick={toggleExpanded}
          aria-label={isExpanded ? 'Menüyü daralt' : 'Menüyü genişlet'}
          className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 focus:outline-none"
          style={{ backgroundColor: t.ink, color: t.inkText, boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}
        >
          {isExpanded ? <ChevronLeft size={14} strokeWidth={2.6} /> : <ChevronRight size={14} strokeWidth={2.6} />}
        </button>

        {/* ───────── 1. HEADER: OLTVIA logosu + Sabit OLTVIΛ Yazısı ───────── */}
        <div className="shrink-0 px-2 pt-[18px] pb-1">
          <button
            type="button"
            onClick={toggleExpanded}
            aria-label="OLTVIA - menüyü aç / kapat"
            title="OLTVIA"
            className="flex items-center rounded-2xl py-0 pl-[5px] focus:outline-none select-none"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 relative z-10"
              style={{
                backgroundColor: isDark ? 'rgba(14,16,22,0.85)' : '#1A1D24',
                boxShadow: isDark
                  ? '0 0 0 1px rgba(255,255,255,0.18), 0 6px 16px rgba(0,0,0,0.4)'
                  : '0 6px 16px rgba(26,29,36,0.25)',
              }}
            >
              <OltviaEmblem size={23} />
            </motion.div>

            {/* Logonun yanına kilitlenmiş, açılıp kapanırken mesafesini koruyan OLTVIΛ yazısı ve STUDENT rozeti */}
            <motion.div
              initial={false}
              animate={{ marginLeft: isExpanded ? 12 : 24 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="flex items-center gap-2.5 whitespace-nowrap"
            >
              <span
                className="animate-text-shimmer font-black text-[21px] tracking-[0.20em] font-sans inline-block cursor-default leading-none"
                style={{
                  backgroundImage: isDark
                    ? 'linear-gradient(90deg, rgba(255,255,255,0.40) 0%, rgba(255,255,255,0.40) 35%, rgba(255,255,255,1) 50%, rgba(196,181,253,0.95) 53%, rgba(255,255,255,1) 56%, rgba(255,255,255,0.40) 70%, rgba(255,255,255,0.40) 100%)'
                    : 'linear-gradient(90deg, rgba(26,29,36,0.42) 0%, rgba(26,29,36,0.42) 35%, rgba(26,29,36,1) 50%, rgba(91,63,217,0.95) 53%, rgba(26,29,36,1) 56%, rgba(26,29,36,0.42) 70%, rgba(26,29,36,0.42) 100%)',
                  backgroundSize: '380px 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: isDark
                    ? 'drop-shadow(0 0 16px rgba(255,255,255,0.18))'
                    : 'drop-shadow(0 1px 2px rgba(0,0,0,0.06))',
                }}
              >
                OLTVIΛ
              </span>

              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.85, x: -6 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.85, x: -6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[9.5px] font-extrabold uppercase tracking-[0.14em] px-2.5 py-0.5 rounded-full select-none"
                    style={{
                      backgroundColor: t.chip,
                      color: t.chipText,
                      border: isDark
                        ? '1px solid rgba(255,255,255,0.14)'
                        : '1px solid rgba(26,29,36,0.12)',
                    }}
                  >
                    {roleConfig.badge}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </button>
        </div>

        {/* ───────── ORTA: Menü Öğeleri Listesi (Kaydırılabilir) ───────── */}
        <div
          className="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: 'none',
          }}
        >
          {/* MENU Kategori Başlığı */}
          <div className="px-2 pt-1 pb-2 shrink-0">
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="pl-3 pb-1 text-[10px] font-bold uppercase tracking-[0.22em]"
                  style={{ color: t.sub }}
                >
                  Menu
                </motion.div>
              )}
            </AnimatePresence>

            <LayoutGroup id="oltvia-nav">
              <nav className="flex flex-col gap-0.5">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const highlighted = (hoveredTab ?? activeTab) === item.id;
                  const isHovered = hoveredTab === item.id;

                  return (
                    <div
                      key={item.id}
                      className="relative"
                      onMouseEnter={() => setHoveredTab(item.id)}
                      onMouseLeave={() => setHoveredTab(null)}
                    >
                      {/* 1. ÖZEL OLTVIA BUTONU: Minimal & Profesyonel Liquid Glass + OLTVIΛ <-> OLTVΛI Animasyonu */}
                      {item.isOltvia ? (
                        <button
                          type="button"
                          onClick={() => selectTab(item.id)}
                          className="relative w-full flex items-center rounded-xl pl-2 pr-2.5 focus:outline-none transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] group/oltvia"
                          style={{ height: rowH }}
                        >
                          {/* Minimal ve Profesyonel Nötr Sıvı Cam Arka Plan */}
                          <div
                            className="pointer-events-none absolute inset-0 rounded-xl transition-all duration-300"
                            style={{
                              background: isDark
                                ? highlighted
                                  ? 'linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 100%)'
                                  : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)'
                                : highlighted
                                  ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(246,247,250,0.90) 100%)'
                                  : 'linear-gradient(135deg, rgba(255,255,255,0.80) 0%, rgba(248,249,252,0.70) 100%)',
                              border: isDark
                                ? highlighted
                                  ? '1px solid rgba(255,255,255,0.22)'
                                  : '1px solid rgba(255,255,255,0.12)'
                                : highlighted
                                  ? '1px solid rgba(255,255,255,1)'
                                  : '1px solid rgba(255,255,255,0.85)',
                              boxShadow: isDark
                                ? highlighted
                                  ? '0 4px 18px -4px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.20)'
                                  : '0 2px 10px -2px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)'
                                : highlighted
                                  ? '0 4px 16px -2px rgba(26,29,36,0.08), inset 0 1px 0 rgba(255,255,255,1)'
                                  : '0 2px 8px -2px rgba(26,29,36,0.05), inset 0 1px 0 rgba(255,255,255,0.8)',
                              backdropFilter: 'blur(20px)',
                              WebkitBackdropFilter: 'blur(20px)',
                            }}
                          />

                          {/* Üst kenar boyunca zarif nötr sıvı cam parlaması */}
                          <div
                            className="pointer-events-none absolute inset-x-2 top-0 h-[1px]"
                            style={{
                              background: isDark
                                ? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.30) 50%, transparent 100%)'
                                : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 50%, transparent 100%)',
                            }}
                          />

                          {/* İkon: Oltvia Amblemi */}
                          <span className="relative z-10 w-9 flex items-center justify-center shrink-0">
                            <div className="relative flex items-center justify-center">
                              <OltviaEmblem size={20} isDark={isDark} />
                            </div>
                          </span>

                          {/* Başlık: OLTVIΛ <-> OLTVΛI (Sadece AI modunda ΛI harfleri mordur) */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.span
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.22, delay: 0.04 + index * 0.015 }}
                                className="relative z-10 flex-1 min-w-0 flex items-center ml-1"
                              >
                                <div className="flex items-center text-[13px] font-black tracking-[0.14em] font-sans select-none truncate">
                                  {/* Sabit OLTV kısmı: her zaman nötr */}
                                  <span
                                    className="animate-text-shimmer"
                                    style={{
                                      backgroundImage: isDark
                                        ? 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 35%, rgba(255,255,255,0.6) 50%, #FFFFFF 65%, #FFFFFF 100%)'
                                        : 'linear-gradient(90deg, #1A1D24 0%, #1A1D24 35%, #4B5563 50%, #1A1D24 65%, #1A1D24 100%)',
                                      backgroundSize: '250% 100%',
                                      WebkitBackgroundClip: 'text',
                                      WebkitTextFillColor: 'transparent',
                                    }}
                                  >
                                    OLTV
                                  </span>

                                  {/* I ve Λ harfleri yavaşça yer değiştirir: OLTVIΛ <-> OLTVΛI */}
                                  <span className="inline-flex items-center ml-[0.08em]">
                                    <LayoutGroup id="oltvia-swap-letters">
                                      {isAiMode ? (
                                        /* SADECE AI (ΛI) MODUNDA MOR OLAN HARFLER */
                                        <>
                                          <motion.span
                                            key="swap-a"
                                            layoutId="letter-a-swap"
                                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                            className="animate-text-shimmer inline-block"
                                            style={{
                                              backgroundImage: isDark
                                                ? 'linear-gradient(90deg, #C4B5FD 0%, #A78BFA 50%, #8B5CF6 100%)'
                                                : 'linear-gradient(90deg, #5B3FD9 0%, #7C5DFA 50%, #5B3FD9 100%)',
                                              backgroundSize: '200% 100%',
                                              WebkitBackgroundClip: 'text',
                                              WebkitTextFillColor: 'transparent',
                                            }}
                                          >
                                            Λ
                                          </motion.span>
                                          <motion.span
                                            key="swap-i"
                                            layoutId="letter-i-swap"
                                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                            className="animate-text-shimmer inline-block ml-[0.12em]"
                                            style={{
                                              backgroundImage: isDark
                                                ? 'linear-gradient(90deg, #C4B5FD 0%, #A78BFA 50%, #8B5CF6 100%)'
                                                : 'linear-gradient(90deg, #5B3FD9 0%, #7C5DFA 50%, #5B3FD9 100%)',
                                              backgroundSize: '200% 100%',
                                              WebkitBackgroundClip: 'text',
                                              WebkitTextFillColor: 'transparent',
                                            }}
                                          >
                                            I
                                          </motion.span>
                                        </>
                                      ) : (
                                        /* NORMAL MODDA HARFLER NÖTRDÜR (MOR DEĞİL) */
                                        <>
                                          <motion.span
                                            key="swap-i"
                                            layoutId="letter-i-swap"
                                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                            className="animate-text-shimmer inline-block"
                                            style={{
                                              backgroundImage: isDark
                                                ? 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 35%, rgba(255,255,255,0.6) 50%, #FFFFFF 65%, #FFFFFF 100%)'
                                                : 'linear-gradient(90deg, #1A1D24 0%, #1A1D24 35%, #4B5563 50%, #1A1D24 65%, #1A1D24 100%)',
                                              backgroundSize: '250% 100%',
                                              WebkitBackgroundClip: 'text',
                                              WebkitTextFillColor: 'transparent',
                                            }}
                                          >
                                            I
                                          </motion.span>
                                          <motion.span
                                            key="swap-a"
                                            layoutId="letter-a-swap"
                                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                            className="animate-text-shimmer inline-block ml-[0.12em]"
                                            style={{
                                              backgroundImage: isDark
                                                ? 'linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 35%, rgba(255,255,255,0.6) 50%, #FFFFFF 65%, #FFFFFF 100%)'
                                                : 'linear-gradient(90deg, #1A1D24 0%, #1A1D24 35%, #4B5563 50%, #1A1D24 65%, #1A1D24 100%)',
                                              backgroundSize: '250% 100%',
                                              WebkitBackgroundClip: 'text',
                                              WebkitTextFillColor: 'transparent',
                                            }}
                                          >
                                            Λ
                                          </motion.span>
                                        </>
                                      )}
                                    </LayoutGroup>
                                  </span>
                                </div>
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      ) : (
                        /* 2. STANDART MENÜ BUTONU (Liquid Glass) */
                        <button
                          type="button"
                          onClick={() => selectTab(item.id)}
                          className="relative w-full flex items-center rounded-xl pl-2 pr-2.5 focus:outline-none transition-colors duration-200"
                          style={{ height: rowH, color: highlighted ? t.text : t.sub }}
                        >
                          {highlighted && (
                            <motion.span
                              layoutId="activeNav"
                              className="absolute inset-0 rounded-xl"
                              style={{
                                backgroundColor: t.pill,
                                border: `1px solid ${t.pillBorder}`,
                                boxShadow: isDark
                                  ? 'inset 0 1px 0 rgba(255,255,255,0.18)'
                                  : '0 4px 14px rgba(26,29,36,0.06), inset 0 1px 0 rgba(255,255,255,1)',
                              }}
                              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                            />
                          )}

                          <span className="relative z-10 w-9 flex items-center justify-center shrink-0">
                            <Icon size={18} strokeWidth={highlighted ? 2.3 : 1.9} />
                          </span>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.span
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                transition={{ duration: 0.22, delay: 0.04 + index * 0.015 }}
                                className="relative z-10 flex-1 min-w-0 flex items-center justify-between ml-1"
                              >
                                <span
                                  className="text-[13px] font-semibold tracking-tight truncate"
                                  style={{ color: t.text }}
                                >
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span
                                    className="ml-2 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                                    style={{ backgroundColor: t.ink, color: t.inkText }}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      )}

                      {/* Sıvı damla tooltip (daraltılmış menü hover durumu) */}
                      <AnimatePresence>
                        {!isExpanded && isHovered && (
                          <motion.div
                            initial={{ opacity: 0, scaleX: 0.15, scaleY: 0.6, x: -12 }}
                            animate={{ opacity: 1, scaleX: 1, scaleY: 1, x: 0 }}
                            exit={{ opacity: 0, scaleX: 0.15, scaleY: 0.6, x: -12 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                            className="flex items-center"
                            style={{
                              position: 'absolute',
                              left: 'calc(100% + 18px)',
                              top: '50%',
                              y: '-50%',
                              transformOrigin: 'left center',
                              pointerEvents: 'none',
                              zIndex: 60,
                            }}
                          >
                            <div
                              className="px-3.5 h-8 rounded-full flex items-center gap-2 text-xs font-semibold whitespace-nowrap"
                              style={{
                                background: t.surface,
                                border: t.edge,
                                color: t.text,
                                boxShadow: t.shadow,
                                backdropFilter: 'blur(24px) saturate(180%)',
                                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                              }}
                            >
                              {item.isOltvia ? (
                                <span className="font-black tracking-[0.14em]">
                                  <span>OLTV</span>
                                  {isAiMode ? (
                                    <span style={{ color: isDark ? '#A78BFA' : '#5B3FD9' }}>ΛI</span>
                                  ) : (
                                    <span>IΛ</span>
                                  )}
                                </span>
                              ) : (
                                <span>{item.label}</span>
                              )}
                              {item.badge && (
                                <span
                                  className="px-2 py-0.5 rounded-full text-[9px] font-black flex items-center justify-center"
                                  style={{ backgroundColor: t.ink, color: t.inkText }}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>
            </LayoutGroup>
          </div>
        </div>

        {/* ───────── ALT: Ayarlar Butonu (Menünün En Altında Sabit) ───────── */}
        <div className="shrink-0 px-2 pb-3 pt-1">
          <div className="mx-2 mb-2 h-[1px]" style={{ background: t.divider }} />
          <div
            className="relative"
            onMouseEnter={() => setHoveredTab('ayarlar')}
            onMouseLeave={() => setHoveredTab(null)}
          >
            <button
              type="button"
              onClick={() => selectTab('ayarlar')}
              className="relative w-full flex items-center rounded-xl pl-2 pr-2.5 focus:outline-none transition-colors duration-200"
              style={{
                height: rowH,
                color: (hoveredTab ?? activeTab) === 'ayarlar' ? t.text : t.sub,
              }}
            >
              {(hoveredTab ?? activeTab) === 'ayarlar' && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    backgroundColor: t.pill,
                    border: `1px solid ${t.pillBorder}`,
                    boxShadow: isDark
                      ? 'inset 0 1px 0 rgba(255,255,255,0.18)'
                      : '0 4px 14px rgba(26,29,36,0.06), inset 0 1px 0 rgba(255,255,255,1)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}

              <span className="relative z-10 w-9 flex items-center justify-center shrink-0">
                <Settings size={18} strokeWidth={(hoveredTab ?? activeTab) === 'ayarlar' ? 2.3 : 1.9} />
              </span>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.22 }}
                    className="relative z-10 flex-1 min-w-0 flex items-center justify-between ml-1"
                  >
                    <span
                      className="text-[13px] font-semibold tracking-tight truncate"
                      style={{ color: t.text }}
                    >
                      Ayarlar
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Sıvı damla tooltip (daraltılmış menüde Ayarlar) */}
            <AnimatePresence>
              {!isExpanded && hoveredTab === 'ayarlar' && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0.15, scaleY: 0.6, x: -12 }}
                  animate={{ opacity: 1, scaleX: 1, scaleY: 1, x: 0 }}
                  exit={{ opacity: 0, scaleX: 0.15, scaleY: 0.6, x: -12 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="flex items-center"
                  style={{
                    position: 'absolute',
                    left: 'calc(100% + 18px)',
                    top: '50%',
                    y: '-50%',
                    transformOrigin: 'left center',
                    pointerEvents: 'none',
                    zIndex: 60,
                  }}
                >
                  <div
                    className="px-3.5 h-8 rounded-full flex items-center gap-2 text-xs font-semibold whitespace-nowrap"
                    style={{
                      background: t.surface,
                      border: t.edge,
                      color: t.text,
                      boxShadow: t.shadow,
                      backdropFilter: 'blur(24px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    }}
                  >
                    Ayarlar
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
