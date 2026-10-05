const fs = require('fs');

const jsFiles = ['js/sitewide-player.js', 'js/medixly.js'];
const now = Date.now().toString();

for (const file of jsFiles) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        let patched = content.replace(/\?v=\d+/g, '?v=' + now);
        if (patched !== content) {
            fs.writeFileSync(file, patched, 'utf8');
            console.log("Bumped cache in " + file);
        }
    }
}
