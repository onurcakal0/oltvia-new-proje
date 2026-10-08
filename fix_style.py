import os
path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

import re
# Replace the style block
old_style = """<style dangerouslySetInnerHTML={{__html: `
        @keyframes textFlowLeftToRight {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-slogan-flow {
          animation: textFlowLeftToRight 4s linear infinite;
          background-size: 200% auto;
        }
      `}} />"""

new_style = """<style>{`
        @keyframes textFlowLeftToRight {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-slogan-flow {
          animation: textFlowLeftToRight 4s linear infinite;
          background-size: 200% auto;
        }
      `}</style>"""

content = content.replace(old_style, new_style)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
