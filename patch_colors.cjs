const fs = require('fs');
let styleCss = fs.readFileSync('css/style.css', 'utf8');
let htCss = fs.readFileSync('css/harmonytunes.css', 'utf8');

const targetGradient = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), transparent 60%), linear-gradient(45deg, #ff007f 0%, #7f00ff 50%, #007fff 100%)`;
const oldGradient = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), transparent 60%), linear-gradient(to bottom, #0a192f 0%, #3b82f6 100%)`;
const oldGradient2 = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25), transparent 60%), linear-gradient(to bottom, #0a192f 0%, #3b82f6 100%)`;

styleCss = styleCss.replace(oldGradient, targetGradient);
styleCss = styleCss.replace(oldGradient, targetGradient); // Just in case it appears twice

// Fix border radius to be blobby
styleCss = styleCss.replace(/#siri-orb \{[^}]+border-radius:\s*50%;/g, match => match.replace('border-radius: 50%;', 'border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; background-size: 200% 200%;'));
styleCss = styleCss.replace(/\.sitewide-lexi-orb \{[^}]+border-radius:\s*50%;/g, match => match.replace('border-radius: 50%;', 'border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; background-size: 200% 200%;'));

// Also replace the color-cycle animation
styleCss = styleCss.replace(/#siri-orb \{([^}]+)animation:\s*blob-shape([^;}]+);/g, '#siri-orb {$1animation: blob-shape$2, color-cycle 15s ease-in-out infinite;');
styleCss = styleCss.replace(/\.sitewide-lexi-orb \{([^}]+)animation:\s*blob-shape([^;}]+);/g, '.sitewide-lexi-orb {$1animation: blob-shape$2, color-cycle 15s ease-in-out infinite;');

htCss = htCss.replace(oldGradient2, targetGradient);
htCss = htCss.replace(/\.lexi-mixxer-blob \{[^}]+border-radius:\s*50%;/g, match => match.replace('border-radius: 50%;', 'border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; background-size: 200% 200%;'));
htCss = htCss.replace(/\.lexi-mixxer-blob \{([^}]+)animation:\s*blob-shape([^;}]+);/g, '.lexi-mixxer-blob {$1animation: blob-shape$2, color-cycle 15s ease-in-out infinite;');

fs.writeFileSync('css/style.css', styleCss, 'utf8');
fs.writeFileSync('css/harmonytunes.css', htCss, 'utf8');
