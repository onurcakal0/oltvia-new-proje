import os
path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

import re
# Replace anything that looks like transitionDelay: \`\${idx * 100}ms\`
content = re.sub(r'transitionDelay:\s*\\?[`\'].*?ms\\?[`\']', 'transitionDelay: (idx * 100) + "ms"', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
