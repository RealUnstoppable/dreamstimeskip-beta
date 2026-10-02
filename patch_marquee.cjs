const fs = require('fs');

// Patch HTML
let html = fs.readFileSync('harmonytunes.html', 'utf8');

// Wrap player-song-title
html = html.replace(/<p id="player-song-title">(.*?)<\/p>/, '<div class="title-marquee"><p id="player-song-title">$1</p></div>');

// Replace script src cache buster
html = html.replace(/js\/harmonytunes\.js\?v=\d+/, `js/harmonytunes.js?v=${Date.now()}`);
html = html.replace(/"js\/harmonytunes\.js"/, `"js/harmonytunes.js?v=${Date.now()}"`);

fs.writeFileSync('harmonytunes.html', html);

// Patch CSS
let css = fs.readFileSync('css/harmonytunes.css', 'utf8');
css += `\n
.title-marquee {
    width: 150px;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
}

.title-marquee p {
    display: inline-block;
    min-width: 100%;
    animation: scroll-left 8s linear infinite;
}

@keyframes scroll-left {
    0% {
        transform: translateX(100%);
    }
    100% {
        transform: translateX(-100%);
    }
}
`;
fs.writeFileSync('css/harmonytunes.css', css);

console.log("Patched marquee and cache buster");
