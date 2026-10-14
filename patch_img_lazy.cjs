const fs = require('fs');
const files = ['js/medixly.js', 'js/medixly_new.js'];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // Replace images in createGroupCard / createSongCard
    const target = `<img src="\${escapeHTML(group.baseSong.art)}" alt="\${escapeHTML(group.baseTitle)}">`;
    const replacement = `<img src="\${escapeHTML(group.baseSong.art)}" alt="\${escapeHTML(group.baseTitle)}" loading="lazy">`;
    content = content.replace(target, replacement);

    const target2 = `<img src="\${escapeHTML(song.art)}" alt="\${escapeHTML(song.title)}">`;
    const replacement2 = `<img src="\${escapeHTML(song.art)}" alt="\${escapeHTML(song.title)}" loading="lazy">`;
    content = content.replace(target2, replacement2);

    fs.writeFileSync(file, content, 'utf8');
    console.log("Patched img lazy in " + file);
}
