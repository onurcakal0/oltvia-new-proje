"use client";
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  Megaphone,
  Moon,
  Plus,
  ShieldCheck,
  Sun,
} from 'lucide-react';

export type SidebarTheme = 'light' | 'dark';

interface OltviaStudentSidebarProps {
  theme: SidebarTheme;
  onThemeChange: (theme: SidebarTheme) => void;
}

const PURPLE = '#5B3FD9';
const CORAL = '#FF5A4D';

const NAV_ITEMS = [
  { id: 'derslerim', label: 'Derslerim', icon: BookOpen, accent: PURPLE, badge: null },
  { id: 'gorevler', label: 'Görevler', icon: CheckSquare, accent: PURPLE, badge: null },
  { id: 'kampanyalar', label: 'Kampanyalar', icon: Megaphone, accent: CORAL, badge: '2' },
  { id: 'vaka', label: 'Vaka Analizi', icon: FileSearch, accent: PURPLE, badge: null },
  { id: 'guvenlik', label: 'Güvenlik', icon: ShieldCheck, accent: PURPLE, badge: null },
  { id: 'yeteneklerim', label: 'Yeteneklerim', icon: Award, accent: CORAL, badge: null },
];

const CONTACTS = [
  { id: 1, name: 'Selin Yılmaz', initials: 'SY', color: PURPLE, online: true, unread: 0 },
  { id: 2, name: 'Burak Hoca', initials: 'BH', color: CORAL, online: true, unread: 1 },
  { id: 3, name: 'Zeynep Kaya', initials: 'ZK', color: '#F5A623', online: false, unread: 0 },
  { id: 4, name: 'Dr. Ahmet D.', initials: 'AD', color: '#2ECC71', online: true, unread: 2 },
];

/** OLTVIA yuvarlak amblem (koyu daire içinde beyaz O/C + mercan nokta) */
function OltviaEmblem({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path d="M 78 28 A 36 36 0 1 0 78 72" stroke="#FFFFFF" strokeWidth="15" />
      <circle cx="78" cy="28" r="8.5" fill={PURPLE} />
      <circle cx="78" cy="72" r="8.5" fill={CORAL} />
      <circle cx="45" cy="40" r="10" fill="#FFFFFF" />
      <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="#FFFFFF" />
    </svg>
  );
}

