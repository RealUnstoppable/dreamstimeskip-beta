import re

with open('functions/index.js', 'r') as f:
    content = f.read()

# The function authenticateRequest should be before adminAction
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

// 🛡️ Shared Utils
function getUserDocRef(uid) {
  return admin.firestore().collection("users").doc(uid);
}
"""

content = content.replace('// 🔹 Create Checkout Session', auth_func + '\n// 🔹 Create Checkout Session')
# let's make sure we remove the original getUserDocRef and authenticateRequest we might have added later
content = re.sub(r'// 🛡️ Shared Utils.*?function getUserDocRef.*?}', '', content, flags=re.DOTALL)
content = re.sub(r'// 🛡️ Shared Auth Utility.*?async function authenticateRequest.*?}', '', content, flags=re.DOTALL)


with open('functions/index.js', 'w') as f:
    f.write(auth_func + '\n\n' + content.replace(auth_func + '\n// 🔹 Create Checkout Session', '// 🔹 Create Checkout Session'))
