const fs = require('fs');

const path = 'js/lyrics-data.js';
let content = fs.readFileSync(path, 'utf8');

const newLyrics = `
    'summer-bummer': [
        { time: 0.0, text: "[Intro]" },
        { time: 10.0, text: "Summer bummer", trending: true },
        { time: 20.0, text: "Wrap you up in my daisy chains", trending: true },
        { time: 30.0, text: "Hip hop in the summer", trending: true },
        { time: 40.0, text: "Don't be a bummer, babe", trending: true }
    ],
    'on-the-floor': [
        { time: 0.0, text: "[Intro]" },
        { time: 5.0, text: "J-Lo! It's a new generation", trending: true },
        { time: 10.0, text: "Mr. Worldwide", trending: true },
        { time: 20.0, text: "If you go hard you gotta get on the floor", trending: true },
        { time: 30.0, text: "Dance the night away", trending: true }
    ],
    'radiance-harp': [
        { time: 0.0, text: "[Intro]" },
        { time: 5.0, text: "Radiance", trending: true },
        { time: 15.0, text: "The boy who played the harp", trending: true },
        { time: 25.0, text: "Strings attached to my heart", trending: true },
        { time: 35.0, text: "They hear the music when I walk", trending: true }
    ],
    'rockstar': [
        { time: 0.0, text: "[Intro]" },
        { time: 10.0, text: "I've been fuckin' hoes and poppin' pillies", trending: true },
        { time: 20.0, text: "Man, I feel just like a rockstar", trending: true },
        { time: 30.0, text: "All my brothers got that gas", trending: true },
        { time: 40.0, text: "And they always be smokin' like a Rasta", trending: true }
    ],
    'dead-fresh': [
        { time: 0.0, text: "[Intro]" },
        { time: 5.0, text: "Dead fresh", trending: true },
        { time: 15.0, text: "Came out the water", trending: true },
        { time: 25.0, text: "Drippin' so hard", trending: true },
        { time: 35.0, text: "Lookin' at the stars", trending: true }
    ],`;

content = content.replace("export const lyricsData = {", "export const lyricsData = {" + newLyrics);
fs.writeFileSync(path, content, 'utf8');
