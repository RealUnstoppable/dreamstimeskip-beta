const fs = require('fs');
let code = fs.readFileSync('js/medixly-artists.js', 'utf8');

code = code.replace(
    /fileInput\.addEventListener\('change', \(e\) => {/,
    `
const artInput = document.getElementById('track-art');

fileInput.addEventListener('change', (e) => {
    const display = document.getElementById('file-name-display');
    if (e.target.files.length > 0) {
        if (display) display.innerHTML = \`<span style="color:#fff">\${e.target.files[0].name}</span>\`;
        if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
        audioBlobUrl = URL.createObjectURL(e.target.files[0]);
        audioPreview.src = audioBlobUrl;
        audioPreview.style.display = 'block';
    } else {
        if (display) display.innerHTML = '<span>Browse</span> or drop audio file';
    }
});

artInput.addEventListener('change', (e) => {
    const display = document.getElementById('art-name-display');
    if (e.target.files.length > 0) {
        if (display) display.innerHTML = \`<span style="color:#fff">\${e.target.files[0].name}</span>\`;
    } else {
        if (display) display.innerHTML = '<span>Browse</span> or drop image';
    }
});

// Original fileInput listener placeholder
`
);

fs.writeFileSync('js/medixly-artists.js', code);
