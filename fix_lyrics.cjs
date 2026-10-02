const fs = require('fs');

const path = 'js/lyrics-data.js';
let content = fs.readFileSync(path, 'utf8');

// The incorrect format is: { time: 0.0, text: "[Intro]", trending: true }
// We need to change it to: { start: 0.0, end: 5.0, trending: true, words: [{text: "[Intro]", start: 0.0}] }

const idsToFix = [
    'summer-bummer',
    'on-the-floor',
    'radiance-harp',
    'rockstar',
    'dead-fresh',
    'isabel-larosa-dont-make-them-like-me'
];

let moduleContent = content.replace('export const lyricsData = ', '');
let data;
try {
    // evaluating it as a module is hard, but it's just an object
    // I can parse it using eval since it's just JS object notation
    eval(`data = ${moduleContent}`);
} catch (e) {
    console.error("Eval failed", e);
}

if (data) {
    for (let id of idsToFix) {
        if (data[id]) {
            data[id] = data[id].map((line, i, arr) => {
                // If it already has words, it's fine
                if (line.words) return line;
                
                let start = line.time !== undefined ? line.time : (line.start !== undefined ? line.start : 0);
                let text = line.text || "";
                let nextStart = arr[i+1] ? (arr[i+1].time !== undefined ? arr[i+1].time : arr[i+1].start) : start + 5;
                
                return {
                    start: start,
                    end: nextStart,
                    trending: line.trending || false,
                    words: [
                        { text: text, start: start }
                    ]
                };
            });
        }
    }
    
    fs.writeFileSync(path, 'export const lyricsData = ' + JSON.stringify(data, null, 4) + ';', 'utf8');
    console.log("Lyrics fixed!");
}
