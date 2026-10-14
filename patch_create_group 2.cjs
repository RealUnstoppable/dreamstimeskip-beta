const fs = require('fs');

let js = fs.readFileSync('js/harmonytunes_new.js', 'utf8');

js = js.replace(
    /containerJumpBack\.innerHTML = librarySongs\.slice\(0, 2\)\.map\(song => createSongCard\(song\)\)\.join\(''\);/,
    `containerJumpBack.innerHTML = groupSongsByTitle(librarySongs).slice(0, 2).map(group => createGroupCard(group)).join('');`
);

js = js.replace(
    /const recommended = \[\.\.\.librarySongs\]\.sort\(\(\) => 0\.5 - Math\.random\(\)\);\n\s*containerRecommended\.innerHTML = recommended\.map\(song => createSongCard\(song\)\)\.join\(''\);/,
    `const recommended = groupSongsByTitle([...librarySongs]).sort(() => 0.5 - Math.random());\n        containerRecommended.innerHTML = recommended.map(group => createGroupCard(group)).join('');`
);

js = js.replace(
    /const trackListHTML = artistSongs\.map\(song => createSongCard\(song\)\)\.join\(''\);/,
    `const trackListHTML = groupSongsByTitle(artistSongs).map(group => createGroupCard(group)).join('');`
);

// We should also replace the export for createSongCard in case it breaks tests
js += `\nexport function createSongCard(song) { return createGroupCard({ baseTitle: song.title, baseSong: song, versions: [] }); }\n`;

fs.writeFileSync('js/harmonytunes.js', js, 'utf8');
console.log("Successfully replaced harmonytunes.js with grouped logic");
