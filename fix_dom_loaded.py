import os
import glob
import re

html_files = glob.glob("*.html")

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace:
    # document.addEventListener('DOMContentLoaded', () => {
    #     if (typeof loadNavbar === 'function') loadNavbar();
    #     if (typeof loadFooter === 'function') loadFooter();
    # });
    # with just calling them.
    # We'll use regex to find DOMContentLoaded blocks inside module scripts.
    
    # We will just replace specific patterns
    pattern1 = re.compile(r"document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{\s*loadNavbar\(\);\s*loadFooter\(\);\s*(//.*?)?\s*\}\);", re.DOTALL)
    
    pattern2 = re.compile(r"document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{\s*if\s*\(typeof loadNavbar === 'function'\)\s*loadNavbar\(\);\s*if\s*\(typeof loadFooter === 'function'\)\s*loadFooter\(\);\s*\}\);", re.DOTALL)
    
    new_content = pattern1.sub("loadNavbar();\n        loadFooter();", content)
    new_content = pattern2.sub("if (typeof loadNavbar === 'function') loadNavbar();\n        if (typeof loadFooter === 'function') loadFooter();", new_content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed DOMContentLoaded in {file}")

