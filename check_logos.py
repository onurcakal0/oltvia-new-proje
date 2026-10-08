import os

path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find the navbar logo
idx_nav = content.find('<nav className=')
if idx_nav != -1:
    print("NAVBAR HTML:")
    print(content[idx_nav:idx_nav+500])

print("\n------------------\n")

# Let's find the footer logo
idx_footer = content.find('<footer')
if idx_footer != -1:
    print("FOOTER HTML:")
    print(content[idx_footer:idx_footer+500])

