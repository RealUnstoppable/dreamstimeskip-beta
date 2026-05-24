import os
import glob
import re

html_files = glob.glob("*.html")

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. Add header if missing
    if '<header class="main-header"' not in content:
        content = re.sub(r'(<body[^>]*>)', r'\1\n    <header class="main-header"></header>\n', content, count=1)
        
    # 2. Add footer if missing
    if '<footer class="main-footer"' not in content:
        # Find the last closing tag before scripts or body end
        content = re.sub(r'(</body>)', r'    <footer class="main-footer"></footer>\n\1', content, count=1)
        
    # 3. Handle loadNavbar and loadFooter
    has_load_navbar = 'loadNavbar' in content
    has_load_footer = 'loadFooter' in content
    
    script_snippet = """
    <script type="module">
        import { loadNavbar } from './js/navbar.js';
        import { loadFooter } from './js/footer.js';
        
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof loadNavbar === 'function') loadNavbar();
            if (typeof loadFooter === 'function') loadFooter();
        });
    </script>
"""
    
    if not has_load_navbar and not has_load_footer:
        content = re.sub(r'(</body>)', script_snippet + r'\1', content, count=1)
    elif has_load_navbar and not has_load_footer:
        # Replace existing loadNavbar script block with combined one
        content = re.sub(r'<script type="module">\s*import { loadNavbar }.*?</script>', script_snippet, content, flags=re.DOTALL)
    elif not has_load_navbar and has_load_footer:
        content = re.sub(r'<script type="module">\s*import { loadFooter }.*?</script>', script_snippet, content, flags=re.DOTALL)

    if content != original_content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {file}")

