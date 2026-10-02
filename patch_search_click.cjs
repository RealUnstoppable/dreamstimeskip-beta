const fs = require('fs');
let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

const oldClick = `            row.addEventListener('click', activateFn);
            row.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateFn(); }
            });`;

const newClick = `            row.addEventListener('click', (e) => {
                if (e.target.closest('.card-more-btn')) return;
                activateFn();
            });
            row.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateFn(); }
            });`;

js = js.replace(oldClick, newClick);
fs.writeFileSync('js/harmonytunes.js', js, 'utf8');
console.log("Patched search click event");
