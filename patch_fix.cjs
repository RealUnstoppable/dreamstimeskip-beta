const fs = require('fs');

// 1. Fix js/harmonytunes.js
let jsContent = fs.readFileSync('js/harmonytunes.js', 'utf8');
jsContent = jsContent.replace("viewLibrary.style.display = 'none';", "");
jsContent = jsContent.replace("viewArtist.style.display = 'none';", "");
jsContent = jsContent.replace("viewBlog.style.display = 'none';", "");
fs.writeFileSync('js/harmonytunes.js', jsContent, 'utf8');

// 2. Fix harmonytunes.html
let htmlContent = fs.readFileSync('harmonytunes.html', 'utf8');
htmlContent = htmlContent.replace('/js/harmonytunes.js?v=20260920b', '/js/harmonytunes.js?v=20260923c');
fs.writeFileSync('harmonytunes.html', htmlContent, 'utf8');

console.log("Patch applied successfully.");
