const fs = require('fs');
let content = fs.readFileSync('js/shop.js', 'utf-8');
content = content.replace("        submitReviewBtn.textContent = originalText;\n    }\n}\n", "    }\n}\n");
fs.writeFileSync('js/shop.js', content, 'utf-8');
