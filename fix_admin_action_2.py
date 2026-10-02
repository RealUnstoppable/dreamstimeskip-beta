import re

with open('functions/index.js', 'r') as f:
    content = f.read()

# Fix the duplicate const decodedToken = await authenticateRequest(req, res);
content = re.sub(
    r'    const decodedToken = await authenticateRequest\(req, res, admin\);\n    if \(\!decodedToken\) return;\n\n    const decodedToken = await authenticateRequest\(req, res\);\n    if \(\!decodedToken\) return;',
    r'    const decodedToken = await authenticateRequest(req, res);\n    if (!decodedToken) return;',
    content
)

# And make authenticateRequest use admin if adminInstance is gone, we check it.
content = re.sub(r'adminInstance\.auth\(\)', 'admin.auth()', content)


with open('functions/index.js', 'w') as f:
    f.write(content)
