import os
import re

path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'\{/\* The Interactive Container \*/\}.*?(?=\{/\* Vignette Overlay \*/\})'

new_interactive_container = """{/* The Interactive Container */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    
                    {/* The FLASH LAYER (Flashes white on impact) */}
                    <div className="absolute inset-0 bg-white z-40 opacity-0 pointer-events-none animate-flash"></div>

                    {/* The DARTBOARD LAYER (Earthquake shakes and darkens at 1.2s) */}
                    <div className="relative w-full h-full flex items-center justify-center z-10 animate-earthquake">
                      
                      {/* Glowing Cracks Overlay (Appears on impact, inside the shaking board) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 animate-cracks z-30 pointer-events-none">
                         <svg className="w-[300px] h-[300px] drop-shadow-[0_0_15px_#FF5A5F]" viewBox="0 0 200 200">
                            <path d="M100,100 L115,80 L110,60 L140,20 L130,0" stroke="#FF5A5F" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                            <path d="M100,100 L80,110 L50,95 L20,120 L0,110" stroke="#FF5A5F" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                            <path d="M100,100 L115,120 L110,140 L160,180 L150,200" stroke="#FF5A5F" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                            <path d="M100,100 L85,85 L60,90 L40,40 L20,30" stroke="#FF5A5F" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                            <path d="M100,100 L130,110 L160,90 L180,110 L200,90" stroke="#FF5A5F" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                            
                            {/* Minor branching cracks */}
                            <path d="M110,60 L130,65" stroke="#FF5A5F" strokeWidth="1" fill="none" strokeLinecap="round" />
                            <path d="M80,110 L70,130 L50,150" stroke="#FF5A5F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                            <path d="M115,120 L140,115" stroke="#FF5A5F" strokeWidth="1" fill="none" strokeLinecap="round" />
                            <path d="M60,90 L40,100" stroke="#FF5A5F" strokeWidth="1" fill="none" strokeLinecap="round" />
                         </svg>
                      </div>

                      {/* The Dartboard Rings */}
                      <div className="relative flex items-center justify-center scale-90 md:scale-100 z-10">
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

                      {/* Darts (Inside the shattering layer so they shake and darken with it) */}
                      
                      {/* Dart 1: Disiplin */}
                      <div className="absolute top-[32%] left-[42%] opacity-0 animate-dart1 z-20">
                        <div className="flex items-center -translate-y-1/2 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                          <div className="w-0 h-0 border-y-[4px] border-y-transparent border-r-[12px] border-r-white"></div>
                          <div className="w-16 h-1 bg-gradient-to-l from-transparent to-white"></div>
                          <div className="bg-[#8B5CF6] px-2 py-0.5 rounded-sm text-[10px] font-black text-white tracking-widest">DİSİPLİN</div>
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
                          <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[20px] border-r-[#FF5A5F]"></div>
                          <div className="w-24 h-1.5 bg-gradient-to-l from-transparent to-[#FF5A5F]"></div>
                          <div className="bg-[#FF5A5F] px-4 py-1.5 rounded-sm text-[12px] font-black text-white tracking-widest shadow-[0_0_20px_#FF5A5F]">BAŞARI</div>
                        </div>
                      </div>

                    </div>
                  </div>

                  """

content = re.sub(pattern, new_interactive_container, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

