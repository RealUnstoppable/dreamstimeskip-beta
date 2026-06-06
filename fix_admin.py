import os
import re

files = ['admin.html']

header = '<header class="main-header" style="position: relative; z-index: 50;">\n        <div id="navbar-placeholder"></div>\n    </header>\n'
footer = '<footer class="main-footer"></footer>\n'

new_script = """
    <script type="module">
        import { loadNavbar } from './js/navbar.js';
        import { loadFooter } from './js/footer.js';
        document.addEventListener('DOMContentLoaded', () => {
            loadNavbar();
            loadFooter();
        });
    </script>
"""

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # 1. Add header after body
    if '<header class="main-header"' not in content:
        # replace body display flex to column
        content = content.replace('            display: flex;\n            justify-content: center;\n            padding: 40px 20px;\n        }', '            display: flex;\n            flex-direction: column;\n            min-height: 100vh;\n        }\n        .admin-page-wrapper {\n            display: flex;\n            justify-content: center;\n            padding: 40px 20px;\n            flex-grow: 1;\n        }')
        
        # update media query
        content = content.replace('body { padding: 20px 10px; }', '.admin-page-wrapper { padding: 20px 10px; }')
        
        # Inject header and wrapper
        content = re.sub(r'(<body>)', r'\1\n    ' + header + r'    <div class="admin-page-wrapper">', content, count=1)
        
        # Inject wrapper close and footer
        content = re.sub(r'(    <script src="/js/script.js">)', r'    </div>\n    ' + footer + r'\n\1', content, count=1)
        
        # Inject script
        content = content.replace('<script src="/js/script.js"></script>', '<script src="/js/script.js"></script>\n' + new_script)
        
        # Add style.css
        content = content.replace('<link rel="stylesheet" href="/css/themes.css">', '<link rel="stylesheet" href="/css/style.css">\n    <link rel="stylesheet" href="/css/themes.css">')

    with open(f, 'w') as file:
        file.write(content)
        
print("Fixed admin.html")
