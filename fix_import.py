import os
path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_import = "import { Rocket, Network, Shield, Building2, Sparkles, Brain, Cpu, ChevronRight } from 'lucide-react';"
new_import = "import { Rocket, Network, Shield, Building2, Sparkles, Brain, Cpu, ChevronRight, Target } from 'lucide-react';"

if old_import in content:
    content = content.replace(old_import, new_import)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Import updated successfully.")
else:
    print("Old import string not found. Here is the top of the file:")
    print(content[:300])

