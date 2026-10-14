const fs = require('fs');
const file = 'js/harmonytunes_new.js';
if(!fs.existsSync(file)) return;
let content = fs.readFileSync(file, 'utf8');

const target = `                    <iframe src="https://www.tiktok.com/embed/v2/\${video.id}" 
                        style="width: 100%; height: 100%; border: none;" 
                        scrolling="no" 
                        allow="encrypted-media;">
                    </iframe>`;
const replacement = `                    <iframe src="https://www.tiktok.com/embed/v2/\${video.id}" 
                        style="width: 100%; height: 100%; border: none;" 
                        scrolling="no" 
                        allow="encrypted-media;"
                        loading="lazy">
                    </iframe>`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content, 'utf8');
console.log("Patched tiktok lazy loading new.");
