import os
path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('</section>\n      </main>')
if idx != -1:
    print("Found exact ending")
else:
    print("Not exact. Here is the end of main:")
    main_end = content.find('</main>')
    print(content[main_end-200:main_end+50])

