import os

path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_feature_4 = """
          {/* Feature 4: Oyunlaştırma & Streak */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] mt-40">
            
            {/* Left: Streak Animation */}
            <div className="col-span-1">
              <div className="bg-[#121212]/90 border border-white/[0.05] rounded-[23px] p-8 h-[420px] flex flex-col justify-center items-center shadow-2xl relative overflow-hidden group cursor-crosshair">
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF5A5F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div className="text-[#9CA3AF] text-xs font-bold uppercase tracking-[0.3em] mb-10 z-10">Günlük Seri</div>
                
                <div className="flex items-center gap-2 md:gap-3 z-10">
                  {["Pzt", "Sal", "Çar", "Per"].map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                       <Flame size={24} className="text-[#FF5A5F] drop-shadow-[0_0_8px_rgba(255,90,95,0.8)]" />
                       <span className="text-[10px] text-white/50 font-bold uppercase">{d}</span>
                    </div>
                  ))}
                  
                  {/* Today (Animates on hover) */}
                  <div className="flex flex-col items-center gap-3 relative">
                     <div className="absolute inset-0 bg-[#FF5A5F] blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-1000 delay-300 rounded-full scale-150"></div>
                     <Flame size={28} className="text-white/10 group-hover:text-[#FF5A5F] group-hover:drop-shadow-[0_0_15px_rgba(255,90,95,1)] transition-colors duration-1000 delay-300 relative z-10 group-hover:scale-110" />
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
                    <span className="absolute translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[800ms] delay-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-[#FF5A5F] drop-shadow-[0_0_30px_rgba(255,90,95,0.4)]">13</span>
                  </div>
                  <div className="text-[#FF5A5F] font-bold tracking-widest mt-4 uppercase text-xs animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-[1200ms]">Gündür Ateştesin!</div>
                </div>
              </div>
            </div>

            {/* Center: Text Content */}
            <div className="col-span-1 flex flex-col justify-center text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] mx-auto mb-6 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <Gamepad2 size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#F8FAFC] mb-6">
                Oyunlaştırılmış <span className="text-[#F59E0B]">Eğitim</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg leading-relaxed font-medium">
                Öğrenmeyi sıkıcı bir zorunluluk olmaktan çıkarıp, bağımlılık yapan bir serüvene dönüştürüyoruz. Kesintisiz çalışma serilerini <span className="text-[#FF5A5F] font-bold">(Streak)</span> koruyarak motivasyonunu zirvede tut ve kendi sınıfının liderlik tablosunda kıyasıya bir rekabete katıl!
              </p>
            </div>

            {/* Right: Leaderboard Animation */}
            <div className="col-span-1">
              <div className="bg-[#121212]/90 border border-white/[0.05] rounded-[23px] p-8 h-[420px] flex flex-col justify-center shadow-2xl relative overflow-hidden group cursor-crosshair">
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
                     <span className="text-[#8B5CF6] font-bold text-sm">1450 XP</span>
                   </div>

                   {/* Row 2 (Drops to 3) */}
                   <div className="absolute top-[4.5rem] w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 transition-all duration-[1000ms] delay-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:top-[9rem]">
                     <div className="flex items-center gap-4">
                        <span className="font-bold text-[#9CA3AF] w-4 text-center">2</span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">AM</div>
                        <span className="font-semibold text-white text-sm">Ayşe M.</span>
                     </div>
                     <span className="text-[#8B5CF6] font-bold text-sm">1320 XP</span>
                   </div>

                   {/* Row 3 (User) -> Rises to 1 */}
                   <div className="absolute top-[9rem] w-full flex items-center justify-between p-4 rounded-xl bg-[#FF5A5F]/10 border border-[#FF5A5F]/30 transition-all duration-[1000ms] delay-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:top-0 group-hover:bg-[#F59E0B]/20 group-hover:border-[#F59E0B]/50 shadow-[0_0_15px_rgba(255,90,95,0.1)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                     <div className="flex items-center gap-4">
                        <span className="font-bold text-[#FF5A5F] group-hover:text-[#F59E0B] transition-colors duration-[1000ms] delay-[800ms] w-4 text-center">
                          <span className="group-hover:opacity-0 absolute transition-opacity duration-500">3</span>
                          <span className="opacity-0 group-hover:opacity-100 absolute transition-opacity duration-500 delay-[1200ms]">1</span>
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF5A5F] to-[#F59E0B] flex items-center justify-center text-xs font-bold text-white shadow-inner border border-white/20">SEN</div>
                        <span className="font-bold text-white text-sm">Sen</span>
                     </div>
                     <div className="relative flex items-center justify-end w-20">
                        <span className="text-[#FF5A5F] font-bold text-sm absolute group-hover:opacity-0 transition-opacity duration-300">1280 XP</span>
                        {/* Point counting up effect */}
                        <span className="text-[#F59E0B] font-bold text-sm absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-[1200ms] drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">+1500 XP</span>
                     </div>
                   </div>
                </div>
              </div>
            </div>

          </div>
"""

content = content.replace("</section>\n      </main>", new_feature_4 + "\n        </section>\n      </main>")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

