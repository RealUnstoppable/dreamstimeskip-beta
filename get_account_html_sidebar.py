import re

with open("account.html", "r") as f:
    content = f.read()

# Extract from <div class="admin-layout"> up to </aside>
match = re.search(r"<div class=\"admin-layout\">.*?</aside>", content, re.DOTALL)
if match:
    print(match.group(0))
