import os
import re

path = '/Users/onur/Desktop/eduxofficial/apps/web/src/app/globals.css'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the previously appended animations
content = re.sub(r'@keyframes swap-i \{.*', '', content, flags=re.DOTALL)

# Add the new optimized looping animations
new_css = """
@keyframes swap-i {
  0%, 30% { transform: translateX(0); color: #F8FAFC; text-shadow: none; }
  45%, 85% { transform: translateX(0.95em); color: #8B5CF6; text-shadow: 0 0 20px rgba(139,92,246,0.8); z-index: 10; }
  100% { transform: translateX(0); color: #F8FAFC; text-shadow: none; }
}
@keyframes swap-a {
  0%, 30% { transform: translateX(0); color: #F8FAFC; text-shadow: none; }
  45%, 85% { transform: translateX(-0.45em); color: #8B5CF6; text-shadow: 0 0 20px rgba(139,92,246,0.8); }
  100% { transform: translateX(0); color: #F8FAFC; text-shadow: none; }
}

@keyframes chat-loop-1 {
  0%, 5% { opacity: 0; transform: translateY(15px); }
  10%, 90% { opacity: 1; transform: translateY(0); }
  95%, 100% { opacity: 0; transform: translateY(-15px); }
}
@keyframes chat-loop-typing {
  0%, 15% { opacity: 0; transform: translateY(15px); }
  20%, 35% { opacity: 1; transform: translateY(0); }
  36%, 100% { opacity: 0; transform: translateY(0); }
}
@keyframes chat-loop-2 {
  0%, 35% { opacity: 0; transform: translateY(15px); }
  40%, 90% { opacity: 1; transform: translateY(0); }
  95%, 100% { opacity: 0; transform: translateY(-15px); }
}
@keyframes typing-dot {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
"""

with open(path, 'w', encoding='utf-8') as f:
    f.write(content + new_css)
