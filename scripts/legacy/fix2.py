import os
path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
    idx = content.find('dangerouslySetInnerHTML')
    if idx != -1:
        print(content[idx-50:idx+200])
