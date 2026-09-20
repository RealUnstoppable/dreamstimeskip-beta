const fs = require('fs');

let content = fs.readFileSync('js/lyrics-data.js', 'utf8');

// Find the tate-mcrae block
const startIndex = content.indexOf('"tate-mcrae-its-okay-im-okay":');

if (startIndex > -1) {
    let replaced = content.substring(startIndex);
    
    // Add trending: true to the specific blocks
    replaced = replaced.replace(/("start": 45\.74,\n\s*"end": 47\.81,\n)/, '$1            "trending": true,\n');
    replaced = replaced.replace(/("start": 47\.81,\n\s*"end": 49\.87,\n)/, '$1            "trending": true,\n');
    replaced = replaced.replace(/("start": 49\.87,\n\s*"end": 51\.92,\n)/, '$1            "trending": true,\n');
    replaced = replaced.replace(/("start": 51\.92,\n\s*"end": 53\.02,\n)/, '$1            "trending": true,\n');
    replaced = replaced.replace(/("start": 53\.02,\n\s*"end": 55\.94,\n)/, '$1            "trending": true,\n');
    replaced = replaced.replace(/("start": 55\.94,\n\s*"end": 57\.25,\n)/, '$1            "trending": true,\n');
    replaced = replaced.replace(/("start": 57\.25,\n\s*"end": 60\.02,\n)/, '$1            "trending": true,\n');
    replaced = replaced.replace(/("start": 60\.02,\n\s*"end": 62\.86,\n)/, '$1            "trending": true,\n');
    
    content = content.substring(0, startIndex) + replaced;
    fs.writeFileSync('js/lyrics-data.js', content);
    console.log("Added viral markers!");
}
