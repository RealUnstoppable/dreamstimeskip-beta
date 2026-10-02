const fs = require('fs');
const file = 'js/harmonytunes_new.js';
if(!fs.existsSync(file)) return;
let content = fs.readFileSync(file, 'utf8');

const target = '                <td style="text-align: right;">${escapeHTML(song.duration)}</td>\\n            `;';
const replacement = '                <td style="text-align: right;">${escapeHTML(song.duration)}</td>\\n            `;\\n            row.dataset.songId = song.id;';

content = content.replace(/<td style="text-align: right;">\$\{escapeHTML\(song\.duration\)\}<\/td>\s+`;/g, '<td style="text-align: right;">${escapeHTML(song.duration)}</td>\n            `;\n            row.dataset.songId = song.id;');

fs.writeFileSync(file, content, 'utf8');
console.log("Patched dataset for new.");
