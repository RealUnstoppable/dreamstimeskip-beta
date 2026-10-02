const fs = require('fs');

const lyricsRaw = `[Intro]
Ah-ah, ah-ah, ah
Ah-ah, ah-ah, ah
Ah-ah, ah-ah, ah
[Verse 1]
Thought it was enough
Thought I closed the door
But you left some windows open, you
You might call it love
Somethin' in your cup
It's not as intoxicating
[Pre-Chorus]
Had to tell me you found somebody new
But the pictures are down when she's in your room
[Chorus]
When you kiss her, kiss her softly
Searchin' down her body
Boy, don't waste your time because you know what you need
Kiss her, kiss her softly
Searchin' for my copy
Yeah, she might come close, but they don't make 'em like me
Make 'em like—
[Post-Chorus]
Ah-ah, ah-ah, ah
Ah-ah, ah-ah, ah
Ah-ah, ah-ah, ah`;

const lines = lyricsRaw.split('\n').filter(l => l.trim() !== '');

let time = 0;
const timeStep = 125 / lines.length; // 2 minutes 5 seconds = 125 seconds

const result = lines.map((line, idx) => {
    let t = time;
    time += timeStep;
    let isTrending = false;
    if (line.includes("kiss her softly") || line.includes("don't make 'em like me")) {
        isTrending = true;
    }
    return `    { time: ${t.toFixed(1)}, text: ${JSON.stringify(line)}${isTrending ? ', trending: true' : ''} }`;
});

const output = `    'isabel-larosa-dont-make-them-like-me': [\n${result.join(',\n')}\n    ]`;
console.log(output);
