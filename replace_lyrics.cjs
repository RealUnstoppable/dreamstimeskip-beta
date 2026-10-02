const fs = require('fs');
const newLyrics = JSON.parse(fs.readFileSync('generated_tate_lyrics.json', 'utf8'));

const lyricsFile = 'js/lyrics-data.js';
let content = fs.readFileSync(lyricsFile, 'utf8');

let objStr = content.replace('export const lyricsData = ', '').trim();
if (objStr.endsWith(';')) objStr = objStr.slice(0, -1);

let lyricsData = eval('(' + objStr + ')');
lyricsData['tate-mcrae-its-okay-im-okay'] = newLyrics;

fs.writeFileSync(lyricsFile, 'export const lyricsData = ' + JSON.stringify(lyricsData, null, 4) + ';\n');
console.log("Lyrics replaced successfully.");
