import re

with open("account.html", "r") as f:
    content = f.read()

# Extract from <main> up to </main>
match = re.search(r"<div class=\"sidebar\">.*?</div>", content, re.DOTALL)
if match:
    print(match.group(0))
