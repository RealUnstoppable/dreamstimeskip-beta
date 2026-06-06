import os
import re

files = ['checkout.html', 'checkout-premium.html', 'checkout-ultimate.html']

header = '<header class="main-header" style="position: relative; z-index: 50;">\n        <div id="navbar-placeholder"></div>\n    </header>\n'
footer = '<footer class="main-footer"></footer>\n'

new_script = """<script type="module">
    import { loadNavbar } from './js/navbar.js';
    import { loadFooter } from './js/footer.js';
    import { auth, db } from './js/auth.js';
    document.addEventListener('DOMContentLoaded', () => {
        loadNavbar();
        loadFooter();
    });
</script>"""

script_regex = re.compile(r'<script type="module">\s*import\s*\{\s*loadNavbar\s*\}\s*from\s*\'\./js/navbar\.js\';\s*document\.addEventListener\(\'DOMContentLoaded\',\s*loadNavbar\);\s*</script>', re.DOTALL)

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # 1. Add header
    if '<header class="main-header"' not in content:
        content = re.sub(r'(<body[^>]*>)', r'\1\n    ' + header, content, count=1)
    
    # 2. Add footer
    if '<footer class="main-footer"></footer>' not in content:
        # Find the main container closing or the first script tag
        content = re.sub(r'(<script src="/js/script.js">|</main>)', footer + r'\n    \1', content, count=1)
        
    # 3. Replace navbar script with the full script
    content = script_regex.sub(new_script, content)
    
    with open(f, 'w') as file:
        file.write(content)
        
print("Fixed checkouts")
