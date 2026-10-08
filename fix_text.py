import os

path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific text
content = content.replace("Gündür Ateştesin!", "Gündür İlerliyorsun")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
