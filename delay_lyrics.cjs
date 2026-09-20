const fs = require('fs');

const lyricsFile = 'js/lyrics-data.js';
let content = fs.readFileSync(lyricsFile, 'utf8');

// We need to parse it. 
// A simple way is to remove the "export const lyricsData = " part, parse it as JSON... wait, the keys aren't quoted.
// Let's use eval or Function.
let objStr = content.replace('export const lyricsData = ', '').trim();
if (objStr.endsWith(';')) objStr = objStr.slice(0, -1);

// eval it
let lyricsData;
try {
    lyricsData = eval('(' + objStr + ')');
} catch (e) {
    console.error("Eval failed:", e);
    process.exit(1);
}

// Modify Tate McRae song
if (lyricsData['tate-mcrae-its-okay-im-okay']) {
    lyricsData['tate-mcrae-its-okay-im-okay'].forEach(line => {
        line.start += 14;
        line.end += 14;
        line.words.forEach(word => {
            word.start += 14;
        });
    });
}

// Write back
fs.writeFileSync(lyricsFile, 'export const lyricsData = ' + JSON.stringify(lyricsData, null, 4) + ';\n');
console.log("Lyrics delayed by 14s.");
