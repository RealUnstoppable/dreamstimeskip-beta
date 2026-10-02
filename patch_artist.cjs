const fs = require('fs');
const files = ['js/harmonytunes.js', 'js/harmonytunes_new.js'];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    const target1 = `const trackListHTML = groupSongsByTitle(artistSongs).map(group => createGroupCard(group)).join('');`;
    const replacement1 = `const trackListHTML = groupSongsByTitle(artistSongs).slice(0, 50).map(group => createGroupCard(group)).join('');`;

    const target2 = `const trackListHTML = artistSongs.map(song => createSongCard(song)).join('');`;
    const replacement2 = `const trackListHTML = artistSongs.slice(0, 50).map(song => createSongCard(song)).join('');`;

    let changed = false;
    if (content.includes(target1)) {
        content = content.replace(target1, replacement1);
        changed = true;
    } else if (content.includes(target2)) {
        content = content.replace(target2, replacement2);
        changed = true;
    }
    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log("Patched artist in " + file);
    }
}
