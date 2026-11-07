import os
import re

path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'Flame' not in content:
    content = re.sub(
        r'import \{([^}]+)\} from \'lucide-react\';',
        r"import {\1, Flame, Trophy, Gamepad2} from 'lucide-react';",
        content
    )
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
