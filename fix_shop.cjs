const fs = require('fs');
let content = fs.readFileSync('js/shop.js', 'utf8');

// There are multiple definitions of `openReviewsModal`. We should only keep the first one and remove subsequent ones.
let match;
const regex = /async function openReviewsModal\(productId\) \{[\s\S]*?\n\}/g;

let matches = [];
while ((match = regex.exec(content)) !== null) {
  matches.push({start: match.index, end: regex.lastIndex, text: match[0]});
}

// If there are more than 1, replace them starting from the end
for (let i = matches.length - 1; i > 0; i--) {
  let m = matches[i];
  content = content.substring(0, m.start) + content.substring(m.end);
}

fs.writeFileSync('js/shop.js', content);
