"use client";
import React, { useEffect } from 'react';
import { Rocket, Network, Shield, Building2, Sparkles, Brain, Cpu, ChevronRight, Target , Flame, Trophy, Gamepad2} from 'lucide-react';

export default function OltivaLandingPage() {
  
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
    <div className="min-h-screen bg-[#14161A] text-[#F2F1ED] font-sans selection:bg-[#FF5A4D]/30 overflow-x-hidden">

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
          
          <div className="hidden md:flex items-center gap-10 text-sm font-bold text-[#9CA3AF] tracking-wide">
            <a href="#ozellikler" className="hover:text-[#FF5A4D] transition-colors">Özellikler</a>
            <a href="#girisler" className="hover:text-[#FF5A4D] transition-colors">Girişler</a>
            <a href="#iletisim" className="hover:text-[#F2F1ED] transition-colors">İletişim</a>
          </div>
          
          <div className="hidden sm:block border-l border-white/[0.05] pl-6">
            <span className="text-xs font-bold tracking-[0.3em] uppercase bg-gradient-to-r from-[#9CA3AF] via-[#F2F1ED] to-[#9CA3AF] text-transparent bg-clip-text animate-slogan-flow">
              Beyond What You Know
            </span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-32 pb-48 text-center flex flex-col items-center relative min-h-[50vh] justify-center reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="grid w-full max-w-5xl place-items-center group cursor-default">
            <h1 className="col-start-1 row-start-1 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:blur-[24px] group-hover:opacity-0 group-hover:scale-90 text-center z-10 select-none">
              <span className="font-script text-7xl md:text-8xl lg:text-[9.5rem] font-normal leading-[1.1] bg-gradient-to-r from-[#FF5A4D] via-[#FF8A7A] to-[#8B6CFF] bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(255,90,95,0.35)] block py-4">
                Öğrenmenin<br/>Ötesinde
              </span>
              <span className="block font-serif text-xs md:text-sm font-medium uppercase tracking-[0.35em] text-[#9CA3AF] mt-2 opacity-80">
                BEYOND WHAT YOU KNOW
              </span>
            </h1>
            
            <p className="col-start-1 row-start-1 transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 blur-[20px] scale-110 group-hover:opacity-100 group-hover:blur-0 group-hover:scale-100 text-2xl md:text-3xl text-[#F2F1ED] leading-relaxed font-normal z-20 text-center max-w-5xl px-4 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] font-serif tracking-[0.03em]">
              OLTVIA, yapay zeka gücüyle öğrencinin hızına, hislerine ve hedeflerine anında <span className="text-[#FF5A4D] italic font-semibold">adapte olan</span> yenilikçi bir ekosistemdir.
            </p>
          </div>
        </section>

        {/* 4 ENTRY PORTALS */}
        <section id="girisler" className="scroll-mt-28 max-w-7xl mx-auto px-6 mb-40 relative reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Öğrenci", icon: Rocket },
              { title: "Öğretmen", icon: Network },
              { title: "Veli", icon: Shield },
              { title: "Kurumsal Yönetici", icon: Building2 }
            ].map((portal, idx) => (
              <div key={idx} className="group relative rounded-[2rem] p-[1px] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(139,92,246,0.2)] bg-white/[0.05] hover:bg-gradient-to-br hover:from-[#FF5A4D] hover:to-[#8B6CFF]" style={{ transitionDelay: (idx * 100) + 'ms' }}>
                <button className="relative w-full h-full flex flex-col items-center justify-center p-12 bg-[#14161A]/90 backdrop-blur-[16px] rounded-[31px]">
                  <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 shadow-inner">
                    <portal.icon size={36} className="text-[#F2F1ED] group-hover:text-[#FF5A4D] transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-[#F2F1ED]">{portal.title}</h3>
                  <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <ChevronRight size={24} className="text-[#8B6CFF]" />
                  </div>
                </button>
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
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.05] bg-[#14161A] py-16 text-center relative z-10 reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
          <div className="flex items-center gap-2 mb-2">
            <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform hover:scale-105 transition-transform cursor-pointer">
              <path d="M 78 28 A 36 36 0 1 0 78 72" stroke="#F2F1ED" strokeWidth="16" />
              <circle cx="78" cy="28" r="8" fill="#8B6CFF" />
              <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
              <circle cx="45" cy="40" r="10" fill="#F2F1ED" />
              <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="#F2F1ED" />
            </svg>
            <span className="text-2xl font-black tracking-widest text-[#F2F1ED] font-sans">OLTVIA</span>
          </div>
          <div className="flex gap-10 text-sm text-[#9CA3AF] font-bold tracking-wide">
            <a href="#ozellikler" className="hover:text-[#FF5A4D] transition-colors">Özellikler</a>
            <a href="#girisler" className="hover:text-[#FF5A4D] transition-colors">Girişler</a>
            <a href="#iletisim" className="hover:text-[#8B6CFF] transition-colors">Kullanım Şartları</a>
          </div>
          <p className="text-[#9CA3AF]/40 text-xs mt-6 font-semibold tracking-widest">
            © {new Date().getFullYear()} OLTVIA INC. ALL RIGHTS RESERVED. POWERED BY NEXT-GEN AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
