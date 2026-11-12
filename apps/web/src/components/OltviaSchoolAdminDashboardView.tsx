"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  GraduationCap,
  Users,
  UserCheck,
  ShieldCheck,
  Plus,
  Search,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  Phone,
  BookOpen,
  Building2,
  Lock,
  ArrowLeft,
  Key,
  Layers,
  Sparkles,
  School,
  Check,
  ChevronRight
} from "lucide-react";

interface SchoolInfo {
  id: string;
  school_name: string;
  school_code: string;
  schema_name: string;
  is_active: boolean;
  created_at?: string;
}

interface StatsInfo {
  total_users: number;
  students_count: number;
  teachers_count: number;
  parents_count: number;
  classes_count: number;
  classes: string[];
}

interface StudentItem {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  student_number: string;
  grade: string;
  class_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface TeacherItem {
  id: string;
  teacher_id: string;
  full_name: string;
  email: string;
  branch: string;
  title: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface ParentItem {
  id: string;
  parent_id: string;
  full_name: string;
  email: string;
  phone: string;
  student_id?: string;
  student_number?: string;
  student_name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8001";

export default function OltviaSchoolAdminDashboardView() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Aktif okul kodu (URL parametresinden veya yerel depolamadan alınır)
  const [schoolCode, setSchoolCode] = useState<string>("ist-1094");
  const [school, setSchool] = useState<SchoolInfo | null>(null);
  const [stats, setStats] = useState<StatsInfo>({
    total_users: 0,
    students_count: 0,
    teachers_count: 0,
    parents_count: 0,
    classes_count: 0,
    classes: [],
  });

  const [activeTab, setActiveTab] = useState<"students" | "teachers" | "parents">("students");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("ALL");

  // Kullanıcı listeleri
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [parents, setParents] = useState<ParentItem[]>([]);

  // Modal Durumları
  const [modalType, setModalType] = useState<"student" | "teacher" | "parent" | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form Değerleri - Öğrenci
  const [stFullName, setStFullName] = useState("");
  const [stNumber, setStNumber] = useState("");
  const [stGrade, setStGrade] = useState("12");
  const [stClass, setStClass] = useState("12-A");
  const [stEmail, setStEmail] = useState("");
  const [stPassword, setStPassword] = useState("oltvia2026");

  // Form Değerleri - Öğretmen
  const [tcFullName, setTcFullName] = useState("");
  const [tcBranch, setTcBranch] = useState("Matematik");
  const [tcEmail, setTcEmail] = useState("");
  const [tcPhone, setTcPhone] = useState("");
  const [tcPassword, setTcPassword] = useState("oltvia2026");

  // Form Değerleri - Veli
  const [prFullName, setPrFullName] = useState("");
  const [prPhone, setPrPhone] = useState("");
  const [prStudentNumber, setPrStudentNumber] = useState("");
  const [prEmail, setPrEmail] = useState("");
  const [prPassword, setPrPassword] = useState("oltvia2026");

  // Toast zamanlayıcısı
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // URL'den veya LocalStorage'dan okul kodunu al
  useEffect(() => {
    const codeFromUrl = searchParams.get("school_code") || searchParams.get("kod");
    if (codeFromUrl) {
      setSchoolCode(codeFromUrl.toLowerCase().trim());
      localStorage.setItem("oltvia_active_school_code", codeFromUrl.toLowerCase().trim());
    } else {
      const savedCode = localStorage.getItem("oltvia_active_school_code");
      if (savedCode) {
        setSchoolCode(savedCode);
      }
    }
  }, [searchParams]);

  // Verileri çek
  const fetchData = async () => {
    if (!schoolCode) return;
    try {
      setRefreshing(true);

      // 1. Overview & Stats
      const overviewRes = await fetch(`${BACKEND_URL}/api/v1/school-admin/overview?school_code=${encodeURIComponent(schoolCode)}`);
      if (overviewRes.ok) {
        const overviewData = await overviewRes.json();
        setSchool(overviewData.school);
        setStats(overviewData.stats);
      }

      // 2. Users List
      const usersRes = await fetch(`${BACKEND_URL}/api/v1/school-admin/users?school_code=${encodeURIComponent(schoolCode)}&role=all`);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setStudents(usersData.students || []);
        setTeachers(usersData.teachers || []);
        setParents(usersData.parents || []);
      }
    } catch (err: any) {
      console.error("Okul verileri yüklenirken hata:", err);
      setToast({ type: "error", message: "Sunucu ile bağlantı kurulamadı." });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [schoolCode]);

  // Yeni Öğrenci Kaydet
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/school-admin/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: stFullName.trim(),
          student_number: stNumber.trim(),
          grade: stGrade.trim(),
          class_name: stClass.trim().toUpperCase(),
          email: stEmail.trim() || undefined,
          password: stPassword || "oltvia2026",
          school_code: schoolCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Öğrenci oluşturulamadı.");
      }

      setToast({ type: "success", message: `${stFullName} isimli öğrenci başarıyla oluşturuldu!` });
      setModalType(null);
      // Reset form
      setStFullName("");
      setStNumber("");
      setStEmail("");
      fetchData();
    } catch (err: any) {
      setModalError(err.message || "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  // Yeni Öğretmen Kaydet
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/school-admin/teachers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: tcFullName.trim(),
          branch: tcBranch.trim(),
          email: tcEmail.trim().toLowerCase(),
          phone: tcPhone.trim() || undefined,
          password: tcPassword || "oltvia2026",
          school_code: schoolCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Öğretmen oluşturulamadı.");
      }

      setToast({ type: "success", message: `${tcFullName} (${tcBranch}) başarıyla eklendi!` });
      setModalType(null);
      setTcFullName("");
      setTcEmail("");
      setTcPhone("");
      fetchData();
    } catch (err: any) {
      setModalError(err.message || "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  // Yeni Veli Kaydet
  const handleCreateParent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setModalError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/school-admin/parents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: prFullName.trim(),
          phone: prPhone.trim(),
          student_number: prStudentNumber.trim() || undefined,
          email: prEmail.trim() || undefined,
          password: prPassword || "oltvia2026",
          school_code: schoolCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Veli oluşturulamadı.");
      }

      setToast({ type: "success", message: `${prFullName} isimli veli başarıyla kaydedildi!` });
      setModalType(null);
      setPrFullName("");
      setPrPhone("");
      setPrStudentNumber("");
      setPrEmail("");
      fetchData();
    } catch (err: any) {
      setModalError(err.message || "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  // Kullanıcı Sil
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`'${userName}' kullanıcısını bu okul şemasından tamamen silmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/v1/school-admin/users/${userId}?school_code=${encodeURIComponent(schoolCode)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Kullanıcı silinemedi.");
      }
      setToast({ type: "success", message: data.message || "Kullanıcı silindi." });
      fetchData();
    } catch (err: any) {
      alert("Hata: " + (err.message || "Kullanıcı silinirken hata oluştu."));
    }
  };

  // Filtrelenmiş Öğrenci Listesi
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.student_number.includes(searchQuery) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass === "ALL" || s.class_name === selectedClass;
      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, selectedClass]);

  // Filtrelenmiş Öğretmen Listesi
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      return (
        t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [teachers, searchQuery]);

  // Filtrelenmiş Veli Listesi
  const filteredParents = useMemo(() => {
    return parents.filter((p) => {
      return (
        p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery) ||
        (p.student_name && p.student_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.student_number && p.student_number.includes(searchQuery))
      );
    });
  }, [parents, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-16">
      {/* Toast Bildirimi */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border animate-in slide-in-from-top-2 text-xs font-semibold ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50"
              : "bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/50"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 size={16} className="text-emerald-400" /> : <AlertCircle size={16} className="text-rose-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono text-[11px] font-bold tracking-wide">
                KURUM KODU: {school?.school_code || schoolCode}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                İzole Şema: {school?.schema_name || `schema_${schoolCode}`}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <School className="w-8 h-8 text-purple-400 shrink-0" />
              <span>{school?.school_name || "Okul İdaresi Yönetim Portalı"}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Multi-Tenant mimari altında izole okul şeması ve dinamik rol yönetimi (Öğrenci, Öğretmen, Veli)
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => router.push("/superadmin")}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/60 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>SuperAdmin'e Dön</span>
            </button>
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="p-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
              title="Verileri Yenile"
            >
              <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Kayıtlı Öğrenci</span>
              <GraduationCap size={16} className="text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{stats.students_count}</div>
            <div className="text-[10px] text-purple-400/80 mt-0.5">Aktif öğrenci hesabı</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Öğretmen Kadrosu</span>
              <Users size={16} className="text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{stats.teachers_count}</div>
            <div className="text-[10px] text-indigo-400/80 mt-0.5">Farklı branşlarda</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Kayıtlı Veli</span>
              <UserCheck size={16} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{stats.parents_count}</div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5">Öğrenciyle eşleştirilmiş</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Toplam Sınıf & Şube</span>
              <Layers size={16} className="text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{stats.classes_count}</div>
            <div className="text-[10px] text-amber-400/80 mt-0.5">
              {stats.classes.length > 0 ? stats.classes.slice(0, 3).join(", ") : "Henüz sınıf yok"}
            </div>
          </div>
        </div>
      </div>

      {/* Ana Eylem Butonları & Tablar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tab Seçicileri */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <button
            onClick={() => { setActiveTab("students"); setSearchQuery(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "students"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <GraduationCap size={15} />
            <span>Öğrenciler ({stats.students_count})</span>
          </button>
          <button
            onClick={() => { setActiveTab("teachers"); setSearchQuery(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "teachers"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users size={15} />
            <span>Öğretmenler ({stats.teachers_count})</span>
          </button>
          <button
            onClick={() => { setActiveTab("parents"); setSearchQuery(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "parents"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserCheck size={15} />
            <span>Veliler ({stats.parents_count})</span>
          </button>
        </div>

        {/* Hızlı Ekle Butonları */}
        <div className="flex items-center gap-2">
          {activeTab === "students" && (
            <button
              onClick={() => { setModalError(null); setModalType("student"); }}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Yeni Öğrenci Ekle</span>
            </button>
          )}
          {activeTab === "teachers" && (
            <button
              onClick={() => { setModalError(null); setModalType("teacher"); }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Yeni Öğretmen Ekle</span>
            </button>
          )}
          {activeTab === "parents" && (
            <button
              onClick={() => { setModalError(null); setModalType("parent"); }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Yeni Veli Ekle</span>
            </button>
          )}
        </div>
      </div>

      {/* Arama ve Filtreleme Çubuğu */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "students"
                ? "Öğrenci adı, no veya e-posta ara..."
                : activeTab === "teachers"
                ? "Öğretmen adı, branş veya e-posta ara..."
                : "Veli adı, telefon veya bağlı öğrenci ara..."
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
          />
        </div>

        {activeTab === "students" && stats.classes.length > 0 && (
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-xs text-slate-400 shrink-0">Şube:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">Tüm Şubeler ({stats.students_count})</option>
              {stats.classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TABLO GÖRÜNÜMÜ: ÖĞRENCİLER */}
      {activeTab === "students" && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Öğrenci No</th>
                  <th className="py-3 px-4">Adı Soyadı</th>
                  <th className="py-3 px-4">Sınıf & Şube</th>
                  <th className="py-3 px-4">E-posta / Kimlik</th>
                  <th className="py-3 px-4">Durum</th>
                  <th className="py-3 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <GraduationCap className="w-10 h-10 mx-auto mb-2 text-slate-600 opacity-60" />
                      <p className="text-sm font-semibold text-slate-400">Henüz kayıtlı öğrenci bulunamadı.</p>
                      <p className="text-xs text-slate-600 mt-1">Yeni bir öğrenci oluşturmak için yukarıdaki butonu kullanın.</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-purple-400">{st.student_number}</td>
                      <td className="py-3.5 px-4 font-semibold text-white">{st.full_name}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-300 font-mono text-[11px]">
                          {st.class_name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{st.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Aktif
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(st.id, st.full_name)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-600/80 border border-rose-500/20 hover:border-rose-600 transition-all cursor-pointer"
                          title="Öğrenciyi Sil"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABLO GÖRÜNÜMÜ: ÖĞRETMENLER */}
      {activeTab === "teachers" && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Adı Soyadı</th>
                  <th className="py-3 px-4">Branş</th>
                  <th className="py-3 px-4">Unvan</th>
                  <th className="py-3 px-4">Kurumsal E-posta</th>
                  <th className="py-3 px-4">Durum</th>
                  <th className="py-3 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <Users className="w-10 h-10 mx-auto mb-2 text-slate-600 opacity-60" />
                      <p className="text-sm font-semibold text-slate-400">Henüz kayıtlı öğretmen bulunamadı.</p>
                      <p className="text-xs text-slate-600 mt-1">Öğretmen eklemek için 'Yeni Öğretmen Ekle' butonunu kullanın.</p>
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((tc) => (
                    <tr key={tc.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">{tc.full_name}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-medium">
                          {tc.branch}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{tc.title || "Öğretmen"}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{tc.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Aktif
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(tc.id, tc.full_name)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-600/80 border border-rose-500/20 hover:border-rose-600 transition-all cursor-pointer"
                          title="Öğretmeni Sil"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABLO GÖRÜNÜMÜ: VELİLER */}
      {activeTab === "parents" && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Veli Adı Soyadı</th>
                  <th className="py-3 px-4">Telefon (Giriş Kimliği)</th>
                  <th className="py-3 px-4">Bağlı Öğrenci</th>
                  <th className="py-3 px-4">E-posta</th>
                  <th className="py-3 px-4">Durum</th>
                  <th className="py-3 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredParents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <UserCheck className="w-10 h-10 mx-auto mb-2 text-slate-600 opacity-60" />
                      <p className="text-sm font-semibold text-slate-400">Henüz kayıtlı veli bulunamadı.</p>
                      <p className="text-xs text-slate-600 mt-1">Öğrenci velisi eklemek için 'Yeni Veli Ekle' butonunu kullanın.</p>
                    </td>
                  </tr>
                ) : (
                  filteredParents.map((pr) => (
                    <tr key={pr.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">{pr.full_name}</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">{pr.phone}</td>
                      <td className="py-3.5 px-4">
                        {pr.student_name ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-slate-200">{pr.student_name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                              #{pr.student_number}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Bağlı öğrenci yok</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{pr.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Aktif
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(pr.id, pr.full_name)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-600/80 border border-rose-500/20 hover:border-rose-600 transition-all cursor-pointer"
                          title="Veliyi Sil"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          MODAL 1: YENİ ÖĞRENCİ EKLEME MODALI
         ──────────────────────────────────────────────────────────── */}
      {modalType === "student" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap size={18} className="text-purple-400" />
                Yeni Öğrenci Profili Tanımla
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStudent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Öğrenci Adı Soyadı <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Arda Kılıç"
                  value={stFullName}
                  onChange={(e) => setStFullName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Öğrenci No <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 20261048"
                    value={stNumber}
                    onChange={(e) => setStNumber(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-purple-400 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sınıf & Şube <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 12-A"
                    value={stClass}
                    onChange={(e) => setStClass(e.target.value.toUpperCase())}
                    className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  E-posta (Opsiyonel)
                </label>
                <input
                  type="email"
                  placeholder={`s${stNumber || "no"}@${schoolCode}.olvia.internal`}
                  value={stEmail}
                  onChange={(e) => setStEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Boş bırakılırsa kurum uzantılı e-posta otomatik atanır.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Giriş Şifresi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={stPassword}
                  onChange={(e) => setStPassword(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs text-white font-semibold shadow-lg shadow-purple-600/30 disabled:opacity-50"
                >
                  {submitting ? "Oluşturuluyor..." : "Öğrenciyi Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          MODAL 2: YENİ ÖĞRETMEN EKLEME MODALI
         ──────────────────────────────────────────────────────────── */}
      {modalType === "teacher" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users size={18} className="text-indigo-400" />
                Yeni Öğretmen Profili Tanımla
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateTeacher} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Öğretmen Adı Soyadı <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Zeynep Kaya"
                  value={tcFullName}
                  onChange={(e) => setTcFullName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Branş / Uzmanlık Alanı <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Matematik, Fizik, Türk Dili..."
                  value={tcBranch}
                  onChange={(e) => setTcBranch(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kurumsal E-posta (Giriş Kimliği) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="zeynep.kaya@fenlisesi.k12.tr"
                  value={tcEmail}
                  onChange={(e) => setTcEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-400 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Telefon Numarası (Opsiyonel)
                </label>
                <input
                  type="text"
                  placeholder="05321112233"
                  value={tcPhone}
                  onChange={(e) => setTcPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Giriş Şifresi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={tcPassword}
                  onChange={(e) => setTcPassword(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                >
                  {submitting ? "Oluşturuluyor..." : "Öğretmeni Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          MODAL 3: YENİ VELİ EKLEME MODALI
         ──────────────────────────────────────────────────────────── */}
      {modalType === "parent" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck size={18} className="text-emerald-400" />
                Yeni Veli Profili Tanımla
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateParent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Veli Adı Soyadı <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Selim Yılmaz"
                  value={prFullName}
                  onChange={(e) => setPrFullName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Telefon Numarası (Giriş Kimliği) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: 05321234567"
                  value={prPhone}
                  onChange={(e) => setPrPhone(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bağlanacak Öğrenci Numarası
                </label>
                <input
                  type="text"
                  placeholder="Örn: 20261048 (veya listeden seçin)"
                  value={prStudentNumber}
                  onChange={(e) => setPrStudentNumber(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                {students.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-h-20 overflow-y-auto">
                    {students.slice(0, 6).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setPrStudentNumber(s.student_number)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                          prStudentNumber === s.student_number
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {s.full_name} (#{s.student_number})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  E-posta (Opsiyonel)
                </label>
                <input
                  type="email"
                  placeholder="veli@example.com"
                  value={prEmail}
                  onChange={(e) => setPrEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Giriş Şifresi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={prPassword}
                  onChange={(e) => setPrPassword(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-semibold shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                >
                  {submitting ? "Oluşturuluyor..." : "Veliyi Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
