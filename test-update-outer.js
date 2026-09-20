import fs from 'fs';
const code = fs.readFileSync('js/checkout.js', 'utf-8');
const discountMatches = code.match(/let discount =/g);
console.log(discountMatches);
