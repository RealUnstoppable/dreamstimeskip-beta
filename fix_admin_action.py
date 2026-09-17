import re

with open('functions/index.js', 'r') as f:
    content = f.read()

# Remove the duplicate authenticateRequest
content = re.sub(r'async function authenticateRequest\(req, res, adminInstance\).*?}\n\n// 🔹 Create Checkout Session', '// 🔹 Create Checkout Session', content, flags=re.DOTALL)

with open('functions/index.js', 'w') as f:
    f.write(content)
