const fs = require('fs');
let content = fs.readFileSync('functions/index.js', 'utf8');

// The file has a duplicate authenticateRequest block right at the top due to a bad copy paste
const duplicateBlock = `
async function authenticateRequest(req, res, adminInstance) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return null;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return null;
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    return await adminInstance.auth().verifyIdToken(token);
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(401).send("Unauthorized");
    return null;
  }
}`;

content = content.replace(duplicateBlock, '');

// Also fix the double call inside adminAction
const doubleCall = `    const decodedToken = await authenticateRequest(req, res, admin);
    if (!decodedToken) return;

    const decodedToken = await authenticateRequest(req, res);
    if (!decodedToken) return;`;

content = content.replace(doubleCall, `    const decodedToken = await authenticateRequest(req, res);\n    if (!decodedToken) return;`);

// And add the POST method check to the remaining authenticateRequest
const newAuthMethod = `// 🛡️ Shared Auth Utility
async function authenticateRequest(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return null;
  }

  const authHeader = req.headers.authorization;`;

content = content.replace(`// 🛡️ Shared Auth Utility
async function authenticateRequest(req, res) {
  const authHeader = req.headers.authorization;`, newAuthMethod);

fs.writeFileSync('functions/index.js', content);
