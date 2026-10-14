const fs = require('fs');
const file = 'js/medixly_new.js';
if(!fs.existsSync(file)) return;
let content = fs.readFileSync(file, 'utf8');

const target = `                ...currentQueue.slice(currentSongIndex + 1).map(s => ({...s, isUserQueue: false}))`;
const replacement = `                ...currentQueue.slice(currentSongIndex + 1, currentSongIndex + 51).map(s => ({...s, isUserQueue: false}))`;

content = content.replace(target, replacement);

const targetHistory = `            displayList = [...historyQueue].reverse(); // Most recent first`;
const replacementHistory = `            displayList = [...historyQueue].reverse().slice(0, 50); // Most recent first, cap at 50`;

content = content.replace(targetHistory, replacementHistory);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched queue new.");
