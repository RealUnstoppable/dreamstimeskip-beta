import os
import glob
import re

html_files = glob.glob("*.html")
issues = []

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    missing = []
    if '<header class="main-header"' not in content:
        missing.append("header")
    if '<footer class="main-footer"' not in content:
        missing.append("footer")
    if 'loadNavbar' not in content:
        missing.append("loadNavbar")
    if 'loadFooter' not in content:
        missing.append("loadFooter")
        
    if missing:
        issues.append(f"{file}: missing {', '.join(missing)}")

print("Issues found:")
for issue in issues:
    print(issue)
