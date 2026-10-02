import fs from 'fs';

// 1. Parse song-data.js
let songDataRaw = fs.readFileSync("js/song-data.js", "utf8");
songDataRaw = songDataRaw.replace(/export\s+/g, "");
const getSongs = new Function(songDataRaw + "\nreturn librarySongs;");
const librarySongs = getSongs();

// 2. Parse lyrics-data.js
let lyricsDataRaw = fs.readFileSync("js/lyrics-data.js", "utf8");
lyricsDataRaw = lyricsDataRaw.replace(/export\s+/g, "");
const getLyrics = new Function(lyricsDataRaw + "\nreturn lyricsData;");
const existingLyrics = getLyrics();

// 3. Find missing IDs
const missingIds = librarySongs.map(s => s.id).filter(id => !existingLyrics[id]);
console.log(`Found ${missingIds.length} songs missing from lyrics-data.js`);

if (missingIds.length > 0) {
    const newLyricsEntries = missingIds.map(id => `    "${id}": [
        {
            "start": 0,
            "end": 10,
            "trending": false,
            "words": [
                {
                    "text": "[Lyrics not yet available]",
                    "start": 0
                }
            ]
        }
    ]`).join(',\n');

    const rawStr = fs.readFileSync("js/lyrics-data.js", "utf8");
    const updatedLyrics = rawStr.replace(/\n\};$/m, `,\n${newLyricsEntries}\n};`);
    fs.writeFileSync("js/lyrics-data.js", updatedLyrics, "utf8");
    console.log("Updated js/lyrics-data.js successfully.");
}
