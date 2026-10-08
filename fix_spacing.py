import os
import re

path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/globals.css'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the values in swap-i and swap-a
# old values: 0.95em and -0.45em
content = re.sub(r'transform: translateX\(0\.95em\)', 'transform: translateX(0.65em)', content)
content = re.sub(r'transform: translateX\(-0\.45em\)', 'transform: translateX(-0.3em)', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
