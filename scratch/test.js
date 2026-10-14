import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const html = fs.readFileSync('medixly.html', 'utf-8');
const dom = new JSDOM(html, {
    url: "http://localhost/medixly.html",
    runScripts: "dangerously",
    resources: "usable"
});

dom.window.onerror = function(msg, source, lineno, colno, error) {
    console.error("PAGE ERROR:", msg, source, lineno, colno, error);
};

dom.window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Rejection:', event.reason);
});

setTimeout(() => {
    console.log("Done waiting");
    process.exit(0);
}, 3000);
