import os
import re
import time

version = str(int(time.time()))

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r') as f:
            content = f.read()
        
        # Replace import { loadNavbar } from './js/navbar.js...'; with ?v=VERSION
        new_content = re.sub(r"(import\s+\{\s*loadNavbar\s*\}\s*from\s*['\"](/|\./)?js/navbar\.js)(\?v=\d+)?(['\"])", r"\g<1>?v=" + version + r"\4", content)
        new_content = re.sub(r"(import\s+\{\s*loadFooter\s*\}\s*from\s*['\"](/|\./)?js/footer\.js)(\?v=\d+)?(['\"])", r"\g<1>?v=" + version + r"\4", new_content)

        if content != new_content:
            with open(filename, 'w') as f:
                f.write(new_content)
            print(f"Busted cache in {filename}")

# Also update navbar.js to cache-bust its imports
if os.path.exists('js/navbar.js'):
    with open('js/navbar.js', 'r') as f:
        content = f.read()
    new_content = re.sub(r"(import\s+\{.*\}\s*from\s*['\"](.*?)(\.js))(\?v=\d+)?(['\"])", r"\g<1>?v=" + version + r"\5", content)
    if content != new_content:
        with open('js/navbar.js', 'w') as f:
            f.write(new_content)
        print("Busted cache in js/navbar.js")

