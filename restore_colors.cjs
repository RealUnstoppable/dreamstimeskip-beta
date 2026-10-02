const fs = require('fs');

let css = fs.readFileSync('js/song-data.js', 'utf8');

const newColors = `export const songColors = {
    'pixy-legacy': '#5c4a3d',
    'deorc-decuple': '#1d3036',
    'no-pole-remix': '#a11f8b',
    'tate-mcrae-its-okay-im-okay': '#1a2b4c',
    'astrophage': '#00d4aa',
    'kesha-blow': '#e63995',
    'isabel-larosa-dont-make-them-like-me': '#4a2535',
    'default': 'linear-gradient(135deg, rgba(30, 30, 30, 0.8), rgba(10, 10, 10, 0.95))'
};`;

css = css.replace(/export const songColors = \{[\s\S]*?\};/, newColors);
fs.writeFileSync('js/song-data.js', css, 'utf8');
console.log("Restored song colors");
