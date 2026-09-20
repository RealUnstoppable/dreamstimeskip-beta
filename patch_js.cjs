const fs = require('fs');
let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

// Replace loadSong logic
js = js.replace(/const paintSpillEffect = document\.getElementById\('paint-spill-effect'\);\s*if \(paintSpillEffect\) \{\s*if \(song\.id === 'tate-mcrae-its-okay-im-okay'\) \{\s*paintSpillEffect\.classList\.remove\('hidden'\);\s*setTimeout\(\(\) => paintSpillEffect\.classList\.add\('active'\), 50\);\s*\} else \{\s*paintSpillEffect\.classList\.remove\('active'\);\s*setTimeout\(\(\) => paintSpillEffect\.classList\.add\('hidden'\), 500\);\s*\}\s*\}/, 
`const paintSpillEffects = document.querySelectorAll('.paint-spill-effect');
        paintSpillEffects.forEach(paintSpillEffect => {
            if (song.id === 'tate-mcrae-its-okay-im-okay') {
                paintSpillEffect.classList.remove('hidden');
                setTimeout(() => paintSpillEffect.classList.add('active'), 50);
            } else {
                paintSpillEffect.classList.remove('active');
                setTimeout(() => paintSpillEffect.classList.add('hidden'), 500);
            }
        });`);

// Replace beat logic
js = js.replace(/const effect = document\.getElementById\('paint-spill-effect'\);\s*if \(effect\) \{\s*effect\.classList\.remove\('beat'\);\s*void effect\.offsetWidth; \/\/ trigger reflow\s*effect\.classList\.add\('beat'\);\s*\}/,
`const effects = document.querySelectorAll('.paint-spill-effect');
                        effects.forEach(effect => {
                            effect.classList.remove('beat');
                            void effect.offsetWidth; // trigger reflow
                            effect.classList.add('beat');
                        });`);

fs.writeFileSync('js/harmonytunes.js', js);
console.log("Patched harmonytunes.js");
