const fs = require('fs');
let code = fs.readFileSync('js/harmonytunes.js', 'utf8');

// Patch toggleLyrics
const oldToggle = `                setTimeout(() => {
                    viewLyrics.style.display = 'none';
                    lyricsBtn.style.color = '#b3b3b3';
                    if(fsLyricsBtn) fsLyricsBtn.style.color = '#b3b3b3';
                    if(mobLyricsBtn) mobLyricsBtn.style.color = '#b3b3b3';
                }, 300);`;
const newToggle = `                setTimeout(() => {
                    viewLyrics.style.display = 'none';
                    viewHome.style.display = 'block';
                    lyricsBtn.style.color = '#b3b3b3';
                    if(fsLyricsBtn) fsLyricsBtn.style.color = '#b3b3b3';
                    if(mobLyricsBtn) mobLyricsBtn.style.color = '#b3b3b3';
                }, 300);`;
code = code.replace(oldToggle, newToggle);

// Patch closeLyricsBtn
const oldClose = `        closeLyricsBtn.addEventListener('click', () => {
            viewLyrics.classList.remove('slide-up-active');
            viewLyrics.classList.add('slide-down-active');
            setTimeout(() => {
                viewLyrics.style.display = 'none';
                viewLyrics.classList.remove('slide-down-active');
            }, 400);
        });`;
const newClose = `        closeLyricsBtn.addEventListener('click', () => {
            viewLyrics.classList.remove('slide-up-active');
            viewLyrics.classList.add('slide-down-active');
            setTimeout(() => {
                viewLyrics.style.display = 'none';
                viewHome.style.display = 'block';
                viewLyrics.classList.remove('slide-down-active');
            }, 400);
        });`;
code = code.replace(oldClose, newClose);

fs.writeFileSync('js/harmonytunes.js', code, 'utf8');
console.log("Lyrics close bug fixed.");
