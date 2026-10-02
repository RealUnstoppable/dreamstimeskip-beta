const fs = require('fs');

function patchFile(file) {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    content = content.replace(/                <td>\$\{escapeHTML\(song.artist\)\}<\/td>/g, 
        '                <td>${escapeHTML(song.artist)}</td>\n                <td style="color: #888;">${escapeHTML(song.tags && song.tags.length > 0 ? song.tags[0].charAt(0).toUpperCase() + song.tags[0].slice(1) : "Pop")}</td>'
    );

    fs.writeFileSync(file, content, 'utf8');
}

patchFile('js/harmonytunes.js');
patchFile('js/harmonytunes_new.js');
console.log("Patched");
