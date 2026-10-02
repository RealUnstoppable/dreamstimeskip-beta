const fs = require('fs');
let content = fs.readFileSync('functions/index.js', 'utf8');

// 1. Remove duplicated authenticateRequest (the first one with adminInstance)
content = content.replace(/async function authenticateRequest\(req, res, adminInstance\).*?\}\n/s, '');

// 2. Remove duplicated authenticateRequest call in adminAction
content = content.replace(/    const decodedToken = await authenticateRequest\(req, res, admin\);\n    if \(\!decodedToken\) return;\n\n/s, '');

// 3. Make sure the remaining authenticateRequest has method check
const authFuncStr = `// 🛡️ Shared Auth Utility
async function authenticateRequest(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return null;
  }

  const authHeader = req.headers.authorization;`;
content = content.replace(/\/\/ 🛡️ Shared Auth Utility\nasync function authenticateRequest\(req, res\) \{\n  const authHeader = req\.headers\.authorization;/s, authFuncStr);

fs.writeFileSync('functions/index.js', content);
