import re
import os

filepath = 'functions/index.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("Manager info: [", "[")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
