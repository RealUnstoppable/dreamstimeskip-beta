const fs = require('fs');

const content = fs.readFileSync('admin.html', 'utf8');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;

let match;
while ((match = scriptRegex.exec(content)) !== null) {
  let code = match[1];
  code = code.replace(/import\s+(?:(?:\*\s+as\s+\w+|[\w\s{},*]+)\s+from\s+)?['"][^'"]+['"];?/g, '');
  try {
    new Function(code);
    console.log("Script block OK");
  } catch(e) {
    console.error("Syntax Error in script:", e);
  }
}
