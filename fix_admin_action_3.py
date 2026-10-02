import re

with open('functions/index.js', 'r') as f:
    content = f.read()

# Add authenticateRequest back if it's missing (it was deleted by the first replace)
auth_func = """
// 🛡️ Shared Auth Utility
async function authenticateRequest(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return null;
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    return await admin.auth().verifyIdToken(token);
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(401).send("Unauthorized");
    return null;
  }
}
"""

if "async function authenticateRequest" not in content:
    content = content.replace("// 🛡️ Shared Utils", auth_func + "\n// 🛡️ Shared Utils")


with open('functions/index.js', 'w') as f:
    f.write(content)
