import os
path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

idx_nav = content.find('<nav className=')
print(content[idx_nav:idx_nav+600])
