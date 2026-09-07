import os
from bs4 import BeautifulSoup

workspace = "/Users/catalinandrian/Documents/GitHub/dreamstimeskip-beta"

def get_html_files(directory):
    html_files = []
    for root, _, files in os.walk(directory):
        if 'node_modules' in root or '.git' in root:
            continue
        for file in files:
            if file.endswith(".html"):
                html_files.append(os.path.join(root, file))
    return html_files

html_files = get_html_files(workspace)

broken_links = []
broken_buttons = []

for file_path in html_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
        
        # Check all links
        for a in soup.find_all('a'):
            href = a.get('href')
            onclick = a.get('onclick')
            if not href:
                continue
            
            # Internal files
            if href.endswith('.html'):
                target_path = os.path.join(workspace, href)
                if not os.path.exists(target_path):
                    broken_links.append((file_path, str(a), f"File {href} does not exist"))
            elif href == '#' and not onclick:
                 broken_links.append((file_path, str(a), f"href='#' without onclick"))
            elif href == '' and not onclick:
                 broken_links.append((file_path, str(a), f"Empty href without onclick"))

        # Check all buttons
        for btn in soup.find_all('button'):
            btn_type = btn.get('type')
            onclick = btn.get('onclick')
            # If button is in a form, it submits by default if type is not button
            in_form = btn.find_parent('form') is not None
            has_class = btn.get('class')
            
            if not onclick and not in_form and btn_type != 'submit':
                # Special exceptions: hamburger menu is handled in js
                if has_class and 'hamburger' in has_class:
                    continue
                # Swiper buttons
                if has_class and ('swiper-button-next' in has_class or 'swiper-button-prev' in has_class):
                    continue
                # Add to cart buttons might be handled in JS by class
                if has_class and 'add-to-cart' in has_class:
                    continue
                # Subscribe buttons in footer might be handled by JS? Wait, footer newsletter is a form.
                
                broken_buttons.append((file_path, str(btn), "No onclick, not in form, not a submit button. May have JS listener by class, needs manual check."))

    except Exception as e:
        print(f"Error parsing {file_path}: {e}")

print("# Broken Elements Report\n")
print("## Broken Links")
for file, el, reason in broken_links:
    rel_path = os.path.relpath(file, workspace)
    print(f"- **File:** {rel_path}\n  **Element:** `{el}`\n  **Issue:** {reason}\n")

print("## Potentially Broken Buttons (No inline action, not in form)")
for file, el, reason in broken_buttons:
    rel_path = os.path.relpath(file, workspace)
    print(f"- **File:** {rel_path}\n  **Element:** `{el}`\n  **Issue:** {reason}\n")

