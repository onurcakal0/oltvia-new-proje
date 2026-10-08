import os

path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

if '{/* Feature 2 */}' in content:
    part1 = content.split('{/* Feature 2 */}')[0]
    part2 = content.split('{/* Feature 2 */}')[1]
    
    # In part2, find where the section ends
    end_idx = part2.find('</section>')
    after_section = part2[end_idx:]
    
    new_feature_2 = """{/* Feature 2: Başarı Eğrisi */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-20 reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex-1 space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 flex items-center justify-center text-[#FF5A5F] mb-6 shadow-[0_0_20px_rgba(255,90,95,0.2)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#F8FAFC]">
                Sıfır Sapma ile <span className="text-[#FF5A5F]">Hedef Rotası</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg leading-relaxed font-medium">
                Öğrencinin mevcut TYT-AYT netleri ile hayalindeki üniversitenin gerektirdiği net eğrisi arasındaki farkı milimetrik olarak analiz eder. Sistemin tek bir amacı vardır: Eksikleri anında tespit ederek bu iki eğriyi kusursuzca birleştirmek.
              </p>
            </div>
            
            <div className="flex-1 w-full">
              <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent p-[1px]">
                <div className="absolute inset-0 bg-[#FF5A5F]/20 blur-[80px] -z-10 rounded-full" />
                
                <div className="rounded-[23px] bg-[#121212]/90 backdrop-blur-xl h-[420px] flex flex-col relative overflow-hidden border border-white/[0.05] shadow-2xl group cursor-crosshair">
                  
                  {/* Header */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20 transition-opacity duration-500 group-hover:opacity-0">
                     <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full bg-[#FF5A5F] animate-pulse shadow-[0_0_10px_#FF5A5F]"></div>
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
                        <path d="M 0 150 C 100 120, 200 80, 400 30" fill="none" stroke="#FF5A5F" strokeWidth="3" strokeDasharray="6 6" className="opacity-60" />
                        
                        {/* Current Curve (Solid Purple) */}
                        <path d="M 0 170 C 100 160, 200 130, 300 110" fill="none" stroke="#8B5CF6" strokeWidth="4" />
                        <path d="M 300 110 C 350 100, 380 90, 400 30" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="4" strokeDasharray="4 4" />
                        
                        {/* Glow under solid purple curve */}
                        <path d="M 0 170 C 100 160, 200 130, 300 110 L 300 200 L 0 200 Z" fill="url(#purpleGlow)" opacity="0.2" />

                        {/* Defs for gradients */}
                        <defs>
                          <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                        </defs>

                        {/* Data Point 1: Current vs Target (October) */}
                        <g className="transition-all duration-700 opacity-0 group-hover:opacity-100" style={{ transitionDelay: '300ms' }}>
                          <line x1="150" y1="100" x2="150" y2="145" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3" />
                          {/* Target Node */}
                          <circle cx="150" cy="100" r="5" fill="#121212" stroke="#FF5A5F" strokeWidth="2" />
                          <rect x="90" y="60" width="120" height="30" rx="4" fill="#FF5A5F" opacity="0.15" />
                          <text x="150" y="80" fill="#FF5A5F" fontSize="10" fontWeight="bold" textAnchor="middle">Hedef: 85 Net</text>
                          {/* Current Node */}
                          <circle cx="150" cy="145" r="5" fill="#8B5CF6" stroke="#fff" strokeWidth="2" filter="drop-shadow(0 0 4px #8B5CF6)" />
                          <rect x="90" y="160" width="120" height="30" rx="4" fill="#8B5CF6" opacity="0.15" />
                          <text x="150" y="180" fill="#E9D5FF" fontSize="10" fontWeight="bold" textAnchor="middle">Gerçekleşen: 65 Net</text>
                        </g>

                        {/* Data Point 2: The Future Convergence (May) */}
                        <g className="transition-all duration-700 opacity-0 group-hover:opacity-100" style={{ transitionDelay: '500ms' }}>
                          <circle cx="350" cy="55" r="5" fill="#121212" stroke="#FF5A5F" strokeWidth="2" />
                          <rect x="290" y="15" width="120" height="30" rx="4" fill="#FF5A5F" opacity="0.15" />
                          <text x="350" y="35" fill="#FF5A5F" fontSize="10" fontWeight="bold" textAnchor="middle">YKS Hedefi: 110 Net</text>
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
        """
    
    new_content = part1 + new_feature_2 + "\n        " + after_section
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
else:
    print("Could not find {/* Feature 2 */}")

