"use client";
import React, { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  GraduationCap,
  Mail,
  MapPin,
  Plus,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { SidebarTheme } from './OltviaStudentSidebar';

/* ═══════════════════════════════════════════════════════════════════════════
   ORTAK TASARIM ALTYAPISI (Liquid Glass + Kayan Çerçeve Işığı)
   ═══════════════════════════════════════════════════════════════════════════ */

interface Ui {
  isDark: boolean;
  glass: React.CSSProperties;
  tp: string; // birincil metin
  ts: string; // ikincil metin
  tm: string; // soluk metin
  line: string; // ayraç / kılavuz çizgisi
  soft: string; // yumuşak zemin
}

type BeamColor = 'purple' | 'coral';

/** Ana sayfadaki kart çerçevesinde dönen LED ışığı (landing page BorderBeam ile aynı mantık) */
function BorderBeam({
  isDark,
  color = 'purple',
  duration = '14s',
  delay = '0s',
}: {
  isDark: boolean;
  color?: BeamColor;
  duration?: string;
  delay?: string;
}) {
  const gradient =
    color === 'coral'
      ? isDark
        ? 'conic-gradient(from 0deg, transparent 0deg, transparent 260deg, rgba(255,90,77,0.05) 280deg, rgba(255,90,77,0.35) 315deg, rgba(255,90,77,0.85) 340deg, #ffffff 352deg, rgba(255,255,255,0.7) 357deg, transparent 360deg)'
        : 'conic-gradient(from 0deg, transparent 0deg, transparent 260deg, rgba(255,90,77,0.05) 280deg, rgba(255,90,77,0.3) 315deg, rgba(255,90,77,0.7) 340deg, #FF5A4D 352deg, rgba(255,90,77,0.6) 357deg, transparent 360deg)'
      : isDark
      ? 'conic-gradient(from 0deg, transparent 0deg, transparent 260deg, rgba(91,63,217,0.05) 280deg, rgba(91,63,217,0.35) 315deg, rgba(139,92,246,0.85) 340deg, #ffffff 352deg, rgba(255,255,255,0.7) 357deg, transparent 360deg)'
      : 'conic-gradient(from 0deg, transparent 0deg, transparent 260deg, rgba(91,63,217,0.05) 280deg, rgba(91,63,217,0.3) 315deg, rgba(139,92,246,0.7) 340deg, #5B3FD9 352deg, rgba(91,63,217,0.6) 357deg, transparent 360deg)';

  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] p-[1.5px] overflow-hidden z-0"
      style={{
        maskImage: 'linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)',
        maskClip: 'content-box, border-box',
        maskComposite: 'exclude',
        WebkitMaskImage: 'linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)',
        WebkitMaskClip: 'content-box, border-box',
        WebkitMaskComposite: 'xor',
      }}
    >
      <div
        className="absolute -inset-[150%] animate-border-beam opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          animationDuration: duration,
          animationDelay: delay,
          background: gradient,
          filter: isDark
            ? 'drop-shadow(0 0 6px rgba(139,92,246,0.5))'
            : 'drop-shadow(0 0 4px rgba(91,63,217,0.3))',
        }}
      />
    </div>
  );
}

