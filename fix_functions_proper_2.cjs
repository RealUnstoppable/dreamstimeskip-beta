const fs = require('fs');
let content = fs.readFileSync('functions/index.js', 'utf8');

// 1. Remove the first authenticateRequest definition
content = content.replace(/async function authenticateRequest\(req, res, adminInstance\) \{[\s\S]*?\}\n/, '');

// 2. Add the method check to the remaining authenticateRequest
content = content.replace(/async function authenticateRequest\(req, res\) \{\n  const authHeader = req\.headers\.authorization;/g,
`async function authenticateRequest(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return null;
  }

  const authHeader = req.headers.authorization;`);

// 3. Remove the redundant call and use the correct one in adminAction
content = content.replace(/    const decodedToken = await authenticateRequest\(req, res, admin\);\n    if \(\!decodedToken\) return;\n\n    const decodedToken = await authenticateRequest\(req, res\);\n/g,
`    const decodedToken = await authenticateRequest(req, res);
`);

fs.writeFileSync('functions/index.js', content);
