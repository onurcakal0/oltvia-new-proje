import os
import re

path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_logo_html = """<svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform hover:scale-105 transition-transform cursor-pointer">
              <path d="M 78 28 A 36 36 0 1 0 78 72" stroke="#F2F1ED" strokeWidth="16" />
              <circle cx="78" cy="28" r="8" fill="#8B6CFF" />
              <circle cx="78" cy="72" r="8" fill="#FF5A4D" />
              <circle cx="45" cy="40" r="10" fill="#F2F1ED" />
              <path d="M 25 68 A 20 20 0 0 1 65 68 Z" fill="#F2F1ED" />
            </svg>
            <span className="text-2xl font-black tracking-widest text-[#F2F1ED] font-sans">OLTVIA</span>"""

# Pattern to find the old gradient box and the OLTVİA text
pattern = r'<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-\[#FF5A4D\] to-\[#8B6CFF\].*?</div>\s*<span[^>]*>OLTVİA</span>'

# Apply the regex substitution
updated_content = re.sub(pattern, new_logo_html, content, flags=re.DOTALL)

if updated_content == content:
    print("WARNING: Replacement did not match anything!")
else:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    print("Logos successfully replaced.")

