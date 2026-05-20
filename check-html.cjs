const fs = require('fs');
const html = fs.readFileSync('tracker.html', 'utf8');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  const code = match[1];
  try {
    new Function(code);
  } catch (e) {
    if (e.name !== 'SyntaxError') continue;
    console.error("Syntax Error found in inline script:", e.message);
    process.exit(1);
  }
}
console.log("No syntax errors found in inline scripts.");
