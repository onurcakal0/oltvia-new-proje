import os
import re

path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace the content of Feature 3
# It starts at `{/* Feature 3: OLTVIA Nedir? */}` and ends at `</section>` (end of main features)
pattern = r'\{/\* Feature 3: OLTVIA Nedir\? \*/\}.*?(?=</section>)'

new_feature_3 = """{/* Feature 3: OLTVIA Nedir? */}
          <div className="flex flex-col lg:flex-row items-center gap-20 reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex-1 space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Target size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#F8FAFC]">
                OLTVIA <span className="text-[#8B5CF6]">Nedir?</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg leading-relaxed font-medium">
                OLTVIA, sınırları reddeden öğrencilerin yeni nesil eğitim ekosistemidir. Klasik ve sıkıcı müfredatların ötesine geçerek, başarıyı asla şansa bırakmaz. <span className="text-white font-bold">Disiplin, özveri ve yapay zeka</span> gücünü bir araya getirerek öğrenciyi tam 12'den vurması gereken hedeflere odaklar.
              </p>
            </div>
            
            <div className="flex-1 w-full">
              <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent p-[1px]">
                <div className="absolute inset-0 bg-[#FF5A5F]/10 blur-[80px] -z-10 rounded-full" />
                
                <div className="rounded-[23px] bg-[#121212]/90 backdrop-blur-xl h-[420px] relative overflow-hidden border border-white/[0.05] shadow-2xl group cursor-crosshair">
                  
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
                    
                    {/* The REVEAL LAYER (Hidden initially, appears after shatter) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-0 opacity-0 animate-reveal">
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FF5A5F] to-[#8B5CF6] flex items-center justify-center font-bold text-white shadow-[0_0_50px_rgba(139,92,246,0.6)] mb-6">
                        <span className="text-6xl font-black">O</span>
                      </div>
                      <span className="text-5xl font-black tracking-widest text-[#F8FAFC] uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">Oltvia</span>
                      <span className="text-[#FF5A5F] font-bold tracking-widest uppercase mt-4">Sıfır Sapma. Sonsuz Başarı.</span>
                    </div>

                    {/* The FLASH LAYER (Flashes white on impact) */}
                    <div className="absolute inset-0 bg-white z-40 opacity-0 pointer-events-none animate-flash"></div>

                    {/* The DARTBOARD LAYER (Shatters at 1.2s) */}
                    <div className="relative w-full h-full flex items-center justify-center z-10 animate-shatter">
                      
                      {/* The Dartboard Rings */}
                      <div className="relative flex items-center justify-center scale-90 md:scale-100">
                        <div className="w-80 h-80 rounded-full border border-white/5 flex items-center justify-center">
                          <div className="w-60 h-60 rounded-full border border-white/10 flex items-center justify-center">
                            <div className="w-40 h-40 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/5 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                              <div className="w-20 h-20 rounded-full border border-[#FF5A5F]/50 bg-[#FF5A5F]/10 flex items-center justify-center">
                                {/* Bullseye */}
                                <div className="w-8 h-8 rounded-full bg-[#FF5A5F] shadow-[0_0_20px_#FF5A5F] animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Darts (Inside the shattering layer so they break with it) */}
                      
                      {/* Dart 1: Disiplin */}
                      <div className="absolute top-[32%] left-[42%] opacity-0 animate-dart1">
                        <div className="flex items-center -translate-y-1/2 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                          <div className="w-0 h-0 border-y-[4px] border-y-transparent border-r-[12px] border-r-white"></div>
                          <div className="w-16 h-1 bg-gradient-to-l from-transparent to-white"></div>
                          <div className="bg-[#8B5CF6] px-2 py-0.5 rounded-sm text-[10px] font-black text-white tracking-widest">DİSİPLİN</div>
                        </div>
                      </div>

                      {/* Dart 2: Özveri */}
                      <div className="absolute top-[68%] left-[45%] opacity-0 animate-dart2">
                        <div className="flex items-center -translate-y-1/2 drop-shadow-[0_0_10px_rgba(14,165,233,0.5)]">
                          <div className="w-0 h-0 border-y-[4px] border-y-transparent border-r-[12px] border-r-white"></div>
                          <div className="w-12 h-1 bg-gradient-to-l from-transparent to-white"></div>
                          <div className="bg-[#0EA5E9] px-2 py-0.5 rounded-sm text-[10px] font-black text-white tracking-widest">ÖZVERİ</div>
                        </div>
                      </div>

                      {/* Dart 3: Başarı (Hits Bullseye) */}
                      <div className="absolute top-[50%] left-[50%] opacity-0 animate-dart3">
                        <div className="flex items-center -translate-y-1/2 drop-shadow-[0_0_20px_rgba(255,90,95,0.8)]">
                          {/* BAŞARI DART */}
                          <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[20px] border-r-[#FF5A5F]"></div>
                          <div className="w-24 h-1.5 bg-gradient-to-l from-transparent to-[#FF5A5F]"></div>
                          <div className="bg-[#FF5A5F] px-4 py-1.5 rounded-sm text-[12px] font-black text-white tracking-widest shadow-[0_0_20px_#FF5A5F]">BAŞARI</div>
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
"""

content = re.sub(pattern, new_feature_3, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

