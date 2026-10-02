const fs = require('fs');
const files = ['js/harmonytunes.js', 'js/harmonytunes_new.js'];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    // The line is: document.getElementById('container-jumpback').innerHTML = groupSongsByTitle(filtered).map(group => createGroupCard(group)).join('');
    // And also we might need to check if it's new harmonytunes which might use createSongCard
    
    // We can just cap the filtered list or cap the map.
    const target = `groupSongsByTitle(filtered).map`;
    const replacement = `groupSongsByTitle(filtered).slice(0, 50).map`;
    
    // For harmonytunes_new, it might be filtered.map(song => createSongCard(song))
    const target2 = `innerHTML = filtered.map(song => createSongCard(song)).join('')`;
    const replacement2 = `innerHTML = filtered.slice(0, 50).map(song => createSongCard(song)).join('')`;

    let changed = false;
    if (content.includes(target)) {
        content = content.replace(target, replacement);
        changed = true;
    }
    if (content.includes(target2)) {
        content = content.replace(target2, replacement2);
        changed = true;
    }
    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log("Patched jumpback search in " + file);
    }
}
