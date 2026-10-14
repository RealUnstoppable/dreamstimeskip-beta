const fs = require('fs');
let code = fs.readFileSync('js/medixly-artists.js', 'utf8');

code = code.replace(
/\/\/ Original fileInput listener placeholder[\s\S]*?\}\);\s*function createLyricLine/m,
`function createLyricLine`
);

fs.writeFileSync('js/medixly-artists.js', code);
