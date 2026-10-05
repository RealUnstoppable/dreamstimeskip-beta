const fs = require('fs');

let js = fs.readFileSync('js/medixly.js', 'utf8');

js = js.replace(/export function groupSongsByTitle\(songs\) {/, `export function groupSongsByTitle(songs) {
    // Deduplicate exact matches by ID first
    songs = Array.from(new Map(songs.map(s => [s.id, s])).values());
`);

fs.writeFileSync('js/medixly.js', js, 'utf8');
