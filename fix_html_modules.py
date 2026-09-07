import os
import re

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r') as f:
            content = f.read()

        # The pattern looks for:
        # document.addEventListener('DOMContentLoaded', () => {
        #     if (typeof loadNavbar === 'function') loadNavbar();
        #     if (typeof loadFooter === 'function') loadFooter();
        # });
        # OR
        # document.addEventListener('DOMContentLoaded', () => {
        #     loadNavbar();
        #     loadFooter();
        # });

        pattern1 = r"document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{\s*if\s*\(typeof\s*loadNavbar\s*===\s*'function'\)\s*loadNavbar\(\);\s*if\s*\(typeof\s*loadFooter\s*===\s*'function'\)\s*loadFooter\(\);\s*\}\);"
        pattern2 = r"document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{\s*loadNavbar\(\);\s*loadFooter\(\);\s*\}\);"
        
        new_content = re.sub(pattern1, r"if (typeof loadNavbar === 'function') loadNavbar();\n        if (typeof loadFooter === 'function') loadFooter();", content)
        new_content = re.sub(pattern2, r"loadNavbar();\n        loadFooter();", new_content)
        
        # Also let's check for any remaining DOMContentLoaded for loadNavbar
        pattern3 = r"document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{\s*if\s*\(typeof\s*loadNavbar\s*===\s*'function'\)\s*loadNavbar\(\);\s*\}\);"
        new_content = re.sub(pattern3, r"if (typeof loadNavbar === 'function') loadNavbar();", new_content)

        if content != new_content:
            with open(filename, 'w') as f:
                f.write(new_content)
            print(f"Fixed {filename}")

print("Done")
