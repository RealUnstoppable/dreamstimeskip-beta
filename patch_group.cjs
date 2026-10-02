const fs = require('fs');

let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

js = js.replace(/export function groupSongsByTitle\(songs\) {/, `export function groupSongsByTitle(songs) {
    // Deduplicate exact matches by ID first
    songs = Array.from(new Map(songs.map(s => [s.id, s])).values());
`);

fs.writeFileSync('js/harmonytunes.js', js, 'utf8');
