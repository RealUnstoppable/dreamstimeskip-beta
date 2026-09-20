import fs from 'fs';
const code = fs.readFileSync('js/checkout.js', 'utf-8');
const lines = code.split('\n');
console.log(lines.slice(155, 175).join('\n'));
