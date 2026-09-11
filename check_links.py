import os
import glob
import re

html_files = glob.glob("*.html")
all_files = set(os.listdir("."))

missing_links = {}

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # find all href="..."
    hrefs = re.findall(r'href="([^"]+)"', content)
    for href in hrefs:
        # Ignore external links, mailto, tel, fragments, and root slash if handled by server
        if href.startswith(('http://', 'https://', 'mailto:', 'tel:', '#')):
            if href == '#' and file not in ['index.html']: # Sometimes # is used for missing links
                 missing_links.setdefault(file, set()).add(href)
            continue
            
        # Remove queries and fragments
        clean_href = href.split('?')[0].split('#')[0]
        
        # If absolute path like /css/... convert to local
        if clean_href.startswith('/'):
            clean_href = clean_href[1:]
            
        if clean_href and not os.path.exists(clean_href):
            missing_links.setdefault(file, set()).add(href)

for file, links in missing_links.items():
    print(f"{file} has broken links: {', '.join(links)}")

