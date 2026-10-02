const fs = require('fs');

let css = fs.readFileSync('css/themes.css', 'utf8');

// Rename dark to black
css = css.replace(/data-theme="dark"/g, 'data-theme="black"');

// Rename light to white
css = css.replace(/data-theme="light"/g, 'data-theme="white"');

// Ensure pink exists
if (!css.includes('data-theme="pink"')) {
    css += `

body[data-theme="pink"] {
    --bg-color: #3b1425;
    --primary-card-color: #4a2535;
    --secondary-card-color: #5c3546;
    --border-color: rgba(255, 153, 204, 0.3);
    --text-primary: #ffe6f2;
    --text-secondary: #ffb3d9;
    --input-bg: #2d0f1c;
}
`;
}

fs.writeFileSync('css/themes.css', css, 'utf8');
console.log("Updated themes.css");
