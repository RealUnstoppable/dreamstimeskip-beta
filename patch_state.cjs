const fs = require('fs');
let code = fs.readFileSync('js/harmonytunes.js', 'utf8');

// The line is:
// currentSongIndex = typeof saved.queueIndex === 'number' && saved.queueIndex < currentQueue.length ? saved.queueIndex : 0;
// We need to change it to:
// let foundIndex = saved.songId ? currentQueue.findIndex(s => s.id === saved.songId) : -1;
// currentSongIndex = foundIndex !== -1 ? foundIndex : (typeof saved.queueIndex === 'number' && saved.queueIndex < currentQueue.length ? saved.queueIndex : 0);

const target = "currentSongIndex = typeof saved.queueIndex === 'number' && saved.queueIndex < currentQueue.length ? saved.queueIndex : 0;";
const replacement = `let foundIndex = saved.songId ? currentQueue.findIndex(s => s.id === saved.songId) : -1;
                currentSongIndex = foundIndex !== -1 ? foundIndex : (typeof saved.queueIndex === 'number' && saved.queueIndex < currentQueue.length ? saved.queueIndex : 0);`;

code = code.replace(target, replacement);

fs.writeFileSync('js/harmonytunes.js', code, 'utf8');
console.log("State transfer patched.");
