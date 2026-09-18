import fs from 'fs';
const code = fs.readFileSync('js/checkout.js', 'utf-8');
console.log(code.includes("let discount"));
