import os
import re

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r') as f:
            content = f.read()
        
        # Remove any ?v=... from https://... imports in html files just in case
        new_content = re.sub(r"(import\s+\{.*\}\s*from\s*['\"]https://.*?\.js)(\?v=\d+)?(['\"])", r"\g<1>\3", content)
        if content != new_content:
            with open(filename, 'w') as f:
                f.write(new_content)

if os.path.exists('js/navbar.js'):
    with open('js/navbar.js', 'r') as f:
        content = f.read()
    new_content = re.sub(r"(import\s+\{.*\}\s*from\s*['\"]https://.*?\.js)(\?v=\d+)?(['\"])", r"\g<1>\3", content)
    if content != new_content:
        with open('js/navbar.js', 'w') as f:
            f.write(new_content)
        print("Fixed gstatic imports in js/navbar.js")

