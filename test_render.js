const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");

const dom = new JSDOM(fs.readFileSync("harmonytunes.html", "utf8"));
const document = dom.window.document;

function escapeHTML(str) {
    if (str == null) return "";
    if (typeof str !== 'string') str = String(str);
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

let contentStr = fs.readFileSync("js/lyrics-data.js", "utf8");
contentStr = contentStr.replace("export const lyricsData = ", "");
const data = eval("(" + contentStr + ")");

const songId = "summer-bummer";
const songData = data[songId];
const lyricsContent = document.getElementById("lyrics-content");

lyricsContent.innerHTML = songData.map((line, lineIndex) => {
    const wordsHtml = line.words.map((word, wordIndex) => {
        return `<span class="lyric-word" data-start="${escapeHTML(word.start)}">${escapeHTML(word.text)}</span>`;
    }).join(' ');
    const trendingClass = line.trending ? ' trending-lyric' : '';
    
    let badgeHtml = '';
    if (line.trending && (!songData[lineIndex - 1] || !songData[lineIndex - 1].trending)) {
        badgeHtml = `<div style="font-size: 0.8rem; font-weight: bold; color: #00BFFF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; display: flex; align-items: center; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>Viral</div>`;
    }
    
    return `${badgeHtml}<div class="lyric-line${trendingClass}" data-start="${escapeHTML(line.start)}" data-end="${escapeHTML(line.end)}">${wordsHtml}</div>`;
}).join('');

console.log(lyricsContent.innerHTML.substring(0, 500));
