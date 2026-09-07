import re

with open("account.html", "r") as f:
    content = f.read()

# Extract from <script type="module">
match = re.search(r"<script type=\"module\">\n        import \{ auth, db \}.*?</script>", content, re.DOTALL)
if match:
    print(match.group(0))
