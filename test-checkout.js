import fs from 'fs';
const code = fs.readFileSync('js/checkout.js', 'utf-8');
console.log("Discount declarations:", [...code.matchAll(/let discount/g)].length);