export default function OltviaStudentSidebar({ theme, onThemeChange }: OltviaStudentSidebarProps) {
  const isDark = theme === 'dark';

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('derslerim');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [hoveredAvatar, setHoveredAvatar] = useState<number | null>(null);
  const [viewportH, setViewportH] = useState(900);

  useEffect(() => {
    const update = () => setViewportH(window.innerHeight);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Kısa ekranlarda (MacBook Air + Safari gibi) ölçüleri sıkılaştır
  const compact = viewportH < 720;
  const rowH = compact ? 34 : 42;

  const t = isDark
    ? {
        surface: 'rgba(20, 23, 31, 0.72)',
        edge: '1px solid rgba(255, 255, 255, 0.08)',
        text: '#F3F5F8',
        sub: '#8A93A2',
        divider: 'rgba(255, 255, 255, 0.08)',
        card: 'rgba(255, 255, 255, 0.04)',
        cardBorder: 'rgba(255, 255, 255, 0.06)',
        cardShadow: '0 8px 24px rgba(0,0,0,0.30)',
        ring: '#171A22',
        shadow:
          '0 28px 70px -14px rgba(0,0,0,0.65), 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.10)',
        btn: 'rgba(255,255,255,0.07)',
        btnBorder: 'rgba(255,255,255,0.12)',
      }
    : {
        surface: 'rgba(255, 255, 255, 0.78)',
        edge: '1px solid rgba(255, 255, 255, 0.9)',
        text: '#1A1D24',
        sub: '#68707D',
        divider: '#E3E6EB',
        card: '#FFFFFF',
        cardBorder: '#E3E6EB',
        cardShadow: '0 8px 30px rgba(0,0,0,0.06)',
        ring: '#FFFFFF',
        shadow:
          '0 28px 70px -16px rgba(26,29,36,0.18), 0 2px 8px rgba(26,29,36,0.05), inset 0 1px 0 rgba(255,255,255,1)',
        btn: '#FFFFFF',
        btnBorder: '#E3E6EB',
      };

  const pillBg = (accent: string) =>
    accent === CORAL
      ? isDark ? 'rgba(255, 90, 77, 0.15)' : 'rgba(255, 90, 77, 0.10)'
      : isDark ? 'rgba(91, 63, 217, 0.15)' : 'rgba(91, 63, 217, 0.10)';

  /** Gece/Gündüz geçişi: butonun merkezinden büyüyen dairesel clip-path dalgası */
  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const next: SidebarTheme = isDark ? 'light' : 'dark';

    const doc = document as any;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!doc.startViewTransition || reduceMotion) {
      onThemeChange(next);
      return;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = doc.startViewTransition(() => {
      flushSync(() => onThemeChange(next));
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
        },
        {
          duration: 600,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  const ThemeToggle = (
    <button
      type="button"
      onClick={handleThemeToggle}
      aria-label={isDark ? 'Aydınlık moda geç' : 'Gece moduna geç'}
      title={isDark ? 'Aydınlık moda geç' : 'Gece moduna geç'}
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-110 active:scale-95 focus:outline-none"
      style={{
        backgroundColor: t.btn,
        border: `1px solid ${t.btnBorder}`,
        color: isDark ? '#F5A623' : t.text,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="flex"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );

  const UserAvatar = (
    <div className="relative shrink-0">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
        style={{ backgroundColor: '#1A1D24', boxShadow: `0 0 0 2px ${t.ring}, 0 4px 10px rgba(0,0,0,0.18)` }}
      >
        AK
      </div>
      <span
        className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: '#2ECC71', boxShadow: `0 0 0 2px ${t.ring}` }}
      />
    </div>
  );

  return (
    // Sabit kapsayıcı: dikeyde ortalar, menü asla ekran dışına taşmaz
    <div
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 16,
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
          maxHeight: 'calc(100vh - 24px)',
          borderRadius: 24,
          pointerEvents: 'auto',
          backgroundColor: t.surface,
          border: t.edge,
          boxShadow: t.shadow,
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        {/* Kenar oku: sınırın üstüne gelince belirir */}
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-label={isExpanded ? 'Menüyü daralt' : 'Menüyü genişlet'}
          className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 focus:outline-none"
          style={{ backgroundColor: PURPLE, boxShadow: '0 4px 12px rgba(91,63,217,0.45)' }}
        >
          {isExpanded ? <ChevronLeft size={14} strokeWidth={2.6} /> : <ChevronRight size={14} strokeWidth={2.6} />}
        </button>

        {/* ───────── 1. HEADER: macOS noktaları + OLTVIA logosu ───────── */}
        <div className="shrink-0 px-2 pt-3">
          <div className="flex items-center justify-center gap-1.5 pb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CORAL }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#F5A623' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#2ECC71' }} />
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            aria-label="OLTVIA - menüyü aç / kapat"
            title="OLTVIA"
            className="w-full flex items-center rounded-2xl py-1 pl-[6px] focus:outline-none"
          >
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10"
              style={{
                backgroundColor: isDark ? '#0E1016' : '#1A1D24',
                boxShadow: isDark
                  ? '0 0 0 1px rgba(255,255,255,0.14), 0 6px 16px rgba(0,0,0,0.4)'
                  : '0 6px 16px rgba(26,29,36,0.28)',
              }}
            >
              <OltviaEmblem size={21} />
            </motion.div>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -12, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2 ml-3 whitespace-nowrap"
                >
                  <span
                    className="text-[17px] font-black tracking-[0.18em] font-sans"
                    style={{ color: t.text }}
                  >
                    OLTVIΛ
                  </span>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'rgba(91,63,217,0.12)', color: PURPLE }}
                  >
                    Student
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* ───────── ORTA: menü + mesajlar (sadece açıkken kaydırılabilir) ───────── */}
        <div
          className="flex flex-col flex-1 min-h-0"
          style={{
            overflowY: isExpanded ? 'auto' : 'visible',
            overflowX: isExpanded ? 'hidden' : 'visible',
            scrollbarWidth: 'none',
          }}
        >
          {/* MENU */}
          <div className="px-2 pt-1 shrink-0">
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
                {NAV_ITEMS.map((item, index) => {
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
                      <button
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className="relative w-full flex items-center rounded-xl pl-2 pr-2.5 focus:outline-none transition-colors duration-200"
                        style={{ height: rowH, color: highlighted ? item.accent : t.sub }}
                      >
                        {highlighted && (
                          <motion.span
                            layoutId="activeNav"
                            className="absolute inset-0 rounded-xl"
                            style={{
                              backgroundColor: pillBg(item.accent),
                              boxShadow: isDark ? `0 0 18px ${item.accent}26` : 'none',
                            }}
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          />
                        )}

                        <span className="relative z-10 w-9 flex items-center justify-center shrink-0">
                          <Icon size={19} strokeWidth={highlighted ? 2.3 : 1.9} />
                        </span>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.span
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -8 }}
                              transition={{ duration: 0.22, delay: 0.06 + index * 0.025 }}
                              className="relative z-10 flex-1 min-w-0 flex items-center justify-between ml-1"
                            >
                              <span
                                className="text-[13px] font-semibold tracking-tight truncate"
                                style={{ color: highlighted ? item.accent : t.text }}
                              >
                                {item.label}
                              </span>
                              {item.badge && (
                                <span
                                  className="ml-2 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                                  style={{ backgroundColor: PURPLE, boxShadow: '0 2px 8px rgba(91,63,217,0.4)' }}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>

                      {/* Sıvı damla tooltip (daraltılmış durumda hover) */}
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
                            <svg width="14" height="24" viewBox="0 0 14 24" style={{ marginRight: -1 }} aria-hidden="true">
                              <path
                                d="M14 0 C14 7 5 8 2.6 10.4 Q0 12 2.6 13.6 C5 16 14 17 14 24 Z"
                                fill={item.accent}
                              />
                            </svg>
                            <div
                              className="px-3.5 h-8 rounded-full flex items-center gap-2 text-xs font-bold text-white whitespace-nowrap"
                              style={{
                                backgroundColor: item.accent,
                                boxShadow: `0 8px 22px ${item.accent}55`,
                              }}
                            >
                              {item.label}
                              {item.badge && (
                                <span
                                  className="w-4 h-4 rounded-full bg-white text-[10px] font-black flex items-center justify-center"
                                  style={{ color: item.accent }}
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

          {/* ───────── MESSAGES ───────── */}
          <div className="px-2 pb-2 mt-auto pt-2 shrink-0">
            {!isExpanded ? (
              // Daraltılmış: dikey kapsül içinde üst üste avatarlar + mor "+"
              <div
                className="mx-auto w-[44px] py-2 rounded-full flex flex-col items-center gap-1.5"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(26,29,36,0.04)',
                  border: `1px solid ${t.divider}`,
                  borderRadius: 999,
                }}
              >
                {CONTACTS.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    className="relative"
                    onMouseEnter={() => setHoveredAvatar(c.id)}
                    onMouseLeave={() => setHoveredAvatar(null)}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white cursor-pointer transition-transform hover:scale-110"
                      style={{ backgroundColor: c.color, boxShadow: `0 0 0 2px ${t.ring}` }}
                    >
                      {c.initials}
                    </div>

                    <AnimatePresence>
                      {hoveredAvatar === c.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.4, x: -8 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.4, x: -8 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                          className="flex items-center"
                          style={{
                            position: 'absolute',
                            left: 'calc(100% + 14px)',
                            top: '50%',
                            y: '-50%',
                            transformOrigin: 'left center',
                            pointerEvents: 'none',
                            zIndex: 60,
                          }}
                        >
                          <svg width="10" height="18" viewBox="0 0 10 18" style={{ marginRight: -1 }} aria-hidden="true">
                            <path d="M10 0 C10 5 4 6.5 2 8 Q0 9 2 10 C4 11.5 10 13 10 18 Z" fill={PURPLE} />
                          </svg>
                          <div
                            className="px-3 h-6 rounded-full flex items-center gap-[3px]"
                            style={{ backgroundColor: PURPLE, boxShadow: '0 6px 16px rgba(91,63,217,0.5)' }}
                          >
                            <span className="w-1 h-1 rounded-full bg-white" />
                            <span className="w-1 h-1 rounded-full bg-white" />
                            <span className="w-1 h-1 rounded-full bg-white" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  aria-label="Tüm mesajlar"
                  title="Tüm mesajlar"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                  style={{ backgroundColor: PURPLE, boxShadow: '0 4px 12px rgba(91,63,217,0.45)' }}
                >
                  <Plus size={14} strokeWidth={2.6} />
                </button>
              </div>
            ) : (
              // Genişletilmiş: başlık + sayfalama + yükseltilmiş kart
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.1 }}
              >
                <div className="flex items-center justify-between px-3 pb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: t.sub }}>
                    Messages
                  </span>
                  <div className="flex items-center gap-0.5" style={{ color: t.sub }}>
                    <button type="button" aria-label="Önceki" className="p-0.5 rounded hover:opacity-70 focus:outline-none">
                      <ChevronLeft size={14} />
                    </button>
                    <button type="button" aria-label="Sonraki" className="p-0.5 rounded hover:opacity-70 focus:outline-none">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                <div
                  className="rounded-[18px] p-3"
                  style={{
                    backgroundColor: t.card,
                    border: `1px solid ${t.cardBorder}`,
                    boxShadow: t.cardShadow,
                  }}
                >
                  <div className="flex flex-col gap-1">
                    {CONTACTS.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between rounded-lg px-1 py-[3px] cursor-pointer transition-colors"
                        style={{ color: t.text }}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                              style={{ backgroundColor: c.color }}
                            >
                              {c.initials}
                            </div>
                          </div>
                          <span className="text-xs font-semibold truncate">{c.name}</span>
                        </div>

                        {c.unread > 0 ? (
                          <span
                            className="ml-2 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                            style={{ backgroundColor: PURPLE }}
                          >
                            {c.unread}
                          </span>
                        ) : (
                          <span
                            className="ml-2 w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: c.online ? '#2ECC71' : t.divider }}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="w-full mt-2.5 h-8 rounded-full flex items-center justify-center gap-1.5 text-xs font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
                    style={{ backgroundColor: PURPLE, boxShadow: '0 8px 20px rgba(91,63,217,0.38)' }}
                  >
                    <Plus size={14} strokeWidth={2.6} />
                    All messages
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ───────── ALT: profil + tema butonu ───────── */}
        <div className="shrink-0 px-2 py-2.5" style={{ borderTop: `1px solid ${t.divider}` }}>
          {!isExpanded ? (
            <div className="flex flex-col items-center gap-2">
              {UserAvatar}
              {ThemeToggle}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 pl-1">
              <div className="flex items-center gap-2.5 min-w-0">
                {UserAvatar}
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-bold leading-tight truncate" style={{ color: t.text }}>
                    Arda Kılıç
                  </span>
                  <span className="text-[10px] font-medium" style={{ color: t.sub }}>
                    OLTVIA Student
                  </span>
                </div>
              </div>
              {ThemeToggle}
            </div>
          )}
        </div>
      </motion.aside>
    </div>
  );
}
