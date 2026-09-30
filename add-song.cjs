const fs = require('fs');

// 1. song-data.js
let songData = fs.readFileSync('js/song-data.js', 'utf8');

const newSongObj = `    {
        "id": "raindance-santan-dave",
        "title": "Raindance",
        "artist": "Santan Dave",
        "duration": "3:39",
        "src": "https://firebasestorage.googleapis.com/v0/b/dts-hub-website.firebasestorage.app/o/music%2Fraindance-santan-dave.mp3?alt=media&token=c4b3cc73-da7b-4f22-b506-b29e39e5338f",
        "art": "/images/blank_cover.svg",
        "bpm": 120,
        "energy": 0.7,
        "inmixPoint": 10,
        "outmixPoint": 10,
        "tags": ["untagged"]
    }`;

songData = songData.replace(
    /(\n\];\s*\n\nexport (function|const))/,
    `,\n${newSongObj}\n];\n\nexport $2`
);

fs.writeFileSync('js/song-data.js', songData, 'utf8');

// 2. lyrics-data.js
let lyricsData = fs.readFileSync('js/lyrics-data.js', 'utf8');

const newLyricsObj = `    "raindance-santan-dave": [
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
    ]`;

lyricsData = lyricsData.replace(
    /\n\};$/m,
    `,\n${newLyricsObj}\n};`
);

fs.writeFileSync('js/lyrics-data.js', lyricsData, 'utf8');

console.log("Song and lyrics added.");
