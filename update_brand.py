import os
import re

path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update the Brand Colors globally
content = content.replace('#121212', '#14161A')
content = content.replace('#FF5A5F', '#FF5A4D')
content = content.replace('#8B5CF6', '#8B6CFF')
content = content.replace('#F8FAFC', '#F2F1ED')

# 2. Update the Navbar Logo
old_logo = """<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5A4D] to-[#8B6CFF] flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <span className="text-2xl font-black tracking-widest text-[#F2F1ED]">OLTVİA</span>"""

# If the colors weren't replaced yet in the old string match, we should match the old colors.
# Wait, I already replaced the colors in `content`. So I should match the updated colors!
# Actually, I'll use regex to replace the Navbar logo block to be safe.

logo_pattern = r'<a href="/" className="flex items-center gap-3">.*?</a>'
new_logo_html = """<a href="/" className="flex items-center gap-3 group">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:scale-105 transition-transform">
            {/* Outer C */}
            <path d="M 78 28 A 36 36 0 1 0 78 72" stroke="#F2F1ED" strokeWidth="16" />
            {/* Colored Caps (Dots) */}
            <circle cx="78" cy="28" r="8" fill="#8B6CFF" />
            <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
            {/* Inner Person */}
            <circle cx="45" cy="40" r="10" fill="#F2F1ED" />
            <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="#F2F1ED" />
          </svg>
          <span className="text-2xl font-black tracking-widest text-[#F2F1ED]">OLTVIA</span>
        </a>"""

content = re.sub(logo_pattern, new_logo_html, content, flags=re.DOTALL)

# 3. Update the chat avatar in Feature 1
chat_avatar_pattern = r'<div className="w-10 h-10 rounded-full bg-\[#8B6CFF\] flex items-center justify-center font-bold text-white shadow-\[0_0_15px_rgba\(139,92,246,0\.6\)\]">O</div>'
new_chat_avatar = """<div className="w-10 h-10 rounded-full bg-[#14161A] flex items-center justify-center shadow-[0_0_15px_rgba(139,108,255,0.4)] border border-white/5">
                      <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 78 28 A 36 36 0 1 0 78 72" stroke="#F2F1ED" strokeWidth="16" />
                        <circle cx="78" cy="28" r="8" fill="#8B6CFF" />
                        <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
                        <circle cx="45" cy="40" r="10" fill="#F2F1ED" />
                        <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="#F2F1ED" />
                      </svg>
                    </div>"""

content = re.sub(chat_avatar_pattern, new_chat_avatar, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates applied to page.tsx")
