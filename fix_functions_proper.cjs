const fs = require('fs');
let content = fs.readFileSync('functions/index.js', 'utf8');

// The file has duplicated authenticateRequest, let's fix it by regex string replacements
// First, remove the FIRST authenticateRequest (the one with adminInstance)
content = content.replace(/async function authenticateRequest\(req, res, adminInstance\) \{[\s\S]*?\}\n/, '');

// Next, in adminAction, it's called twice. Let's fix that block.
content = content.replace(/    const decodedToken = await authenticateRequest\(req, res, admin\);\n    if \(\!decodedToken\) return;\n\n    const decodedToken = await authenticateRequest\(req, res\);\n    if \(\!decodedToken\) return;/g,
                          '    const decodedToken = await authenticateRequest(req, res);\n    if (!decodedToken) return;');

// Next, add the method check to the remaining authenticateRequest
content = content.replace(/async function authenticateRequest\(req, res\) \{\n  const authHeader = req.headers.authorization;/g,
`async function authenticateRequest(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return null;
  }

  const authHeader = req.headers.authorization;`);


fs.writeFileSync('functions/index.js', content);
