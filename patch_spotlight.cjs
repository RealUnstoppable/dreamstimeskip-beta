const fs = require('fs');
const files = ['js/harmonytunes.js', 'js/harmonytunes_new.js'];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');

    const target = `const groupedMatches = groupSongsByTitle(matches);`;
    const replacement = `const groupedMatches = groupSongsByTitle(matches.slice(0, 50)); // Cap to 50 results to prevent UI lag`;

    // Try without groupSongsByTitle as well, just in case harmonytunes_new uses matches directly
    const target2 = `        spotlightResults.innerHTML = matches.map(song => {`;
    const replacement2 = `        spotlightResults.innerHTML = matches.slice(0, 50).map(song => {`;

    if (content.includes(target)) {
        content = content.replace(target, replacement);
    } else if (content.includes(target2)) {
        content = content.replace(target2, replacement2);
    }
    fs.writeFileSync(file, content, 'utf8');
}
console.log("Patched spotlight.");
