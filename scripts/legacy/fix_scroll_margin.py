import os

path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix girisler
content = content.replace(
    '<section id="girisler" className="max-w-7xl',
    '<section id="girisler" className="scroll-mt-28 max-w-7xl'
)

# Fix ozellikler
content = content.replace(
    '<section id="ozellikler" className="max-w-7xl',
    '<section id="ozellikler" className="scroll-mt-28 max-w-7xl'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
