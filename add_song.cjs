const fs = require('fs');

const file = 'js/song-data.js';
let content = fs.readFileSync(file, 'utf8');

const newSong = `    {
        "id": "kobzx2z-take-my-hand",
        "title": "take my hand",
        "artist": "kobzx2z",
        "duration": "2:34",
        "src": "/music/kobzx2z_take_my_hand.mp3",
        "art": "/images/harmony-tunes-card.jpg",
        "bpm": 118,
        "energy": 0.8,
        "inmixPoint": 0,
        "outmixPoint": 154,
        "tags": [
            "pop"
        ]
    },
`;

content = content.replace('export const librarySongs = [', 'export const librarySongs = [\n' + newSong);

fs.writeFileSync(file, content, 'utf8');
console.log("Song added");
