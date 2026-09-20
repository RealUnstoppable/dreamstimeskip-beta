const fs = require('fs');
let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

js = js.replace(/'tate-mcrae-its-okay-im-okay': '#1a2b4c' \/\/ Deep Pink\n        'astrophage': '#2a0c3b' \/\/ Synthwave Dark Purple\n        'kesha-blow': '#e63995' \/\/ Neon Pink/, 
`'tate-mcrae-its-okay-im-okay': '#1a2b4c', // Deep Pink
        'astrophage': '#2a0c3b', // Synthwave Dark Purple
        'kesha-blow': '#e63995' // Neon Pink`);

fs.writeFileSync('js/harmonytunes.js', js);
console.log("Fixed commas.");
