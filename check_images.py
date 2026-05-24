import glob
import re
import os

html_files = glob.glob("*.html")
missing_images = []

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # find all src="..."
    srcs = re.findall(r'src="([^"]+)"', content)
    for src in srcs:
        if src.startswith(('http://', 'https://', 'data:')):
            continue
        
        clean_src = src.split('?')[0].split('#')[0]
        if clean_src.startswith('/'):
            clean_src = clean_src[1:]
            
        if clean_src and not os.path.exists(clean_src):
            missing_images.append(f"{file} missing image: {src}")

for issue in missing_images:
    print(issue)
if not missing_images:
    print("No missing images found.")
