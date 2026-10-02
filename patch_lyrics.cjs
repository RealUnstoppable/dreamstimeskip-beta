const fs = require('fs');

const file = 'js/lyrics-data.js';
let content = fs.readFileSync(file, 'utf8');

const lyrics = `
    "kobzx2z-take-my-hand": [
        { "start": 0, "end": 4, "trending": false, "words": [ { "text": "(Instrumental)", "start": 0 } ] },
        { "start": 5, "end": 8, "trending": false, "words": [ 
            { "text": "I", "start": 5.0 },
            { "text": "found", "start": 5.5 },
            { "text": "a", "start": 6.0 },
            { "text": "girl,", "start": 6.5 },
            { "text": "real", "start": 7.0 },
            { "text": "superstar", "start": 7.5 }
        ]},
        { "start": 8, "end": 12, "trending": false, "words": [ 
            { "text": "She's", "start": 8.0 },
            { "text": "got", "start": 8.5 },
            { "text": "it", "start": 9.0 },
            { "text": "all,", "start": 9.5 },
            { "text": "the", "start": 10.0 },
            { "text": "face", "start": 10.5 },
            { "text": "card", "start": 11.0 }
        ]},
        { "start": 12, "end": 16, "trending": false, "words": [ 
            { "text": "And", "start": 12.0 },
            { "text": "I", "start": 12.5 },
            { "text": "know", "start": 13.0 },
            { "text": "she's", "start": 13.5 },
            { "text": "worth", "start": 14.0 },
            { "text": "any", "start": 14.5 },
            { "text": "amount", "start": 15.0 }
        ]},
        { "start": 16, "end": 20, "trending": true, "words": [ 
            { "text": "Baby", "start": 16.0 },
            { "text": "take", "start": 17.0 },
            { "text": "my", "start": 18.0 },
            { "text": "hand", "start": 19.0 }
        ]}
    ],
`;

content = content.replace('export const lyricsData = {', 'export const lyricsData = {\n' + lyrics);

fs.writeFileSync(file, content, 'utf8');
console.log("Lyrics patched");
