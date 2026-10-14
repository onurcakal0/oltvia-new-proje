"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Rocket, Network, Shield, Building2, Sparkles, Brain, Cpu, 
  ChevronRight, Target, Flame, Trophy, Gamepad2,
  Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, 
  FileText, Lock, X, Check, ArrowRight
} from 'lucide-react';

export default function OltivaLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', role: 'Öğrenci', message: '' });
  const [legalTab, setLegalTab] = useState<'terms' | 'conditions' | 'privacy'>('terms');
  
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
    <div className="min-h-screen bg-[#14161A] text-[#F2F1ED] font-serif selection:bg-[#FF5A4D]/30 overflow-x-hidden">

      {/* Animated Mesh / Glowing Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF5A4D]/15 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#8B6CFF]/15 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#14161A]/50 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform hover:scale-105 transition-transform cursor-pointer">
              <path d="M 78 28 A 36 36 0 1 0 78 72" stroke="#F2F1ED" strokeWidth="16" />
              <circle cx="78" cy="28" r="8" fill="#8B6CFF" />
              <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
              <circle cx="45" cy="40" r="10" fill="#F2F1ED" />
              <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="#F2F1ED" />
            </svg>
            <span className="text-2xl font-black tracking-widest text-[#F2F1ED] font-sans">OLTVIA</span>
          </div>
          
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#9CA3AF] tracking-wide">
            <a href="#ozellikler" className="hover:text-[#FF5A4D] transition-colors">Özellikler</a>
            <a href="#girisler" className="hover:text-[#FF5A4D] transition-colors">Girişler</a>
            <a href="#misyonumuz" className="hover:text-[#FF5A4D] transition-colors">Misyonumuz</a>
            <a href="#sss" className="hover:text-[#FF5A4D] transition-colors">S.S.S</a>
            <a href="#yasal" className="hover:text-[#FF5A4D] transition-colors">Şartlar & Gizlilik</a>
            <a href="#iletisim" className="hover:text-[#F2F1ED] transition-colors">Bize Ulaşın</a>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="hidden lg:block border-l border-white/[0.05] pl-6">
              <span className="text-xs font-bold tracking-[0.3em] uppercase bg-gradient-to-r from-[#9CA3AF] via-[#F2F1ED] to-[#9CA3AF] text-transparent bg-clip-text animate-slogan-flow">
                Beyond What You Know
              </span>
            </div>
            
            <Link 
              href="/giris?rol=ogrenci"
              className="px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold uppercase tracking-wider text-white hover:border-[#FF5A4D]/50 transition-all hover:scale-105 shadow-md flex items-center gap-1.5"
            >
              <span>Giriş Yap</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#FF5A4D]" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-32 pb-48 text-center flex flex-col items-center relative min-h-[50vh] justify-center reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="grid w-full max-w-5xl place-items-center group cursor-default">
            <h1 className="col-start-1 row-start-1 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:blur-[24px] group-hover:opacity-0 group-hover:scale-90 text-center z-10 select-none flex flex-col items-center justify-center w-full">
              <div className="w-full max-w-4xl px-2 py-4 flex items-center justify-center drop-shadow-[0_0_50px_rgba(255,90,95,0.35)]">
                <img 
                  src="/beyond-learning.svg" 
                  alt="Beyond Learning" 
                  className="w-full h-auto max-h-[160px] object-contain select-none pointer-events-none drop-shadow-[0_0_35px_rgba(139,108,255,0.3)]" 
                />
              </div>
              <span className="block font-serif text-xs md:text-sm font-medium uppercase tracking-[0.35em] text-[#9CA3AF] mt-3 opacity-80">
                BEYOND WHAT YOU KNOW
              </span>
            </h1>
            
            <p className="col-start-1 row-start-1 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 blur-[20px] scale-110 group-hover:opacity-100 group-hover:blur-0 group-hover:scale-100 text-2xl md:text-3xl lg:text-4xl text-[#F2F1ED] leading-relaxed font-normal z-20 text-center max-w-5xl px-4 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] font-serif tracking-wide">
              OLTVIA, yapay zeka gücüyle öğrencinin hızına, hislerine ve hedeflerine anında <span className="text-[#FF5A4D] italic font-semibold">adapte olan</span> yenilikçi bir ekosistemdir.
            </p>
          </div>
        </section>

        {/* 4 ENTRY PORTALS */}
        <section id="girisler" className="scroll-mt-28 max-w-7xl mx-auto px-6 mb-40 relative reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Öğrenci", role: "ogrenci", icon: Rocket, desc: "Sokratik Mentör & Hedef Rotası" },
              { title: "Öğretmen", role: "ogretmen", icon: Network, desc: "Sınıf Analitiği & Ödev Yönetimi" },
              { title: "Veli", role: "veli", icon: Shield, desc: "Gelişim Raporları & Odaklanma" },
              { title: "Okul İdaresi", role: "kurumsal", icon: Building2, desc: "Okul Lisansları & Kota Takibi" }
            ].map((portal, idx) => (
              <div key={idx} className="group relative rounded-[2rem] p-[1px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(139,92,246,0.2)] bg-white/[0.05] hover:bg-gradient-to-br hover:from-[#FF5A4D] hover:to-[#8B6CFF]" style={{ transitionDelay: (idx * 100) + 'ms' }}>
                <Link 
                  href={'/giris?rol=' + portal.role} 
                  className="relative w-full h-full flex flex-col items-center justify-center p-10 bg-[#14161A]/90 backdrop-blur-[16px] rounded-[31px] text-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-inner">
                    <portal.icon size={36} className="text-[#F2F1ED] group-hover:text-[#FF5A4D] transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-[#F2F1ED] mb-2">{portal.title}</h3>
                  <p className="text-xs text-[#9CA3AF] max-w-[200px] leading-relaxed mb-6 opacity-75 group-hover:opacity-100 transition-opacity">
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
                <span className="text-[#F2F1ED]">Sokratik</span>
                <span className="text-[#F2F1ED] flex items-center relative">
                  OLTV
                  <span className="inline-flex items-center relative ml-[1px]">
                    <span className="animate-[swap-i_8s_infinite] inline-block relative z-10">İ</span>
                    <span className="animate-[swap-a_8s_infinite] inline-block relative">A</span>
                  </span>
                </span>
              </h2>
              <p className="text-[#9CA3AF] text-lg leading-relaxed font-medium">
                Öğrenciye doğrudan cevabı vermek yerine, onu düşünmeye iten sorular sorar. Yüksek yapay zeka zekasıyla anlama hızına göre benzersiz diyaloglar kurar.
              </p>
            </div>
            
            <div className="flex-1 w-full">
              <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent p-[1px]">
                <div className="absolute inset-0 bg-[#8B6CFF]/20 blur-[80px] -z-10 rounded-full" />
                <div className="rounded-[23px] bg-[#14161A]/90 backdrop-blur-xl p-8 h-96 flex flex-col justify-end relative overflow-hidden border border-white/[0.05] shadow-2xl">
                  
                  <div className="absolute top-4 left-4 right-4 flex items-center gap-4 border-b border-white/[0.05] pb-6 bg-[#14161A]/50 backdrop-blur-md z-20">
                    <div className="w-10 h-10 rounded-full bg-[#14161A] flex items-center justify-center shadow-[0_0_15px_rgba(139,108,255,0.4)] border border-white/5">
                      <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 78 28 A 36 36 0 1 0 78 72" stroke="#F2F1ED" strokeWidth="16" />
                        <circle cx="78" cy="28" r="8" fill="#8B6CFF" />
                        <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
                        <circle cx="45" cy="40" r="10" fill="#F2F1ED" />
                        <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="#F2F1ED" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-base font-bold text-[#F2F1ED] tracking-wide">Oltvia Zeka</span>
                      <span className="block text-xs text-[#8B6CFF] font-medium mt-1">12. Sınıf İleri Matematik - Limit</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 z-10 pt-20">
                    {/* User Message */}
                    <div className="opacity-0 animate-[chat-loop-1_12s_infinite] bg-white/[0.03] border border-white/[0.05] rounded-3xl rounded-tr-sm p-4 w-[90%] ml-auto backdrop-blur-sm">
                      <p className="text-sm text-[#F2F1ED] font-medium leading-relaxed">
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
                      <div className="opacity-0 animate-[chat-loop-2_12s_infinite] bg-[#8B6CFF]/10 border border-[#8B6CFF]/20 rounded-3xl rounded-tl-sm p-4 w-[95%] backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                        <p className="text-sm text-[#E9D5FF] font-medium leading-relaxed">
                          Harika bir soru! L'Hopital bazen ezbere kaçabilir. Birim çember üzerinde çok küçük bir <span className="font-bold text-white">x açısı</span> çizdiğini hayal et. Sence bu açının gördüğü <span className="italic text-white">yay uzunluğu (x)</span> ile üçgenin yüksekliği <span className="italic text-white">(sin x)</span> birbirine nasıl yaklaşır?
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
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#F2F1ED]">
                Sıfır Sapma ile <span className="text-[#FF5A4D]">Hedef Rotası</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg leading-relaxed font-medium">
                Öğrencinin mevcut TYT-AYT netleri ile hayalindeki üniversitenin gerektirdiği net eğrisi arasındaki farkı milimetrik olarak analiz eder. Sistemin tek bir amacı vardır: Eksikleri anında tespit ederek bu iki eğriyi kusursuzca birleştirmek.
              </p>
            </div>
            
            <div className="flex-1 w-full">
              <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent p-[1px]">
                <div className="absolute inset-0 bg-[#FF5A4D]/20 blur-[80px] -z-10 rounded-full" />
                
                <div className="rounded-[23px] bg-[#14161A]/90 backdrop-blur-xl h-[420px] flex flex-col relative overflow-hidden border border-white/[0.05] shadow-2xl group cursor-crosshair">
                  
                  {/* Header */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20 transition-opacity duration-500 group-hover:opacity-0">
                     <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-[#FF5A4D] animate-pulse shadow-[0_0_10px_#FF5A4D]"></div>
                       <span className="text-sm font-bold tracking-wide text-white">TYT/AYT Gelişim Grafiği</span>
                     </div>
                     <span className="text-xs font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[#9CA3AF]">
                       Detay için üzerine gel
                     </span>
                  </div>

                  {/* Graph Container (Zooms in on hover) */}
                  <div className="absolute inset-0 pt-20 pb-10 px-8 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.3] group-hover:-translate-y-4 group-hover:-translate-x-8">
                    
                    {/* Y-Axis Labels */}
                    <div className="absolute left-4 top-16 bottom-12 flex flex-col justify-between text-[10px] font-bold text-white/20 transition-opacity duration-500 group-hover:opacity-0">
                      <span>120</span>
                      <span>90</span>
                      <span>60</span>
                      <span>30</span>
                    </div>

                    <div className="relative w-full h-full mt-4">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
                        {/* Grid Lines */}
                        <line x1="0" y1="0" x2="400" y2="0" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="0" y1="66" x2="400" y2="66" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="0" y1="133" x2="400" y2="133" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        
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
                          <line x1="150" y1="100" x2="150" y2="145" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3" />
                          {/* Target Node */}
                          <circle cx="150" cy="100" r="5" fill="#14161A" stroke="#FF5A4D" strokeWidth="2" />
                          <rect x="90" y="60" width="120" height="30" rx="4" fill="#FF5A4D" opacity="0.15" />
                          <text x="150" y="80" fill="#FF5A4D" fontSize="10" fontWeight="bold" textAnchor="middle">Hedef: 85 Net</text>
                          {/* Current Node */}
                          <circle cx="150" cy="145" r="5" fill="#8B6CFF" stroke="#fff" strokeWidth="2" filter="drop-shadow(0 0 4px #8B6CFF)" />
                          <rect x="90" y="160" width="120" height="30" rx="4" fill="#8B6CFF" opacity="0.15" />
                          <text x="150" y="180" fill="#E9D5FF" fontSize="10" fontWeight="bold" textAnchor="middle">Gerçekleşen: 65 Net</text>
                        </g>

                        {/* Data Point 2: The Future Convergence (May) */}
                        <g className="transition-all duration-700 opacity-0 group-hover:opacity-100" style={{ transitionDelay: '500ms' }}>
                          <circle cx="350" cy="55" r="5" fill="#14161A" stroke="#FF5A4D" strokeWidth="2" />
                          <rect x="290" y="15" width="120" height="30" rx="4" fill="#FF5A4D" opacity="0.15" />
                          <text x="350" y="35" fill="#FF5A4D" fontSize="10" fontWeight="bold" textAnchor="middle">YKS Hedefi: 110 Net</text>
                        </g>
                      </svg>
                    </div>

                    {/* X-Axis Labels */}
                    <div className="absolute bottom-4 left-8 right-8 flex justify-between text-[10px] font-bold text-white/30 transition-opacity duration-500 group-hover:opacity-0 uppercase tracking-widest">
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
        
        
          {/* Feature 3: OLTVIA Nedir? */}
          <div className="flex flex-col lg:flex-row items-center gap-20 reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex-1 space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Target size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#F2F1ED]">
                OLTVIA <span className="text-[#8B6CFF]">Nedir?</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg leading-relaxed font-medium">
                OLTVIA, sınırları reddeden öğrencilerin yeni nesil eğitim ekosistemidir. Klasik ve sıkıcı müfredatların ötesine geçerek, başarıyı asla şansa bırakmaz. <span className="text-white font-bold">Disiplin, özveri ve yapay zeka</span> gücünü bir araya getirerek öğrenciyi tam 12'den vurması gereken hedeflere odaklar.
              </p>
            </div>
            
            <div className="flex-1 w-full">
              <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent p-[1px]">
                <div className="absolute inset-0 bg-[#FF5A4D]/10 blur-[80px] -z-10 rounded-full" />
                
                <div className="rounded-[23px] bg-[#14161A]/90 backdrop-blur-xl h-[420px] relative overflow-hidden border border-white/[0.05] shadow-2xl group cursor-crosshair">
                  
                  {/* Background Grid Lines */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center z-0">
                     <div className="w-full h-[1px] bg-white/20 absolute"></div>
                     <div className="h-full w-[1px] bg-white/20 absolute"></div>
                  </div>

                  {/* Overlay Text */}
                  <div className="absolute top-6 left-6 z-50 transition-opacity duration-500 group-hover:opacity-0">
                     <span className="text-xs font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[#9CA3AF]">
                       Hedefleri vurmak için üzerine gel
                     </span>
                  </div>

                  {/* The Interactive Container */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    
                    {/* The FLASH LAYER (Flashes white on impact) */}
                    <div className="absolute inset-0 bg-white z-40 opacity-0 pointer-events-none animate-flash"></div>

                    {/* The DARTBOARD LAYER (Earthquake shakes and darkens at 1.2s) */}
                    <div className="relative w-full h-full flex items-center justify-center z-10 animate-earthquake">
                      
                      {/* Glowing Cracks Overlay (Appears on impact, inside the shaking board) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 animate-cracks z-30 pointer-events-none">
                         <svg className="w-[300px] h-[300px] drop-shadow-[0_0_15px_#FF5A4D]" viewBox="0 0 200 200">
                            <path d="M100,100 L115,80 L110,60 L140,20 L130,0" stroke="#FF5A4D" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                            <path d="M100,100 L80,110 L50,95 L20,120 L0,110" stroke="#FF5A4D" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                            <path d="M100,100 L115,120 L110,140 L160,180 L150,200" stroke="#FF5A4D" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                            <path d="M100,100 L85,85 L60,90 L40,40 L20,30" stroke="#FF5A4D" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                            <path d="M100,100 L130,110 L160,90 L180,110 L200,90" stroke="#FF5A4D" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                            
                            {/* Minor branching cracks */}
                            <path d="M110,60 L130,65" stroke="#FF5A4D" strokeWidth="1" fill="none" strokeLinecap="round" />
                            <path d="M80,110 L70,130 L50,150" stroke="#FF5A4D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                            <path d="M115,120 L140,115" stroke="#FF5A4D" strokeWidth="1" fill="none" strokeLinecap="round" />
                            <path d="M60,90 L40,100" stroke="#FF5A4D" strokeWidth="1" fill="none" strokeLinecap="round" />
                         </svg>
                      </div>

                      {/* The Dartboard Rings */}
                      <div className="relative flex items-center justify-center scale-90 md:scale-100 z-10">
                        <div className="w-80 h-80 rounded-full border border-white/5 flex items-center justify-center">
                          <div className="w-60 h-60 rounded-full border border-white/10 flex items-center justify-center">
                            <div className="w-40 h-40 rounded-full border border-[#8B6CFF]/30 bg-[#8B6CFF]/5 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                              <div className="w-20 h-20 rounded-full border border-[#FF5A4D]/50 bg-[#FF5A4D]/10 flex items-center justify-center">
                                {/* Bullseye */}
                                <div className="w-8 h-8 rounded-full bg-[#FF5A4D] shadow-[0_0_20px_#FF5A4D] animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Darts (Inside the shattering layer so they shake and darken with it) */}
                      
                      {/* Dart 1: Disiplin */}
                      <div className="absolute top-[32%] left-[42%] opacity-0 animate-dart1 z-20">
                        <div className="flex items-center -translate-y-1/2 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                          <div className="w-0 h-0 border-y-[4px] border-y-transparent border-r-[12px] border-r-white"></div>
                          <div className="w-16 h-1 bg-gradient-to-l from-transparent to-white"></div>
                          <div className="bg-[#8B6CFF] px-2 py-0.5 rounded-sm text-[10px] font-black text-white tracking-widest">DİSİPLİN</div>
                        </div>
                      </div>

                      {/* Dart 2: Özveri */}
                      <div className="absolute top-[68%] left-[45%] opacity-0 animate-dart2 z-20">
                        <div className="flex items-center -translate-y-1/2 drop-shadow-[0_0_10px_rgba(14,165,233,0.5)]">
                          <div className="w-0 h-0 border-y-[4px] border-y-transparent border-r-[12px] border-r-white"></div>
                          <div className="w-12 h-1 bg-gradient-to-l from-transparent to-white"></div>
                          <div className="bg-[#0EA5E9] px-2 py-0.5 rounded-sm text-[10px] font-black text-white tracking-widest">ÖZVERİ</div>
                        </div>
                      </div>

                      {/* Dart 3: Başarı (Hits Bullseye) */}
                      <div className="absolute top-[50%] left-[50%] opacity-0 animate-dart3 z-40">
                        <div className="flex items-center -translate-y-1/2 drop-shadow-[0_0_20px_rgba(255,90,95,0.8)]">
                          {/* BAŞARI DART */}
                          <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[20px] border-r-[#FF5A4D]"></div>
                          <div className="w-24 h-1.5 bg-gradient-to-l from-transparent to-[#FF5A4D]"></div>
                          <div className="bg-[#FF5A4D] px-4 py-1.5 rounded-sm text-[12px] font-black text-white tracking-widest shadow-[0_0_20px_#FF5A4D]">BAŞARI</div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Vignette Overlay */}
                  <div className="absolute inset-0 pointer-events-none rounded-[23px] shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] z-50"></div>

                </div>
              </div>
            </div>
          </div>

          {/* Feature 4: Oyunlaştırma & Streak */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] mt-40">
            
            {/* Left: Streak Animation */}
            <div className="col-span-1">
              <div className="bg-[#14161A]/90 border border-white/[0.05] rounded-[23px] p-8 h-[420px] flex flex-col justify-center items-center shadow-2xl relative overflow-hidden group cursor-crosshair">
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF5A4D]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div className="text-[#9CA3AF] text-xs font-bold uppercase tracking-[0.3em] mb-10 z-10">Günlük Seri</div>
                
                <div className="flex items-center gap-2 md:gap-3 z-10">
                  {["Pzt", "Sal", "Çar", "Per"].map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                       <Flame size={24} className="text-[#FF5A4D] drop-shadow-[0_0_8px_rgba(255,90,95,0.8)]" />
                       <span className="text-[10px] text-white/50 font-bold uppercase">{d}</span>
                    </div>
                  ))}
                  
                  {/* Today (Animates on hover) */}
                  <div className="flex flex-col items-center gap-3 relative">
                     <div className="absolute inset-0 bg-[#FF5A4D] blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-1000 delay-300 rounded-full scale-150"></div>
                     <Flame size={28} className="text-white/10 group-hover:text-[#FF5A4D] group-hover:drop-shadow-[0_0_15px_rgba(255,90,95,1)] transition-colors duration-1000 delay-300 relative z-10 group-hover:scale-110" />
                     <span className="text-[10px] text-white/50 font-black group-hover:text-white transition-colors duration-1000 delay-300 uppercase">Cum</span>
                  </div>
                  
                  {["Cmt", "Paz"].map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                       <Flame size={24} className="text-white/10" />
                       <span className="text-[10px] text-white/20 font-bold uppercase">{d}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 text-center z-10">
                  <div className="text-[6rem] font-black leading-none relative flex justify-center items-center h-[100px] overflow-hidden">
                    <span className="absolute text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 group-hover:-translate-y-full group-hover:opacity-0 transition-all duration-[800ms] delay-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]">12</span>
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
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#F2F1ED] mb-6">
                Oyunlaştırılmış <span className="text-[#F59E0B]">Eğitim</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg leading-relaxed font-medium">
                Öğrenmeyi sıkıcı bir zorunluluk olmaktan çıkarıp, bağımlılık yapan bir serüvene dönüştürüyoruz. Kesintisiz çalışma serilerini <span className="text-[#FF5A4D] font-bold">(Streak)</span> koruyarak motivasyonunu zirvede tut ve kendi sınıfının liderlik tablosunda kıyasıya bir rekabete katıl!
              </p>
            </div>

            {/* Right: Leaderboard Animation */}
            <div className="col-span-1">
              <div className="bg-[#14161A]/90 border border-white/[0.05] rounded-[23px] p-8 h-[420px] flex flex-col justify-center shadow-2xl relative overflow-hidden group cursor-crosshair">
                <div className="absolute inset-0 bg-gradient-to-t from-[#F59E0B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4 z-10">
                  <span className="text-white text-xs font-bold tracking-[0.2em] uppercase">10/A SINIFI LİDERLERİ</span>
                  <Trophy className="text-[#F59E0B] w-5 h-5 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                </div>

                <div className="relative h-56 w-full z-10">
                   {/* Row 1 (Drops to 2) */}
                   <div className="absolute top-0 w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 transition-all duration-[1000ms] delay-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:top-[4.5rem]">
                     <div className="flex items-center gap-4">
                        <span className="font-bold text-[#9CA3AF] w-4 text-center">1</span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">DK</div>
                        <span className="font-semibold text-white text-sm">Deniz K.</span>
                     </div>
                     <span className="text-[#8B6CFF] font-bold text-sm">1450 XP</span>
                   </div>

                   {/* Row 2 (Drops to 3) */}
                   <div className="absolute top-[4.5rem] w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 transition-all duration-[1000ms] delay-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:top-[9rem]">
                     <div className="flex items-center gap-4">
                        <span className="font-bold text-[#9CA3AF] w-4 text-center">2</span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">AM</div>
                        <span className="font-semibold text-white text-sm">Ayşe M.</span>
                     </div>
                     <span className="text-[#8B6CFF] font-bold text-sm">1320 XP</span>
                   </div>

                   {/* Row 3 (User) -> Rises to 1 */}
                   <div className="absolute top-[9rem] w-full flex items-center justify-between p-4 rounded-xl bg-[#FF5A4D]/10 border border-[#FF5A4D]/30 transition-all duration-[1000ms] delay-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:top-0 group-hover:bg-[#F59E0B]/20 group-hover:border-[#F59E0B]/50 shadow-[0_0_15px_rgba(255,90,95,0.1)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                     <div className="flex items-center gap-4">
                        <span className="font-bold text-[#FF5A4D] group-hover:text-[#F59E0B] transition-colors duration-[1000ms] delay-[800ms] w-4 text-center">
                          <span className="group-hover:opacity-0 absolute transition-opacity duration-500">3</span>
                          <span className="opacity-0 group-hover:opacity-100 absolute transition-opacity duration-500 delay-[1200ms]">1</span>
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF5A4D] to-[#F59E0B] flex items-center justify-center text-xs font-bold text-white shadow-inner border border-white/20">SEN</div>
                        <span className="font-bold text-white text-sm">Sen</span>
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
          <div className="relative rounded-3xl bg-gradient-to-b from-[#14161A] via-white/[0.02] to-[#14161A] border border-white/[0.08] p-8 md:p-16 overflow-hidden shadow-2xl">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FF5A4D]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#8B6CFF]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#8B6CFF] text-xs font-semibold tracking-[0.25em] uppercase mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A4D]" />
                Misyonumuz & Vizyonumuz
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#F2F1ED] leading-tight mb-6">
                Sınırların Ötesinde Bir <span className="bg-gradient-to-r from-[#FF5A4D] to-[#8B6CFF] bg-clip-text text-transparent">Eğitim Devrimi</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg md:text-xl leading-relaxed font-normal">
                Ezbere dayalı, tek tip ve pasif eğitim modellerini tarihe gömüyoruz. OLTVIA; yapay zekanın hesaplama gücünü insan odaklı pedagoji ve Sokratik sorgulama ile harmanlayarak her öğrencinin benzersiz zihinsel potansiyelini gerçeğe dönüştürür.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 mb-12">
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#FF5A4D]/40 transition-all duration-500 hover:-translate-y-2 group">
                <div className="w-14 h-14 rounded-xl bg-[#FF5A4D]/10 border border-[#FF5A4D]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-[#FF5A4D]" />
                </div>
                <h3 className="text-xl font-bold text-[#F2F1ED] mb-3">Sokratik Bilişsel Mentörlük</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">
                  Cevapları hazır sunmak yerine, zihni açan doğru sorular ve analojilerle öğrencinin mantık yürütmesini sağlarız. Ezber değil, kalıcı ve derin kavrayış inşa ederiz.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#8B6CFF]/40 transition-all duration-500 hover:-translate-y-2 group">
                <div className="w-14 h-14 rounded-xl bg-[#8B6CFF]/10 border border-[#8B6CFF]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-[#8B6CFF]" />
                </div>
                <h3 className="text-xl font-bold text-[#F2F1ED] mb-3">Sıfır Sapma ile Hedef Rotası</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">
                  Her deneme ve soruyu analiz eden algoritmamız, öğrencinin bilişsel zayıf noktalarını milimetrik hassasiyetle tespit ederek hedefe giden en optimize rotayı çizer.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/30 transition-all duration-500 hover:-translate-y-2 group">
                <div className="w-14 h-14 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Flame className="w-7 h-7 text-[#F59E0B]" />
                </div>
                <h3 className="text-xl font-bold text-[#F2F1ED] mb-3">Bütünleşik & Canlı Ekosistem</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">
                  Öğrenci, öğretmen, veli ve okulu tek bir şeffaf veri ağında birleştirir; streak ve seviye sistemleriyle çalışma disiplinini bağımlılık yaratan bir tutkuya dönüştürürüz.
                </p>
              </div>
            </div>

            {/* Manifesto Callout Box */}
            <div className="p-8 rounded-2xl bg-gradient-to-r from-[#FF5A4D]/10 via-[#8B6CFF]/10 to-transparent border border-white/[0.1] text-center max-w-4xl mx-auto">
              <h4 className="text-lg font-bold text-white mb-2">Eğitim Manifestomuz</h4>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                "Hiçbir öğrenci yeteneksiz değildir; yalnızca kendi hızına ve zihinsel ritmine uygun bir yol göstericiye ihtiyaç duyar. OLTVIA, öğrencinin hızına adapte olarak imkansız sanılan hedefleri tam 12'den vurması için tasarlandı."
              </p>
            </div>
          </div>
        </section>

        {/* 2. S.S.S (FAQ) SECTION */}
        <section id="sss" className="scroll-mt-28 max-w-5xl mx-auto px-6 mb-44 relative reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#8B6CFF] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              <HelpCircle className="w-3.5 h-3.5 text-[#8B6CFF]" />
              Sıkça Sorulan Sorular
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#F2F1ED] mb-4">
              Aklınıza Takılan Her Şey
            </h2>
            <p className="text-[#9CA3AF] text-base md:text-lg">
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
                className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden transition-all duration-300 hover:border-white/20"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                >
                  <span className="text-base md:text-lg font-bold text-[#F2F1ED] flex items-center gap-3">
                    <span className="text-xs font-mono text-[#8B6CFF] px-2 py-1 rounded bg-[#8B6CFF]/10">0{idx + 1}</span>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-[#9CA3AF] transition-transform duration-300 flex-shrink-0 ${openFaq === idx ? 'rotate-180 text-[#FF5A4D]' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 pt-2 text-[#9CA3AF] text-sm md:text-base leading-relaxed border-t border-white/[0.04]">
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#10B981] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              <Shield className="w-3.5 h-3.5 text-[#10B981]" />
              Yasal & Güvenlik Esasları
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#F2F1ED] mb-4">
              Şartlar, Koşullar ve Gizlilik
            </h2>
            <p className="text-[#9CA3AF] text-base md:text-lg max-w-2xl mx-auto">
              Şeffaflık, güvenilirlik ve veri koruma standartlarımız; tüm platform kullanımınızı yasal güvence altına alır.
            </p>
          </div>

          <div className="rounded-3xl bg-white/[0.02] border border-white/[0.08] overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* Interactive Tab Switcher */}
            <div className="flex border-b border-white/[0.08] bg-black/30 overflow-x-auto">
              <button
                onClick={() => setLegalTab('terms')}
                className={`py-4 px-6 text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  legalTab === 'terms' 
                    ? 'border-[#FF5A4D] text-[#FF5A4D] bg-white/[0.03]' 
                    : 'border-transparent text-[#9CA3AF] hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" /> Kullanım Şartları
              </button>
              <button
                onClick={() => setLegalTab('conditions')}
                className={`py-4 px-6 text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  legalTab === 'conditions' 
                    ? 'border-[#8B6CFF] text-[#8B6CFF] bg-white/[0.03]' 
                    : 'border-transparent text-[#9CA3AF] hover:text-white'
                }`}
              >
                <Check className="w-4 h-4" /> Şartlar ve Koşullar
              </button>
              <button
                onClick={() => setLegalTab('privacy')}
                className={`py-4 px-6 text-xs md:text-sm font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  legalTab === 'privacy' 
                    ? 'border-[#0EA5E9] text-[#0EA5E9] bg-white/[0.03]' 
                    : 'border-transparent text-[#9CA3AF] hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4" /> Gizlilik & KVKK
              </button>
            </div>

            {/* Active Tab Content Area */}
            <div className="p-8 md:p-12 text-[#9CA3AF] text-sm md:text-base leading-relaxed space-y-6">
              
              {legalTab === 'terms' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">Kullanım Şartları Sözleşmesi</h3>
                      <p className="text-xs text-[#9CA3AF] mt-1">Son Güncelleme: 13 Ekim 2026 • Versiyon 2.4</p>
                    </div>
                    <span className="text-xs font-mono text-[#FF5A4D] px-3 py-1 rounded bg-[#FF5A4D]/10">RESMİ SÖZLEŞME</span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h4 className="font-bold text-white text-base mb-1">1. Taraflar ve Hizmetin Tanımı</h4>
                      <p>
                        İşbu Kullanım Şartları, OLTVIA Eğitim Teknolojileri A.Ş. ("OLTVIA") tarafından sunulan internet sitesi, mobil uygulamalar, Sokratik yapay zeka ders asistanı ve kurumsal yönetim panellerini kapsar. Platforma kaydolan veya içeriklerden faydalanan her gerçek ve tüzel kişi ("Kullanıcı"), işbu şartları peşinen kabul etmiş sayılır.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base mb-1">2. Hesap Güvenliği ve Tekil Kullanım İlkesi</h4>
                      <p>
                        Kullanıcı, oluşturduğu hesabın kullanıcı adı ve şifre güvenliğinden bizzat sorumludur. Hesabın üçüncü kişilere devredilmesi, satılması veya eşzamanlı olarak yetkisiz kişilerce paylaşılması yasaktır. OLTVIA, tek hesap üzerinden olağandışı çoklu IP erişimi veya şüpheli aktivite tespit etmesi halinde hesabı geçici veya kalıcı olarak askıya alma hakkını saklı tutar.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base mb-1">3. Kabul Edilebilir Kullanım ve Yasak Faaliyetler</h4>
                      <p>
                        Kullanıcılar; platform üzerindeki soru havuzlarını, yapay zeka yanıt modellerini, algoritmik gelişim eğrilerini veya arayüz tasarımlarını kazıma (scraping), tersine mühendislik (reverse engineering) veya bot yazılımlar vasıtasıyla kopyalayamaz. Ayrıca hileli yöntemlerle XP, puan veya seri (Streak) artışı üretmek kesinlikle yasaktır.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base mb-1">4. Fikri Mülkiyet Hakları</h4>
                      <p>
                        Platformda yer alan tüm yazılımlar, Sokratik AI istem mühendisliği (prompt engineering) modelleri, logolar, grafikler ve özgün eğitim içerikleri OLTVIA'nın münhasır mülkiyetindedir ve 5846 sayılı Fikir ve Sanat Eserleri Kanunu ile korunmaktadır.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {legalTab === 'conditions' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">Şartlar ve Koşullar (Abonelik Esasları)</h3>
                      <p className="text-xs text-[#9CA3AF] mt-1">Yürürlük Tarihi: 13 Ekim 2026</p>
                    </div>
                    <span className="text-xs font-mono text-[#8B6CFF] px-3 py-1 rounded bg-[#8B6CFF]/10">HİZMET POLİTİKASI</span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h4 className="font-bold text-white text-base mb-1">1. Abonelik Paketleri ve Ödeme Koşulları</h4>
                      <p>
                        OLTVIA, bireysel öğrencilere yönelik aylık/yıllık B2C abonelikler ile okullara ve kurs merkezlerine yönelik çoklu lisanslı B2B kurumsal paketler sunar. Abonelik bedelleri, kayıt esnasında belirtilen periyotlarla kredi kartı veya kurumsal faturalandırma kanalıyla peşin tahsil edilir. Fiyat değişiklikleri en az 30 gün önceden kullanıcılara bildirilir.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base mb-1">2. Cayma Hakkı ve İade Politikası</h4>
                      <p>
                        Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca; anında ifa edilen dijital hizmetler ve elektronik ortamda teslim edilen yapay zeka eğitim yazılımlarında, kullanıcı hizmeti aktif olarak kullanmaya başladıktan sonra cayma hakkı istisna kapsamındadır. Bununla birlikte, teknik arızalardan kaynaklanan ve 72 saat içinde giderilemeyen aksaklıklarda orantılı iade süreci işletilir.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base mb-1">3. Yapay Zeka Çıktıları ve Pedagojik Sorumluluk Sınırı</h4>
                      <p>
                        OLTVIA'nın sunduğu Sokratik Yapay Zeka asistanı, öğrencinin zihinsel gelişimine rehberlik etmek üzere tasarlanmış ileri düzey bir pedagojik araçtır. Yapay zekanın sağladığı ipuçları ve yönlendirmeler resmi sınav başarısını doğrudan garanti eden bir taahhüt niteliğinde olmayıp, öğrencinin bireysel çalışma disiplinini destekleme amacı taşır.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base mb-1">4. Uyuşmazlıkların Çözümü ve Yetkili Mahkeme</h4>
                      <p>
                        İşbu sözleşmeden doğabilecek her türlü ihtilafın çözümünde Türk Hukuku uygulanacak olup, İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri münhasıran yetkilidir.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {legalTab === 'privacy' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">Gizlilik Politikası ve KVKK Aydınlatma Metni</h3>
                      <p className="text-xs text-[#9CA3AF] mt-1">6698 sayılı KVKK ve Uluslararası GDPR Uyumlu</p>
                    </div>
                    <span className="text-xs font-mono text-[#10B981] px-3 py-1 rounded bg-[#10B981]/10">VERİ GÜVENCESİ</span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <h4 className="font-bold text-white text-base mb-1">1. Veri Sorumlusu ve Kapsam</h4>
                      <p>
                        6698 sayılı KVKK uyarınca, OLTVIA Eğitim Teknolojileri A.Ş. veri sorumlusu sıfatıyla hareket etmektedir. Kişisel verileriniz; hukuka ve dürüstlük kurallarına uygun, doğru ve güncel olarak, pedagojik analiz ve kişiselleştirilmiş öğrenme amacıyla sınırlı şekilde işlenmektedir.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base mb-1">2. İşlenen Kişisel Veri Kategorileri</h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-sm">
                        <li><strong>Kimlik ve İletişim Bilgileri:</strong> Ad, soyad, e-posta adresi, telefon numarası, sınıf düzeyi.</li>
                        <li><strong>Akademik ve Bilişsel Veriler:</strong> Çözülen deneme netleri, soru çözüm süreleri, yanlış yapılan konu haritaları, yapay zeka mentörlük diyalogları.</li>
                        <li><strong>İşlem ve Güvenlik Logları:</strong> IP adresi, cihaz bilgisi, oturum açma süreleri ve Streak serisi kayıtları.</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base mb-1">3. Veri Güvenliği ve Şifreleme İlkeleri</h4>
                      <p>
                        Platformumuzda saklanan tüm hassas öğrenci verileri AES-256 standardıyla şifrelenir. Ağ üzerindeki tüm iletişim TLS 1.3 güvenlik protokolü ile korunur. OLTVIA, öğrenci verilerini reklam ağlarıyla asla paylaşmaz ve hiçbir ticari kuruluşa satmaz.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-base mb-1">4. KVKK Madde 11 Kapsamındaki Haklarınız</h4>
                      <p>
                        Veri sahibi olarak; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, eksik veya yanlış işlenmişse düzeltilmesini isteme ve silinmesini talep etme hakkına sahipsiniz. Başvurularınızı <span className="text-white font-mono">kvkk@oltvia.com</span> adresine iletebilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* 4. BIZE ULASIN (CONTACT) SECTION */}
        <section id="iletisim" className="scroll-mt-28 max-w-7xl mx-auto px-6 mb-32 relative reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#FF5A4D] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
                  <Send className="w-3.5 h-3.5 text-[#FF5A4D]" />
                  Bize Ulaşın
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#F2F1ED] mb-4">
                  Yeni Nesil Eğitim Serüvenine <span className="bg-gradient-to-r from-[#FF5A4D] to-[#8B6CFF] bg-clip-text text-transparent">Birlikte Başlayalım</span>
                </h2>
                <p className="text-[#9CA3AF] text-base leading-relaxed">
                  İster bireysel öğrenci üyeliği, ister okulunuz veya kurs merkeziniz için kurumsal entegrasyon; uzman ekibimiz tüm sorularınızı yanıtlamaya hazır.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="p-3 rounded-xl bg-[#8B6CFF]/10 text-[#8B6CFF]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F2F1ED] mb-1">Genel Merkez</h4>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed">Büyükdere Caddesi No: 195, Kanyon Ofis Kuleleri, Levent / İstanbul</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="p-3 rounded-xl bg-[#FF5A4D]/10 text-[#FF5A4D]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F2F1ED] mb-1">E-Posta İletişim</h4>
                    <p className="text-xs text-[#9CA3AF]">Destek: <span className="text-white">destek@oltvia.com</span></p>
                    <p className="text-xs text-[#9CA3AF]">Kurumsal Demo: <span className="text-white">kurumsal@oltvia.com</span></p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="p-3 rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F2F1ED] mb-1">Danışma & Destek Hattı</h4>
                    <p className="text-xs text-[#9CA3AF]">+90 (212) 800 12 12 • Hafta içi 09:00 - 18:30</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form Column */}
            <div className="lg:col-span-7">
              <div className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl relative shadow-2xl">
                {contactSubmitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#F2F1ED]">Mesajınız Başarıyla İletildi!</h3>
                    <p className="text-sm text-[#9CA3AF] max-w-md mx-auto">
                      Talebiniz eğitim ve teknik danışmanlarımıza ulaştı. En geç 2 iş saati içinde e-posta adresiniz üzerinden geri dönüş yapacağız.
                    </p>
                    <button
                      onClick={() => {
                        setContactSubmitted(false);
                        setContactForm({ name: '', email: '', role: 'Öğrenci', message: '' });
                      }}
                      className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-widest text-white transition-colors"
                    >
                      Yeni Mesaj Gönder
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitted(true);
                    }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Ad Soyad</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="Örn: Deniz Kaya"
                          className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white placeholder-white/20 focus:outline-none focus:border-[#FF5A4D] transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">E-Posta Adresi</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="deniz@example.com"
                          className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white placeholder-white/20 focus:outline-none focus:border-[#FF5A4D] transition-colors text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Rolünüz / Profiliniz</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['Öğrenci', 'Öğretmen', 'Veli', 'Kurumsal'].map((r) => (
                          <button
                            type="button"
                            key={r}
                            onClick={() => setContactForm({ ...contactForm, role: r })}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                              contactForm.role === r 
                                ? 'bg-gradient-to-r from-[#FF5A4D] to-[#8B6CFF] text-white border-transparent shadow-lg' 
                                : 'bg-white/[0.02] text-[#9CA3AF] border-white/[0.08] hover:border-white/20'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Mesajınız / Talep Detayı</label>
                      <textarea
                        required
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Kurumunuz için demo talebi, soru havuzu entegrasyonu veya genel danışma talebinizi belirtin..."
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.1] text-white placeholder-white/20 focus:outline-none focus:border-[#8B6CFF] transition-colors text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF5A4D] via-[#FF8A7A] to-[#8B6CFF] text-white font-bold text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(255,90,77,0.4)] hover:shadow-[0_0_40px_rgba(139,108,255,0.6)] transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                      Mesajı Gönder
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#0E1013] pt-20 pb-12 relative z-10 reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/[0.06]">
            
            {/* Col 1: Brand & Bio */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 78 28 A 36 36 0 1 0 78 72" stroke="#F2F1ED" strokeWidth="16" />
                  <circle cx="78" cy="28" r="8" fill="#8B6CFF" />
                  <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
                  <circle cx="45" cy="40" r="10" fill="#F2F1ED" />
                  <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="#F2F1ED" />
                </svg>
                <span className="text-2xl font-black tracking-widest text-[#F2F1ED] font-sans">OLTVIA</span>
              </div>
              <p className="text-sm text-[#9CA3AF] max-w-sm leading-relaxed">
                Yapay zekanın bilişsel gücüyle her öğrenciye özel Sokratik eğitim ekosistemi. Sıfır sapma, yüksek motivasyon ve hedefe tam odaklanma.
              </p>
              <div className="pt-2 text-xs font-mono text-[#8B6CFF] tracking-widest uppercase">
                BEYOND WHAT YOU KNOW
              </div>
            </div>

            {/* Col 2: Platform Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-[0.25em] mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-[#9CA3AF]">
                <li><a href="#ozellikler" className="hover:text-[#FF5A4D] transition-colors">Sokratik Mentör</a></li>
                <li><a href="#ozellikler" className="hover:text-[#FF5A4D] transition-colors">Hedef Rotası Analizi</a></li>
                <li><a href="#ozellikler" className="hover:text-[#FF5A4D] transition-colors">Başarı Oku (Dartboard)</a></li>
                <li><a href="#ozellikler" className="hover:text-[#FF5A4D] transition-colors">Streak & Liderlik Tablosu</a></li>
                <li><a href="#girisler" className="hover:text-[#FF5A4D] transition-colors">Giriş Portalları</a></li>
              </ul>
            </div>

            {/* Col 3: Kurumsal Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-[0.25em] mb-4">Kurumsal</h4>
              <ul className="space-y-3 text-sm text-[#9CA3AF]">
                <li><a href="#misyonumuz" className="hover:text-[#8B6CFF] transition-colors">Misyonumuz</a></li>
                <li><a href="#sss" className="hover:text-[#8B6CFF] transition-colors">Sıkça Sorulan Sorular</a></li>
                <li><a href="#yasal" className="hover:text-[#8B6CFF] transition-colors">Yasal İlkeler</a></li>
                <li><a href="#iletisim" className="hover:text-[#8B6CFF] transition-colors">Bize Ulaşın</a></li>
                <li><a href="#girisler" className="hover:text-[#8B6CFF] transition-colors">Kurumsal Yönetici Paneli</a></li>
              </ul>
            </div>

            {/* Col 4: Yasal & Güvenlik Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-[0.25em] mb-4">Yasal & Güvenlik</h4>
              <ul className="space-y-3 text-sm text-[#9CA3AF]">
                <li>
                  <button 
                    onClick={() => {
                      setLegalTab('terms');
                      document.getElementById('yasal')?.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    className="hover:text-[#F2F1ED] transition-colors text-left"
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
                    className="hover:text-[#F2F1ED] transition-colors text-left"
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
                    className="hover:text-[#F2F1ED] transition-colors text-left"
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
                    className="hover:text-[#F2F1ED] transition-colors text-left"
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