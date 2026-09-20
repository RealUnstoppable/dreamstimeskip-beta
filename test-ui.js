import fs from 'fs';
const code = fs.readFileSync('js/checkout.js', 'utf-8');
console.log("updateSummaryUI count:", [...code.matchAll(/function updateSummaryUI|const updateSummaryUI/g)].length);
