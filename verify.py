import os
path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

if "Sokratik OLTV" in content:
    print("SUCCESS: Found Sokratik OLTV")
else:
    print("FAILURE: Not found")