function Card({
  ui,
  children,
  className = '',
  beam = 'purple',
  delay = '0s',
  style,
  onClick,
}: {
  ui: Ui;
  children: React.ReactNode;
  className?: string;
  beam?: BeamColor;
  delay?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={'group relative rounded-[22px] ' + className}
      style={{ ...ui.glass, ...style }}
    >
      <BorderBeam isDark={ui.isDark} color={beam} delay={delay} />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function CardTitle({
  ui,
  title,
  sub,
  right,
}: {
  ui: Ui;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="min-w-0">
        <h3 className="text-[15px] font-bold tracking-tight" style={{ color: ui.tp }}>
          {title}
        </h3>
        {sub && (
          <p className="text-[11.5px] font-medium mt-0.5" style={{ color: ui.ts }}>
            {sub}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

function Pill({
  ui,
  children,
  tone = 'purple',
}: {
  ui: Ui;
  children: React.ReactNode;
  tone?: 'purple' | 'coral' | 'green' | 'amber' | 'neutral';
}) {
  const map = {
    purple: { bg: ui.isDark ? 'rgba(139,92,246,0.18)' : 'rgba(91,63,217,0.10)', fg: ui.isDark ? '#C4B5FD' : '#5B3FD9' },
    coral: { bg: 'rgba(255,90,77,0.14)', fg: '#FF5A4D' },
    green: { bg: 'rgba(16,185,129,0.15)', fg: ui.isDark ? '#34D399' : '#059669' },
    amber: { bg: 'rgba(245,158,11,0.15)', fg: ui.isDark ? '#FBBF24' : '#B45309' },
    neutral: { bg: ui.soft, fg: ui.ts },
  }[tone];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap"
      style={{ backgroundColor: map.bg, color: map.fg }}
    >
      {children}
    </span>
  );
}

function PageHeader({
  ui,
  title,
  sub,
  right,
}: {
  ui: Ui;
  title: string;
  sub: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
      <div>
        <h1 className="text-[26px] font-black tracking-tight leading-tight" style={{ color: ui.tp }}>
          {title}
        </h1>
        <p className="text-[13px] font-medium mt-1" style={{ color: ui.ts }}>
          {sub}
        </p>
      </div>
      {right}
    </div>
  );
}

function ProgressBar({ ui, value, from = '#5B3FD9', to = '#8B5CF6' }: { ui: Ui; value: number; from?: string; to?: string }) {
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: ui.soft }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: Math.min(100, Math.max(0, value)) + '%', background: `linear-gradient(90deg, ${from} 0%, ${to} 100%)` }}
      />
    </div>
  );
}

/** Noktalardan yumuşak (bezier) yol üretir */
function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function AreaChart({
  ui,
  values,
  labels,
  id,
  height = 170,
}: {
  ui: Ui;
  values: number[];
  labels: string[];
  id: string;
  height?: number;
}) {
  const W = 400;
  const H = 150;
  const max = Math.max(...values) * 1.15;
  const min = Math.min(...values) * 0.6;
  const pts: [number, number][] = values.map((v, i) => [
    10 + (i * (W - 20)) / (values.length - 1),
    H - ((v - min) / (max - min)) * (H - 20) - 5,
  ]);
  const line = smoothPath(pts);
  const peak = pts[values.indexOf(Math.max(...values))];
  return (
    <div className="relative w-full" style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H + 10}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id={id + '-fill'} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#5B3FD9" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={id + '-stroke'} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="55%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>
        </defs>
        {[30, 70, 110].map((y) => (
          <line key={y} x1="0" y1={y} x2={W} y2={y} stroke={ui.line} strokeDasharray="3 4" />
        ))}
        <path d={`${line} L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`} fill={`url(#${id}-fill)`} />
        <path d={line} fill="none" stroke={`url(#${id}-stroke)`} strokeWidth="3" strokeLinecap="round" />
        <circle cx={peak[0]} cy={peak[1]} r="5" fill="#fff" stroke="#8B5CF6" strokeWidth="3" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 text-[11px] font-semibold" style={{ color: ui.tm }}>
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function Ring({ ui, pct, color, size = 56, label }: { ui: Ui; pct: number; color: string; size?: number; label?: string }) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={ui.soft} strokeWidth="4.5" fill="transparent" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth="4.5"
          fill="transparent"
          strokeDasharray={c}
          strokeDashoffset={c - (pct / 100) * c}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute text-[11px] font-bold" style={{ color: ui.tp }}>
        {label ?? pct + '%'}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANA GÖRÜNÜM
   ═══════════════════════════════════════════════════════════════════════════ */

export interface StudentUser {
  id?: string;
  full_name?: string;
  student_number?: string;
  class_name?: string;
  grade?: string;
  email?: string;
  phone_number?: string;
  tenant_name?: string;
  tenant_code?: string;
  schema_name?: string;
}

interface OltviaStudentDashboardViewProps {
  activeTab: string;
  theme: SidebarTheme;
  isExpanded: boolean;
}

export default function OltviaStudentDashboardView({ activeTab, theme, isExpanded }: OltviaStudentDashboardViewProps) {
  const isDark = theme === 'dark';

  // Giriş yapan aktif öğrenci profili (Backend & LocalStorage)
  const [studentUser, setStudentUser] = useState<StudentUser | null>(null);

  useEffect(() => {
    // 1. Önbellekten anında yükle (gecikmesiz render)
    try {
      const raw = localStorage.getItem('oltvia_user');
      if (raw) {
        setStudentUser(JSON.parse(raw));
      }
    } catch {
      // ignore
    }

    // 2. Backend /api/v1/auth/me üzerinden güncel veriyi doğrula
    const token = localStorage.getItem('oltvia_token') || localStorage.getItem('edux_token');
    if (token) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';
      fetch(`${backendUrl}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.full_name) {
          setStudentUser(data);
          localStorage.setItem('oltvia_user', JSON.stringify(data));
        }
      })
      .catch(() => {
        // Ağ hatası durumunda önbellekteki veri kullanılır
      });
    }
  }, []);

  const ui: Ui = {
    isDark,
    glass: {
      background: isDark
        ? 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)'
        : 'linear-gradient(135deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.58) 100%)',
      border: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.95)',
      boxShadow: isDark
        ? '0 12px 36px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.14)'
        : '0 10px 30px -8px rgba(26,29,36,0.09), inset 0 1px 0 rgba(255,255,255,1)',
      backdropFilter: 'blur(26px) saturate(180%)',
      WebkitBackdropFilter: 'blur(26px) saturate(180%)',
    },
    tp: isDark ? '#F3F5F8' : '#1A1D24',
    ts: isDark ? 'rgba(243,245,248,0.58)' : 'rgba(26,29,36,0.58)',
    tm: isDark ? 'rgba(243,245,248,0.38)' : 'rgba(26,29,36,0.40)',
    line: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,29,36,0.08)',
    soft: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,29,36,0.06)',
  };

  const views: Record<string, React.ReactNode> = {
    'ana-sayfa': <AnaSayfa ui={ui} user={studentUser} />,
    'ders-programi': <DersProgrami ui={ui} />,
    'gunluk-ilerleme': <GunlukIlerleme ui={ui} />,
    'gorevler-odevler': <GorevlerOdevler ui={ui} />,
    oltvia: <OltvaiAsistan ui={ui} user={studentUser} />,
    'sinav-sonuclari': <SinavSonuclari ui={ui} />,
    'yks-not-analizi': <YksNotAnalizi ui={ui} />,
    'detayli-rapor': <DetayliRapor ui={ui} />,
    okulum: <Okulum ui={ui} />,
    ogretmenler: <Ogretmenler ui={ui} />,
    'rehberlik-pdr': <Rehberlik ui={ui} />,
    ayarlar: <Ayarlar ui={ui} user={studentUser} />,
  };

  return (
    <div
      className="absolute inset-0 overflow-y-auto overflow-x-hidden pt-[104px] pb-10 transition-all duration-300 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full"
      style={{
        paddingLeft: isExpanded ? '280px' : '96px',
        paddingRight: '28px',
        scrollbarColor: isDark ? 'rgba(255,255,255,0.15) transparent' : 'rgba(0,0,0,0.12) transparent',
      }}
    >
      <div className="max-w-[1360px] mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {views[activeTab] ?? views['ana-sayfa']}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. ANA SAYFA
   ═══════════════════════════════════════════════════════════════════════════ */
function AnaSayfa({ ui, user }: { ui: Ui; user: StudentUser | null }) {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Matematik: Türev ve İntegral – 40 soru', done: true },
    { id: 2, text: 'Fizik: Manyetizma konu tekrarı', done: false },
    { id: 3, text: 'Kimya: Elektrokimya soru çözümü', done: false },
    { id: 4, text: 'Biyoloji: Protein sentezi özeti', done: false },
    { id: 5, text: 'Türkçe: 25 paragraf sorusu', done: false },
  ]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: draft.trim(), done: false }]);
    setDraft('');
    setAdding(false);
  };
  const doneCount = tasks.filter((t) => t.done).length;

  // Kullanıcı adını dinamik olarak biçimlendir (örn: "onur cakal" -> "Onur")
  const rawFullName = user?.full_name?.trim() || 'Arda';
  const formattedWords = rawFullName
    .split(/\s+/)
    .map(w => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1).toLocaleLowerCase('tr-TR'));
  const firstName = formattedWords[0] || 'Öğrenci';

  // Sınıf ve okul bilgisi
  const className = user?.class_name || '12-A';
  const schoolName = user?.tenant_name || '';
  const onlineSubtitle = `● Çevrimiçi • ${className} ${schoolName ? '• ' + schoolName : 'Sayısal'}`;

  return (
    <>
      <PageHeader
        ui={ui}
        title={`Hoş geldin, ${firstName} 👋`}
        sub="Bugün hedefinin %82'sine ulaştın. Sınavına 2 gün kaldı, tempoyu koru."
        right={<Pill ui={ui} tone="green">{onlineSubtitle}</Pill>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* SOL KOLON */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <Card ui={ui} className="p-5">
            <CardTitle
              ui={ui}
              title="Görev Listem"
              sub={`${doneCount}/${tasks.length} görev tamamlandı`}
              right={
                <button
                  type="button"
                  onClick={() => setAdding(!adding)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                  style={{ backgroundColor: ui.soft, color: ui.tp }}
                  title="Görev ekle"
                >
                  <Plus size={15} strokeWidth={2.4} />
                </button>
              }
            />
            <div className="flex flex-col gap-1.5">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setTasks(tasks.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                  className="flex items-center gap-3 p-2 rounded-xl cursor-pointer select-none transition-colors"
                  style={{ backgroundColor: t.done ? ui.soft : 'transparent' }}
                >
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
                    style={{
                      backgroundColor: t.done ? '#FF5A4D' : ui.soft,
                      border: t.done ? '1px solid #FF5A4D' : `1.5px solid ${ui.isDark ? 'rgba(255,255,255,0.22)' : 'rgba(26,29,36,0.22)'}`,
                    }}
                  >
                    {t.done && <Check size={13} strokeWidth={3} className="text-white" />}
                  </div>
                  <span
                    className="text-[13px] font-medium leading-snug"
                    style={{ color: t.done ? ui.tm : ui.tp, textDecoration: t.done ? 'line-through' : 'none' }}
                  >
                    {t.text}
                  </span>
                </div>
              ))}
            </div>
            {adding && (
              <form onSubmit={addTask} className="mt-3 flex items-center gap-2">
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Yeni görev yaz..."
                  className="flex-1 h-9 px-3 text-xs rounded-xl bg-transparent border outline-none font-medium"
                  style={{ color: ui.tp, borderColor: ui.line }}
                />
                <button type="submit" className="h-9 px-3 text-xs font-bold rounded-xl text-white" style={{ backgroundColor: '#5B3FD9' }}>
                  Ekle
                </button>
              </form>
            )}
          </Card>

          {/* Yaklaşan sınav – mercan kart */}
          <Card
            ui={ui}
            beam="coral"
            delay="-5s"
            className="p-5 text-white"
            style={{
              background: 'linear-gradient(135deg, #FF6254 0%, #FF5A4D 45%, #E54538 100%)',
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 14px 32px -6px rgba(255,90,77,0.45), inset 0 1px 0 rgba(255,255,255,0.4)',
            }}
          >
            <span className="text-[11px] font-bold tracking-wider uppercase opacity-90">Yaklaşan Sınav</span>
            <div className="text-[36px] font-black tracking-tight leading-none mt-2">2 Gün Kaldı</div>
            <div className="mt-3 pt-2.5 border-t border-white/25 flex items-center justify-between text-xs font-semibold">
              <span>Türkiye Geneli YKS Denemesi</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">10:15</span>
            </div>
          </Card>

          <Card ui={ui} className="p-5" delay="-9s">
            <div className="flex items-center justify-between text-xs font-bold" style={{ color: ui.tp }}>
              <span>Günün Soru Kotası</span>
              <span style={{ color: '#8B5CF6' }}>165 / 200</span>
            </div>
            <div className="mt-3">
              <ProgressBar ui={ui} value={82.5} />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px]" style={{ color: ui.ts }}>
              <span>%82,5 tamamlandı</span>
              <span className="font-semibold text-emerald-500">Hedefe 35 soru</span>
            </div>
          </Card>
        </div>

        {/* ORTA KOLON */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <Card ui={ui} className="p-5" delay="-3s">
            <CardTitle
              ui={ui}
              title="Çalışma İstatistikleri"
              sub="Bu haftanın günlük net çalışma süresi (saat)"
              right={<Pill ui={ui}>Haftalık</Pill>}
            />
            <AreaChart ui={ui} id="ana" values={[3.2, 4.5, 3.8, 6.1, 5.4, 7.2, 6.5]} labels={['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']} />
          </Card>

          <Card ui={ui} className="p-5" delay="-7s">
            <CardTitle ui={ui} title="Aktif Dersler" sub="Müfredat tamamlama oranları" right={<Pill ui={ui} tone="neutral">4 ders</Pill>} />
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { l: 'Matematik', p: 74, c: '#8B5CF6' },
                { l: 'Fizik', p: 58, c: '#3B82F6' },
                { l: 'Kimya', p: 50, c: '#10B981' },
                { l: 'Biyoloji', p: 70, c: '#F59E0B' },
              ].map((c) => (
                <div key={c.l} className="flex flex-col items-center gap-1.5">
                  <Ring ui={ui} pct={c.p} color={c.c} />
                  <span className="text-[11px] font-semibold" style={{ color: ui.ts }}>{c.l}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card ui={ui} className="p-4" delay="-11s">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: ui.isDark ? 'rgba(139,92,246,0.18)' : 'rgba(91,63,217,0.10)', color: ui.isDark ? '#C4B5FD' : '#5B3FD9' }}>
                  <Clock size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: ui.tp }}>Sıradaki Ders: 10:00</div>
                  <div className="text-xs font-medium" style={{ color: ui.ts }}>İleri Matematik • Burak Aksoy • Lab 2</div>
                </div>
              </div>
              <Pill ui={ui} tone="green">25 dk kaldı</Pill>
            </div>
          </Card>
        </div>

        {/* SAĞ KOLON */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <Card ui={ui} className="p-5" delay="-2s">
            <CardTitle ui={ui} title="Öğrenme Hızı" />
            <div className="text-[34px] font-black tracking-tight leading-none" style={{ color: ui.tp }}>%373</div>
            <p className="text-xs font-medium mt-2" style={{ color: ui.ts }}>Hedef tempoya göre ortalama</p>
          </Card>
          <Card ui={ui} className="p-5" delay="-6s">
            <CardTitle ui={ui} title="Tamamlama Oranı" />
            <div className="text-[34px] font-black tracking-tight leading-none" style={{ color: ui.tp }}>%4,01</div>
            <p className="text-xs font-medium mt-2" style={{ color: ui.ts }}>Geçen haftaya göre artış</p>
          </Card>
          <Card ui={ui} className="p-5 flex flex-col items-center" delay="-10s">
            <div className="w-full"><CardTitle ui={ui} title="Harcanan Süre" /></div>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#8B5CF6" strokeWidth="15" strokeDasharray="119 239" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#FF5A4D" strokeWidth="15" strokeDasharray="72 239" strokeDashoffset="-125" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke={ui.isDark ? '#2D323E' : '#D1D5DB'} strokeWidth="15" strokeDasharray="40 239" strokeDashoffset="-203" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[18px] font-black" style={{ color: ui.tp }}>10 sa</span>
                <span className="text-[10.5px] font-semibold" style={{ color: ui.ts }}>bu hafta</span>
              </div>
            </div>
            <div className="w-full mt-3 flex items-center justify-around text-[10.5px] font-semibold" style={{ color: ui.ts }}>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />Soru</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FF5A4D]" />Konu</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: ui.isDark ? '#2D323E' : '#D1D5DB' }} />Deneme</span>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. DERS PROGRAMI
   ═══════════════════════════════════════════════════════════════════════════ */
const SUBJECT_COLORS: Record<string, string> = {
  Matematik: '#8B5CF6',
  Fizik: '#3B82F6',
  Kimya: '#10B981',
  Biyoloji: '#F59E0B',
  Türkçe: '#EC4899',
  Geometri: '#6366F1',
  Tarih: '#A16207',
  Etüt: '#64748B',
  Rehberlik: '#FF5A4D',
  Deneme: '#FF5A4D',
};

function DersProgrami({ ui }: { ui: Ui }) {
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
  const hours = ['09:00', '09:50', '10:45', '11:35', '13:30'];
  const grid: string[][] = [
    ['Matematik', 'Fizik', 'Matematik', 'Kimya', 'Biyoloji'],
    ['Matematik', 'Fizik', 'Geometri', 'Kimya', 'Türkçe'],
    ['Kimya', 'Geometri', 'Fizik', 'Biyoloji', 'Deneme'],
    ['Biyoloji', 'Türkçe', 'Tarih', 'Matematik', 'Rehberlik'],
    ['Etüt', 'Etüt', 'Etüt', 'Etüt', 'Etüt'],
  ];
  const todayIdx = 2;
  return (
    <>
      <PageHeader ui={ui} title="Ders Programı" sub="12-A Sayısal • 2026-2027 Güz Dönemi" right={<Pill ui={ui} tone="green">Bugün: Çarşamba</Pill>} />
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <Card ui={ui} className="p-5 xl:col-span-9">
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid gap-2" style={{ gridTemplateColumns: '64px repeat(5, 1fr)' }}>
                <div />
                {days.map((d, i) => (
                  <div
                    key={d}
                    className="text-center text-xs font-bold py-2 rounded-xl"
                    style={{
                      color: i === todayIdx ? '#fff' : ui.ts,
                      background: i === todayIdx ? 'linear-gradient(135deg,#5B3FD9,#8B5CF6)' : 'transparent',
                    }}
                  >
                    {d}
                  </div>
                ))}
                {grid.map((row, r) => (
                  <React.Fragment key={r}>
                    <div className="text-[11px] font-mono font-semibold flex items-center" style={{ color: ui.tm }}>{hours[r]}</div>
                    {row.map((s, c) => (
                      <div
                        key={c}
                        className="rounded-xl px-2.5 py-3 text-xs font-semibold transition-transform hover:scale-[1.03] cursor-default"
                        style={{
                          backgroundColor: SUBJECT_COLORS[s] + (ui.isDark ? '26' : '1A'),
                          borderLeft: `3px solid ${SUBJECT_COLORS[s]}`,
                          color: ui.tp,
                          outline: c === todayIdx ? `1px solid ${SUBJECT_COLORS[s]}66` : 'none',
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="xl:col-span-3 flex flex-col gap-5">
          <Card ui={ui} className="p-5" delay="-4s">
            <CardTitle ui={ui} title="Bugünün Akışı" />
            <div className="flex flex-col gap-3">
              {[
                { t: '09:00', s: 'Kimya', d: 'Elektrokimya', done: true },
                { t: '09:50', s: 'Geometri', d: 'Çember ve daire', done: true },
                { t: '10:45', s: 'Fizik', d: 'İndüksiyon', done: false },
                { t: '11:35', s: 'Tarih', d: 'İnkılap tarihi', done: false },
              ].map((x) => (
                <div key={x.t} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: x.done ? '#10B981' : SUBJECT_COLORS[x.s] }} />
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold" style={{ color: x.done ? ui.tm : ui.tp }}>{x.s} <span className="font-medium" style={{ color: ui.tm }}>• {x.t}</span></div>
                    <div className="text-[11px]" style={{ color: ui.ts }}>{x.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card ui={ui} className="p-5" delay="-9s">
            <CardTitle ui={ui} title="Haftalık Özet" />
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl py-3" style={{ backgroundColor: ui.soft }}>
                <div className="text-xl font-black" style={{ color: ui.tp }}>25</div>
                <div className="text-[11px]" style={{ color: ui.ts }}>Ders saati</div>
              </div>
              <div className="rounded-xl py-3" style={{ backgroundColor: ui.soft }}>
                <div className="text-xl font-black" style={{ color: ui.tp }}>5</div>
                <div className="text-[11px]" style={{ color: ui.ts }}>Etüt saati</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. GÜNLÜK İLERLEME DURUMU
   ═══════════════════════════════════════════════════════════════════════════ */
function GunlukIlerleme({ ui }: { ui: Ui }) {
  const kpis = [
    { icon: Flame, label: 'Çalışma Serisi', value: '18 gün', tone: '#F59E0B' },
    { icon: TrendingUp, label: 'Bugün Çözülen Soru', value: '165', tone: '#8B5CF6' },
    { icon: Clock, label: 'Odaklanma Süresi', value: '6,5 sa', tone: '#10B981' },
    { icon: Target, label: 'Günlük Hedef', value: '%82', tone: '#FF5A4D' },
  ];
  const week = [
    { d: 'Pzt', v: 120 },
    { d: 'Sal', v: 160 },
    { d: 'Çar', v: 140 },
    { d: 'Per', v: 190 },
    { d: 'Cum', v: 175 },
    { d: 'Cmt', v: 210 },
    { d: 'Paz', v: 165 },
  ];
  const maxV = 220;
  return (
    <>
      <PageHeader ui={ui} title="Günlük İlerleme Durumu" sub="Bugünkü çalışma performansın ve haftalık gidişatın" right={<Pill ui={ui}>Bugün</Pill>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        {kpis.map((k, i) => (
          <Card ui={ui} key={k.label} className="p-5" delay={`-${i * 3}s`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: k.tone + '26', color: k.tone }}>
              <k.icon size={20} />
            </div>
            <div className="text-2xl font-black" style={{ color: ui.tp }}>{k.value}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: ui.ts }}>{k.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card ui={ui} className="p-5 lg:col-span-7" delay="-2s">
          <CardTitle ui={ui} title="Haftalık Soru Çözümü" sub="Günlere göre çözülen soru sayısı" />
          <div className="flex items-end justify-between gap-3 h-[190px] pt-2">
            {week.map((w, i) => (
              <div key={w.d} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                <span className="text-[11px] font-bold" style={{ color: ui.ts }}>{w.v}</span>
                <div
                  className="w-full rounded-t-xl transition-all duration-700"
                  style={{
                    height: (w.v / maxV) * 100 + '%',
                    background: i === 6 ? 'linear-gradient(180deg,#FF6254,#FF5A4D)' : 'linear-gradient(180deg,#8B5CF6,#5B3FD9)',
                    opacity: i === 6 ? 1 : 0.8,
                  }}
                />
                <span className="text-[11px] font-semibold" style={{ color: ui.tm }}>{w.d}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card ui={ui} className="p-5 lg:col-span-5" delay="-8s">
          <CardTitle ui={ui} title="Ders Bazlı Günlük Hedefler" />
          <div className="flex flex-col gap-4">
            {[
              { l: 'Matematik', v: 90, t: '45 / 50 soru', c: '#8B5CF6' },
              { l: 'Fizik', v: 70, t: '28 / 40 soru', c: '#3B82F6' },
              { l: 'Kimya', v: 60, t: '24 / 40 soru', c: '#10B981' },
              { l: 'Biyoloji', v: 100, t: '30 / 30 soru', c: '#F59E0B' },
              { l: 'Türkçe', v: 76, t: '38 / 50 soru', c: '#EC4899' },
            ].map((x) => (
              <div key={x.l}>
                <div className="flex justify-between text-xs font-semibold mb-1.5" style={{ color: ui.tp }}>
                  <span>{x.l}</span>
                  <span style={{ color: ui.ts }}>{x.t}</span>
                </div>
                <ProgressBar ui={ui} value={x.v} from={x.c} to={x.c} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. GÖREVLER & ÖDEVLER
   ═══════════════════════════════════════════════════════════════════════════ */
function GorevlerOdevler({ ui }: { ui: Ui }) {
  type Filter = 'tumu' | 'bekleyen' | 'tamamlanan';
  const [filter, setFilter] = useState<Filter>('tumu');
  const [items, setItems] = useState([
    { id: 1, title: 'İntegral Fasikülü Test 1-6', subject: 'Matematik', teacher: 'Burak Aksoy', due: 'Yarın 23:59', prio: 'Yüksek', done: false },
    { id: 2, title: 'Modern Fizik Deney Raporu', subject: 'Fizik', teacher: 'Selin Yılmaz', due: '14 Kasım', prio: 'Orta', done: false },
    { id: 3, title: 'Gazlar Karma Test', subject: 'Kimya', teacher: 'Ahmet Demir', due: '16 Kasım', prio: 'Düşük', done: false },
    { id: 4, title: 'Hücre Bölünmeleri Özet Çıkarma', subject: 'Biyoloji', teacher: 'Zeynep Kaya', due: '12 Kasım', prio: 'Orta', done: true },
    { id: 5, title: 'Paragraf Deneme Seti 4', subject: 'Türkçe', teacher: 'Elif Çelik', due: '10 Kasım', prio: 'Düşük', done: true },
  ]);
  const shown = items.filter((i) => (filter === 'tumu' ? true : filter === 'tamamlanan' ? i.done : !i.done));
  const prioTone = (p: string) => (p === 'Yüksek' ? 'coral' : p === 'Orta' ? 'amber' : 'neutral');
  const pending = items.filter((i) => !i.done).length;

  return (
    <>
      <PageHeader ui={ui} title="Görevler & Ödevler" sub={`${pending} bekleyen görevin var • teslim tarihlerini takip et`} />
      <div className="grid grid-cols-3 gap-5 mb-5">
        {[
          { l: 'Bekleyen', v: pending, c: '#FF5A4D' },
          { l: 'Tamamlanan', v: items.length - pending, c: '#10B981' },
          { l: 'Toplam', v: items.length, c: '#8B5CF6' },
        ].map((s, i) => (
          <Card ui={ui} key={s.l} className="p-5" delay={`-${i * 4}s`}>
            <div className="text-3xl font-black" style={{ color: s.c }}>{s.v}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: ui.ts }}>{s.l}</div>
          </Card>
        ))}
      </div>

      <Card ui={ui} className="p-5" delay="-6s">
        <div className="flex items-center gap-2 mb-4">
          {([['tumu', 'Tümü'], ['bekleyen', 'Bekleyen'], ['tamamlanan', 'Tamamlanan']] as [Filter, string][]).map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background: filter === k ? 'linear-gradient(135deg,#5B3FD9,#8B5CF6)' : ui.soft,
                color: filter === k ? '#fff' : ui.ts,
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          {shown.map((it) => (
            <div key={it.id} className="flex items-center gap-4 p-3.5 rounded-2xl border" style={{ borderColor: ui.line, backgroundColor: ui.soft }}>
              <button
                type="button"
                onClick={() => setItems(items.map((x) => (x.id === it.id ? { ...x, done: !x.done } : x)))}
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all"
                style={{ backgroundColor: it.done ? '#10B981' : 'transparent', border: it.done ? '1px solid #10B981' : `1.5px solid ${ui.tm}` }}
                title="Tamamlandı olarak işaretle"
              >
                {it.done && <Check size={14} strokeWidth={3} className="text-white" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-bold truncate" style={{ color: it.done ? ui.tm : ui.tp, textDecoration: it.done ? 'line-through' : 'none' }}>{it.title}</div>
                <div className="text-[11.5px] mt-0.5" style={{ color: ui.ts }}>{it.subject} • {it.teacher} • Son teslim: {it.due}</div>
              </div>
              <Pill ui={ui} tone={prioTone(it.prio) as 'coral' | 'amber' | 'neutral'}>{it.prio}</Pill>
            </div>
          ))}
          {shown.length === 0 && (
            <div className="text-center py-10 text-sm font-medium" style={{ color: ui.ts }}>Bu filtrede görev bulunmuyor 🎉</div>
          )}
        </div>
      </Card>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. OLTVAI (Yapay zeka asistanı)
   ═══════════════════════════════════════════════════════════════════════════ */
function OltvaiAsistan({ ui, user }: { ui: Ui; user: StudentUser | null }) {
  const rawFullName = user?.full_name?.trim() || 'Arda';
  const firstName = rawFullName.split(/\s+/)[0] || 'Öğrenci';
  const capitalizedFirst = firstName.charAt(0).toLocaleUpperCase('tr-TR') + firstName.slice(1).toLocaleLowerCase('tr-TR');

  const [msgs, setMsgs] = useState<{ from: 'ai' | 'me'; text: string }[]>([
    { from: 'ai', text: `Merhaba ${capitalizedFirst}! Ben OLTVAI. Bugün hangi konuda takıldın? Sana adım adım, sorarak ilerleyen bir anlatımla yardımcı olabilirim.` },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setMsgs((m) => [...m, { from: 'me', text: t }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { from: 'ai', text: `"${t}" için önce şunu düşün: bu konuda temel kavramı kendi cümlelerinle nasıl açıklarsın? Cevabına göre eksik halkayı birlikte bulalım.` },
      ]);
      setTyping(false);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, 900);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <>
      <PageHeader ui={ui} title="OLTVAI Asistan" sub="Sokratik yöntemle çalışan kişisel akademik yapay zeka mentörün" right={<Pill ui={ui} tone="green">● Hazır</Pill>} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card ui={ui} className="lg:col-span-8 flex flex-col" style={{ minHeight: 480 }}>
          <div className="p-5 flex flex-col h-full" style={{ minHeight: 480 }}>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[380px] pr-1">
              {msgs.map((m, i) => (
                <div key={i} className={'flex ' + (m.from === 'me' ? 'justify-end' : 'justify-start')}>
                  <div
                    className="max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] font-medium leading-relaxed"
                    style={
                      m.from === 'me'
                        ? { background: 'linear-gradient(135deg,#5B3FD9,#8B5CF6)', color: '#fff', borderBottomRightRadius: 6 }
                        : { backgroundColor: ui.soft, color: ui.tp, borderBottomLeftRadius: 6 }
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl flex gap-1" style={{ backgroundColor: ui.soft }}>
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ui.ts, animationDelay: d * 0.2 + 's' }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="mt-4 flex items-center gap-2 rounded-full px-4 h-12 border"
              style={{ borderColor: ui.line, backgroundColor: ui.soft }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="OLTVAI'ye bir soru sor..."
                className="flex-1 bg-transparent outline-none text-sm font-medium"
                style={{ color: ui.tp }}
              />
              <button type="submit" className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105" style={{ background: 'linear-gradient(135deg,#5B3FD9,#8B5CF6)' }}>
                <Send size={14} />
              </button>
            </form>
          </div>
        </Card>

        <div className="lg:col-span-4 flex flex-col gap-5">
          <Card ui={ui} className="p-5" delay="-5s">
            <CardTitle ui={ui} title="Hızlı Başlangıç" sub="Tek tıkla sormaya başla" />
            <div className="flex flex-col gap-2">
              {['Türevin geometrik yorumunu anlat', 'Deneme netlerimi analiz et', 'Bugün hangi konulara çalışmalıyım?', 'İndüksiyon akımı için soru öner'].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="text-left text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all hover:translate-x-0.5"
                  style={{ backgroundColor: ui.soft, color: ui.tp }}
                >
                  <Sparkles size={12} className="inline mr-2 text-[#8B5CF6]" />
                  {q}
                </button>
              ))}
            </div>
          </Card>
          <Card ui={ui} className="p-5" delay="-10s">
            <CardTitle ui={ui} title="Bu Hafta" />
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl py-3" style={{ backgroundColor: ui.soft }}>
                <div className="text-xl font-black" style={{ color: ui.tp }}>34</div>
                <div className="text-[11px]" style={{ color: ui.ts }}>Sorulan soru</div>
              </div>
              <div className="rounded-xl py-3" style={{ backgroundColor: ui.soft }}>
                <div className="text-xl font-black" style={{ color: ui.tp }}>7</div>
                <div className="text-[11px]" style={{ color: ui.ts }}>Çözülen konu</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   6. SINAV SONUÇLARI
   ═══════════════════════════════════════════════════════════════════════════ */
function SinavSonuclari({ ui }: { ui: Ui }) {
  const exams = [
    { name: 'Kurum Denemesi 1', date: '12 Eki', tyt: 92.5, ayt: 58.0, rank: '1.840' },
    { name: 'Türkiye Geneli 2', date: '26 Eki', tyt: 98.25, ayt: 62.5, rank: '1.420' },
    { name: 'Türkiye Geneli 3', date: '02 Kas', tyt: 101.25, ayt: 66.0, rank: '1.140' },
    { name: 'Kurum Denemesi 4', date: '09 Kas', tyt: 104.5, ayt: 71.5, rank: '720' },
  ];
  return (
    <>
      <PageHeader ui={ui} title="Sınav Sonuçları" sub="Son denemelerinin TYT / AYT net dökümü ve sıralamaların" right={<Pill ui={ui} tone="green">▲ +12 net artış</Pill>} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card ui={ui} className="p-5 lg:col-span-7">
          <CardTitle ui={ui} title="TYT Net Gelişimi" sub="Son 4 deneme" />
          <AreaChart ui={ui} id="sinav" values={exams.map((e) => e.tyt)} labels={exams.map((e) => e.date)} />
        </Card>
        <div className="lg:col-span-5 grid grid-cols-2 gap-5">
          {[
            { l: 'Son TYT Neti', v: '104,5', c: '#8B5CF6' },
            { l: 'Son AYT Neti', v: '71,5', c: '#3B82F6' },
            { l: 'Kurum Sırası', v: '3 / 180', c: '#10B981' },
            { l: 'Türkiye Sırası', v: '720', c: '#FF5A4D' },
          ].map((s, i) => (
            <Card ui={ui} key={s.l} className="p-5" delay={`-${i * 3}s`}>
              <div className="text-2xl font-black" style={{ color: s.c }}>{s.v}</div>
              <div className="text-xs font-medium mt-1" style={{ color: ui.ts }}>{s.l}</div>
            </Card>
          ))}
        </div>

        <Card ui={ui} className="p-5 lg:col-span-12" delay="-6s">
          <CardTitle ui={ui} title="Deneme Geçmişi" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr style={{ color: ui.tm }} className="text-[11px] uppercase tracking-wider">
                  <th className="py-2 font-bold">Deneme</th>
                  <th className="py-2 font-bold">Tarih</th>
                  <th className="py-2 font-bold">TYT Net</th>
                  <th className="py-2 font-bold">AYT Net</th>
                  <th className="py-2 font-bold">Türkiye Sırası</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((e) => (
                  <tr key={e.name} className="border-t" style={{ borderColor: ui.line, color: ui.tp }}>
                    <td className="py-3 font-bold">{e.name}</td>
                    <td className="py-3" style={{ color: ui.ts }}>{e.date}</td>
                    <td className="py-3 font-semibold" style={{ color: '#8B5CF6' }}>{e.tyt}</td>
                    <td className="py-3 font-semibold" style={{ color: '#3B82F6' }}>{e.ayt}</td>
                    <td className="py-3">{e.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   7. YKS NOT ANALİZİ
   ═══════════════════════════════════════════════════════════════════════════ */
function YksNotAnalizi({ ui }: { ui: Ui }) {
  const [target, setTarget] = useState(110);
  const nets = [
    { l: 'Türkçe', cur: 32, max: 40, goal: 36 },
    { l: 'Matematik', cur: 31, max: 40, goal: 36 },
    { l: 'Fen Bilimleri', cur: 16.5, max: 20, goal: 18 },
    { l: 'Sosyal Bilimler', cur: 15, max: 20, goal: 17 },
  ];
  const current = nets.reduce((a, n) => a + n.cur, 0);
  const diff = Math.max(0, target - current);
  return (
    <>
      <PageHeader ui={ui} title="YKS Not Analizi" sub="Hedef: Bilgisayar Mühendisliği • Sayısal puan türü" right={<Pill ui={ui}>Hedef net: {target}</Pill>} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card ui={ui} className="p-5 lg:col-span-4 flex flex-col items-center text-center">
          <div className="w-full"><CardTitle ui={ui} title="Hedefe Yakınlık" sub="TYT toplam net" /></div>
          <Ring ui={ui} pct={Math.min(100, Math.round((current / target) * 100))} color="#8B5CF6" size={140} />
          <div className="mt-4 text-sm font-bold" style={{ color: ui.tp }}>{current} / {target} net</div>
          <div className="text-xs mt-1" style={{ color: ui.ts }}>Hedefe {diff.toFixed(1)} net kaldı</div>
          <div className="mt-4 flex items-center gap-2">
            {[100, 105, 110, 115].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTarget(t)}
                className="px-3 py-1 rounded-full text-xs font-bold transition-all"
                style={{ background: target === t ? 'linear-gradient(135deg,#5B3FD9,#8B5CF6)' : ui.soft, color: target === t ? '#fff' : ui.ts }}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        <Card ui={ui} className="p-5 lg:col-span-8" delay="-5s">
          <CardTitle ui={ui} title="Ders Bazlı Net Analizi" sub="Mevcut net, hedef net ve maksimum" />
          <div className="flex flex-col gap-5">
            {nets.map((n) => (
              <div key={n.l}>
                <div className="flex justify-between text-xs font-semibold mb-1.5" style={{ color: ui.tp }}>
                  <span>{n.l}</span>
                  <span style={{ color: ui.ts }}>{n.cur} / hedef {n.goal} (maks. {n.max})</span>
                </div>
                <div className="relative w-full h-2.5 rounded-full" style={{ backgroundColor: ui.soft }}>
                  <div className="absolute h-full rounded-full" style={{ width: (n.cur / n.max) * 100 + '%', background: 'linear-gradient(90deg,#5B3FD9,#8B5CF6)' }} />
                  <div className="absolute -top-1 w-0.5 h-4.5 rounded" style={{ left: (n.goal / n.max) * 100 + '%', height: 18, backgroundColor: '#FF5A4D' }} title="Hedef" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card ui={ui} className="p-5 lg:col-span-12" delay="-9s">
          <CardTitle ui={ui} title="Tahmini Yerleştirme" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { u: 'Boğaziçi Üniversitesi', b: 'Bilgisayar Müh.', chance: 38 },
              { u: 'İTÜ', b: 'Bilgisayar Müh.', chance: 61 },
              { u: 'ODTÜ', b: 'Bilgisayar Müh.', chance: 54 },
            ].map((x) => (
              <div key={x.u} className="p-4 rounded-2xl" style={{ backgroundColor: ui.soft }}>
                <div className="text-sm font-bold" style={{ color: ui.tp }}>{x.u}</div>
                <div className="text-[11px] mb-3" style={{ color: ui.ts }}>{x.b}</div>
                <ProgressBar ui={ui} value={x.chance} from="#5B3FD9" to="#8B5CF6" />
                <div className="text-[11px] font-semibold mt-1.5" style={{ color: ui.ts }}>Yerleşme olasılığı %{x.chance}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   8. DETAYLI RAPOR
   ═══════════════════════════════════════════════════════════════════════════ */
function DetayliRapor({ ui }: { ui: Ui }) {
  const topics = [
    { l: 'Türev', v: 88 },
    { l: 'İntegral', v: 72 },
    { l: 'Manyetizma', v: 54 },
    { l: 'Elektrokimya', v: 47 },
    { l: 'Genetik', v: 81 },
    { l: 'Paragraf', v: 90 },
  ];
  const col = (v: number) => (v >= 75 ? '#10B981' : v >= 55 ? '#F59E0B' : '#FF5A4D');
  return (
    <>
      <PageHeader ui={ui} title="Detaylı Rapor" sub="Konu bazlı hâkimiyet düzeyin ve yapay zekâ önerileri" right={<Pill ui={ui}>Güncel: 11 Kasım</Pill>} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card ui={ui} className="p-5 lg:col-span-7">
          <CardTitle ui={ui} title="Konu Hâkimiyeti" sub="Son 30 günlük soru performansından hesaplandı" />
          <div className="flex flex-col gap-4">
            {topics.map((t) => (
              <div key={t.l}>
                <div className="flex justify-between text-xs font-semibold mb-1.5" style={{ color: ui.tp }}>
                  <span>{t.l}</span>
                  <span style={{ color: col(t.v) }}>%{t.v}</span>
                </div>
                <ProgressBar ui={ui} value={t.v} from={col(t.v)} to={col(t.v)} />
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-5 flex flex-col gap-5">
          <Card ui={ui} className="p-5" delay="-4s">
            <CardTitle ui={ui} title="Güçlü Yönlerin" />
            <div className="flex flex-wrap gap-2">
              {['Paragraf', 'Türev', 'Genetik'].map((x) => <Pill key={x} ui={ui} tone="green">{x}</Pill>)}
            </div>
          </Card>
          <Card ui={ui} className="p-5" delay="-8s">
            <CardTitle ui={ui} title="Geliştirilmesi Gerekenler" />
            <div className="flex flex-wrap gap-2">
              {['Elektrokimya', 'Manyetizma'].map((x) => <Pill key={x} ui={ui} tone="coral">{x}</Pill>)}
            </div>
          </Card>
          <Card ui={ui} className="p-5" delay="-12s">
            <CardTitle ui={ui} title="OLTVAI Önerisi" />
            <div className="flex gap-3 text-[13px] leading-relaxed font-medium" style={{ color: ui.ts }}>
              <Sparkles size={18} className="shrink-0 text-[#8B5CF6] mt-0.5" />
              <p>Bu hafta Elektrokimya için günde 20 soru ve 1 konu tekrarı planla. Pil potansiyelleri tablosunu ezberlemek yerine yönü sorgula.</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   9. OKULUM
   ═══════════════════════════════════════════════════════════════════════════ */
function Okulum({ ui }: { ui: Ui }) {
  return (
    <>
      <PageHeader ui={ui} title="Okulum" sub="İstanbul Fen Lisesi • 12-A Sayısal" right={<Pill ui={ui} tone="neutral"><MapPin size={11} className="mr-1" />Kadıköy, İstanbul</Pill>} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card ui={ui} className="p-5 lg:col-span-7">
          <CardTitle ui={ui} title="Duyurular" right={<Bell size={16} style={{ color: ui.ts }} />} />
          <div className="flex flex-col gap-3">
            {[
              { t: 'Türkiye Geneli YKS denemesi 13 Kasım Perşembe günü saat 10:15\'te başlayacaktır.', d: 'Bugün', tone: 'coral' as const },
              { t: 'Fizik laboratuvar raporları 14 Kasım\'a kadar teslim edilmelidir.', d: 'Dün', tone: 'purple' as const },
              { t: 'Veli toplantısı 20 Kasım Çarşamba günü 18:00\'de konferans salonunda yapılacaktır.', d: '2 gün önce', tone: 'neutral' as const },
            ].map((a, i) => (
              <div key={i} className="p-3.5 rounded-2xl flex items-start justify-between gap-3" style={{ backgroundColor: ui.soft }}>
                <p className="text-[13px] font-medium leading-relaxed" style={{ color: ui.tp }}>{a.t}</p>
                <Pill ui={ui} tone={a.tone}>{a.d}</Pill>
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-5 flex flex-col gap-5">
          <Card ui={ui} className="p-5" delay="-5s">
            <CardTitle ui={ui} title="Yaklaşan Etkinlikler" right={<CalendarDays size={16} style={{ color: ui.ts }} />} />
            <div className="flex flex-col gap-3">
              {[
                { d: '13', m: 'KAS', t: 'YKS Deneme Sınavı' },
                { d: '20', m: 'KAS', t: 'Veli Toplantısı' },
                { d: '28', m: 'KAS', t: 'Kariyer Günleri' },
              ].map((e) => (
                <div key={e.t} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg,#5B3FD9,#8B5CF6)', color: '#fff' }}>
                    <span className="text-base font-black leading-none">{e.d}</span>
                    <span className="text-[9px] font-bold tracking-wider">{e.m}</span>
                  </div>
                  <span className="text-[13px] font-bold" style={{ color: ui.tp }}>{e.t}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card ui={ui} className="p-5" delay="-10s">
            <CardTitle ui={ui} title="Sınıf Sıralaman" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>
                <Trophy size={26} />
              </div>
              <div>
                <div className="text-2xl font-black" style={{ color: ui.tp }}>3. / 32</div>
                <div className="text-xs" style={{ color: ui.ts }}>Son denemeye göre sınıf sırası</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   10. ÖĞRETMENLER
   ═══════════════════════════════════════════════════════════════════════════ */
function Ogretmenler({ ui }: { ui: Ui }) {
  const [sent, setSent] = useState<string[]>([]);
  const teachers = [
    { n: 'Burak Aksoy', s: 'Matematik', o: 'Salı 14:00 – 15:00', i: 'BA', c: '#8B5CF6' },
    { n: 'Selin Yılmaz', s: 'Fizik', o: 'Çarşamba 13:30 – 14:30', i: 'SY', c: '#3B82F6' },
    { n: 'Ahmet Demir', s: 'Kimya', o: 'Perşembe 14:00 – 15:00', i: 'AD', c: '#10B981' },
    { n: 'Zeynep Kaya', s: 'Biyoloji', o: 'Pazartesi 13:30 – 14:30', i: 'ZK', c: '#F59E0B' },
    { n: 'Elif Çelik', s: 'Türkçe', o: 'Cuma 12:30 – 13:30', i: 'EÇ', c: '#EC4899' },
    { n: 'Murat Şahin', s: 'Tarih', o: 'Salı 12:30 – 13:30', i: 'MŞ', c: '#A16207' },
  ];
  return (
    <>
      <PageHeader ui={ui} title="Öğretmenler" sub="Ders öğretmenlerin, ofis saatleri ve iletişim" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {teachers.map((t, idx) => (
          <Card ui={ui} key={t.n} className="p-5" delay={`-${idx * 2.5}s`}>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-base font-black text-white" style={{ background: `linear-gradient(135deg, ${t.c}, ${t.c}AA)` }}>
                {t.i}
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-bold" style={{ color: ui.tp }}>{t.n}</div>
                <div className="text-xs font-semibold" style={{ color: t.c }}>{t.s} Öğretmeni</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium" style={{ color: ui.ts }}>
              <Clock size={13} /> Ofis saati: {t.o}
            </div>
            <button
              type="button"
              onClick={() => setSent((s) => (s.includes(t.n) ? s : [...s, t.n]))}
              className="mt-4 w-full h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={sent.includes(t.n) ? { backgroundColor: 'rgba(16,185,129,0.15)', color: '#10B981' } : { background: 'linear-gradient(135deg,#5B3FD9,#8B5CF6)', color: '#fff' }}
            >
              {sent.includes(t.n) ? <><CheckCircle2 size={14} /> Mesaj gönderildi</> : <><Mail size={14} /> Mesaj gönder</>}
            </button>
          </Card>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   11. REHBERLİK & PDR
   ═══════════════════════════════════════════════════════════════════════════ */
function Rehberlik({ ui }: { ui: Ui }) {
  const [mood, setMood] = useState<number | null>(null);
  const [booked, setBooked] = useState<string | null>(null);
  const moods = ['😞', '😕', '😐', '🙂', '😄'];
  const slots = ['Pazartesi 10:45', 'Çarşamba 13:30', 'Cuma 11:35'];
  return (
    <>
      <PageHeader ui={ui} title="Rehberlik & PDR" sub="Psikolojik danışmanın ve çalışma stratejisi desteğin" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card ui={ui} className="p-5 lg:col-span-5">
          <CardTitle ui={ui} title="Bugün nasıl hissediyorsun?" sub="Duygu durumun yalnızca rehber öğretmenin ile paylaşılır" />
          <div className="flex items-center justify-between gap-2">
            {moods.map((m, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMood(i)}
                className="w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all hover:scale-110"
                style={{
                  backgroundColor: mood === i ? 'rgba(139,92,246,0.25)' : ui.soft,
                  outline: mood === i ? '2px solid #8B5CF6' : 'none',
                }}
              >
                {m}
              </button>
            ))}
          </div>
          {mood !== null && (
            <p className="mt-4 text-[13px] font-medium" style={{ color: ui.ts }}>
              {mood <= 1 ? 'Zor bir gün gibi görünüyor. İstersen yan taraftan randevu alabilirsin.' : mood === 2 ? 'Dengeli bir gün. Kısa bir nefes molası iyi gelebilir.' : 'Harika! Bu enerjiyi çalışmana yansıt.'}
            </p>
          )}
        </Card>

        <Card ui={ui} className="p-5 lg:col-span-7" delay="-6s">
          <CardTitle ui={ui} title="Rehber Öğretmen Randevusu" sub="Psikolojik Danışman • Ayşe Korkmaz" />
          <div className="flex flex-wrap gap-2.5">
            {slots.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setBooked(s)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                style={{ background: booked === s ? 'linear-gradient(135deg,#5B3FD9,#8B5CF6)' : ui.soft, color: booked === s ? '#fff' : ui.tp }}
              >
                {s}
              </button>
            ))}
          </div>
          {booked && (
            <div className="mt-4 p-3.5 rounded-2xl flex items-center gap-2 text-[13px] font-semibold" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#10B981' }}>
              <CheckCircle2 size={16} /> Randevu talebin gönderildi: {booked}
            </div>
          )}
        </Card>

        <Card ui={ui} className="p-5 lg:col-span-12" delay="-10s">
          <CardTitle ui={ui} title="Çalışma Stratejisi Önerileri" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Clock, t: 'Pomodoro Tekniği', d: '25 dakika odaklan, 5 dakika dinlen. 4 turdan sonra uzun mola ver.' },
              { icon: Target, t: 'Hedef Belirleme', d: 'Haftalık hedeflerini küçük günlük adımlara böl ve her akşam işaretle.' },
              { icon: AlertCircle, t: 'Sınav Kaygısı', d: 'Sınav öncesi nefes egzersizi yap, uykunu ve beslenmeni düzenli tut.' },
            ].map((x) => (
              <div key={x.t} className="p-4 rounded-2xl" style={{ backgroundColor: ui.soft }}>
                <x.icon size={20} className="text-[#8B5CF6] mb-2.5" />
                <div className="text-sm font-bold mb-1" style={{ color: ui.tp }}>{x.t}</div>
                <p className="text-xs leading-relaxed" style={{ color: ui.ts }}>{x.d}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   12. AYARLAR
   ═══════════════════════════════════════════════════════════════════════════ */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0"
      style={{ background: on ? 'linear-gradient(135deg,#5B3FD9,#8B5CF6)' : 'rgba(128,128,128,0.35)' }}
      aria-pressed={on}
    >
      <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300" style={{ left: on ? 22 : 2 }} />
    </button>
  );
}

function Ayarlar({ ui, user }: { ui: Ui; user: StudentUser | null }) {
  const [s, setS] = useState({ bildirim: true, hatirlatici: true, haftalik: false, ai: true, gizli: false });
  const toggle = (k: keyof typeof s) => setS({ ...s, [k]: !s[k] });
  const rows: { k: keyof typeof s; t: string; d: string }[] = [
    { k: 'bildirim', t: 'Anlık Bildirimler', d: 'Ödev, sınav ve duyuru bildirimlerini al' },
    { k: 'hatirlatici', t: 'Günlük Soru Hatırlatıcısı', d: 'Her akşam 20:00\'de hatırlat' },
    { k: 'haftalik', t: 'Haftalık Özet E-postası', d: 'Pazar günü gelişim raporunu e-postayla gönder' },
    { k: 'ai', t: 'OLTVAI Kişiselleştirme', d: 'Önerileri çalışma verilerime göre uyarla' },
    { k: 'gizli', t: 'Profili Gizle', d: 'Sıralama listelerinde adım görünmesin' },
  ];

  const rawFullName = user?.full_name?.trim() || 'Arda Kılıç';
  const formattedFullName = rawFullName
    .split(/\s+/)
    .map(w => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1).toLocaleLowerCase('tr-TR'))
    .join(' ');
  const parts = formattedFullName.split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : formattedFullName.slice(0, 2).toUpperCase();

  const className = user?.class_name || '12-A';
  const studentNum = user?.student_number || '2026-1094';
  const email = user?.email || 'ogrenci@fenlisesi.k12.tr';
  const schoolCode = user?.tenant_code?.toUpperCase() || 'IST-1094';

  return (
    <>
      <PageHeader ui={ui} title="Ayarlar" sub="Hesap, bildirim ve gizlilik tercihlerin" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Card ui={ui} className="p-5 lg:col-span-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white mb-3" style={{ background: 'linear-gradient(135deg,#5B3FD9,#8B5CF6)' }}>{initials}</div>
            <div className="text-lg font-bold" style={{ color: ui.tp }}>{formattedFullName}</div>
            <div className="text-xs mb-4" style={{ color: ui.ts }}>{className} Sayısal • Öğrenci No: {studentNum}</div>
            <Pill ui={ui} tone="green">Hesap doğrulandı</Pill>
          </div>
          <div className="mt-5 pt-4 border-t flex flex-col gap-2.5 text-xs" style={{ borderColor: ui.line, color: ui.ts }}>
            <div className="flex justify-between"><span>E-posta</span><span className="font-semibold" style={{ color: ui.tp }}>{email}</span></div>
            <div className="flex justify-between"><span>Dil</span><span className="font-semibold" style={{ color: ui.tp }}>Türkçe</span></div>
            <div className="flex justify-between"><span>Okul Kodu</span><span className="font-semibold" style={{ color: ui.tp }}>{schoolCode}</span></div>
          </div>
        </Card>

        <Card ui={ui} className="p-5 lg:col-span-8" delay="-6s">
          <CardTitle ui={ui} title="Tercihler" />
          <div className="flex flex-col">
            {rows.map((r, i) => (
              <div key={r.k} className={'flex items-center justify-between gap-4 py-4 ' + (i > 0 ? 'border-t' : '')} style={{ borderColor: ui.line }}>
                <div>
                  <div className="text-[13.5px] font-bold" style={{ color: ui.tp }}>{r.t}</div>
                  <div className="text-xs mt-0.5" style={{ color: ui.ts }}>{r.d}</div>
                </div>
                <Toggle on={s[r.k]} onChange={() => toggle(r.k)} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
