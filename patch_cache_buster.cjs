const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const now = Date.now().toString();

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let patched = content.replace(/\?v=\d+/g, '?v=' + now);
    if (patched !== content) {
        fs.writeFileSync(file, patched, 'utf8');
        console.log("Bumped cache in " + file);
    }
}
