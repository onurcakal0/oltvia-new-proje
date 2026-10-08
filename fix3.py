import os

path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Safest way: Find the block starting with `{/* Feature 1 */}` until `{/* Feature 2 */}`
# Or, if it's missing the word Feature, just find `<Brain size={32} />` and replace the parent block.
pattern = r'\{/\* Feature 1 \*/\}.*?(?=\{/\* Feature 2 \*/\})'

new_feature = """{/* Feature 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-20 reveal-on-scroll opacity-0 translate-y-20 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex-1 space-y-8">
              <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] mb-6 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                <Brain size={32} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight flex items-center flex-wrap gap-2">
                <span className="text-[#F8FAFC]">Sokratik</span>
                <span className="text-[#F8FAFC] flex items-center">
                  OLTV
                  <span className="relative inline-flex items-center w-[1.4em] h-[1em]">
                    <span className="absolute font-black animate-[swap-i_4s_infinite_alternate] left-0">İ</span>
                    <span className="absolute font-black animate-[swap-a_4s_infinite_alternate] right-0">A</span>
                  </span>
                </span>
              </h2>
              <p className="text-[#9CA3AF] text-lg leading-relaxed font-medium">
                Öğrenciye doğrudan cevabı vermek yerine, onu düşünmeye iten sorular sorar. Yüksek yapay zeka zekasıyla anlama hızına göre benzersiz diyaloglar kurar.
              </p>
            </div>
            
            <div className="flex-1 w-full">
              <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent p-[1px]">
                <div className="absolute inset-0 bg-[#8B5CF6]/20 blur-[80px] -z-10 rounded-full" />
                <div className="rounded-[23px] bg-[#121212]/90 backdrop-blur-xl p-8 h-96 flex flex-col justify-end relative overflow-hidden border border-white/[0.05] shadow-2xl">
                  
                  <div className="absolute top-4 left-4 right-4 flex items-center gap-4 border-b border-white/[0.05] pb-6 bg-[#121212]/50 backdrop-blur-md z-20">
                    <div className="w-10 h-10 rounded-full bg-[#8B5CF6] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.6)]">O</div>
                    <div>
                      <span className="block text-base font-bold text-[#F8FAFC] tracking-wide">Oltvia Zeka</span>
                      <span className="block text-xs text-[#8B5CF6] font-medium mt-1">12. Sınıf İleri Matematik - Limit</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 z-10 pt-20">
                    {/* User Message */}
                    <div className="opacity-0 chat-bubble-1 bg-white/[0.03] border border-white/[0.05] rounded-3xl rounded-tr-sm p-4 w-[90%] ml-auto backdrop-blur-sm">
                      <p className="text-sm text-[#F8FAFC] font-medium leading-relaxed">
                        Hocam, L'Hopital kuralını kullanmadan sin(x)/x'in 0'daki limitinin 1 olduğunu geometrik olarak nasıl ispatlarız?
                      </p>
                    </div>
                    
                    {/* Typing Indicator */}
                    <div className="opacity-0 chat-typing bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 rounded-full p-4 w-20 flex justify-center gap-1.5 backdrop-blur-sm relative">
                      <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-[typing-dot_1s_infinite_0s]"></div>
                      <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-[typing-dot_1s_infinite_0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full animate-[typing-dot_1s_infinite_0.4s]"></div>
                    </div>

                    {/* AI Response */}
                    <div className="opacity-0 chat-bubble-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-3xl rounded-tl-sm p-4 w-[95%] backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                      <p className="text-sm text-[#E9D5FF] font-medium leading-relaxed">
                        Harika bir soru! L'Hopital bazen ezbere kaçabilir. Birim çember üzerinde çok küçük bir <span className="font-bold text-white">x açısı</span> çizdiğini hayal et. Sence bu açının gördüğü <span className="italic text-white">yay uzunluğu (x)</span> ile üçgenin yüksekliği <span className="italic text-white">(sin x)</span> birbirine nasıl yaklaşır?
                      </p>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>

          """

content = re.sub(pattern, new_feature, content, flags=re.DOTALL)
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
