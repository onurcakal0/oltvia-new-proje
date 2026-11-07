import os

path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/globals.css'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('#121212', '#14161A')
content = content.replace('#FF5A5F', '#FF5A4D')
content = content.replace('#8B5CF6', '#8B6CFF')
content = content.replace('#F8FAFC', '#F2F1ED')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates applied to globals.css")
