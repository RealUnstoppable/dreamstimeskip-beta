const fs = require('fs');
let js = fs.readFileSync('js/harmonytunes.js', 'utf8');

// Tate McRae image
js = js.replace(/(id:\s*'tate-mcrae-its-okay-im-okay'[\s\S]*?art:\s*)["'].*?["']/, '$1"/images/tate_mcrae_its_okay_im_okay.png"');

// Fix paths for other songs
js = js.replace(/\/Volumes\/Catalin SD\/Catalin BKP\/Downloads\/Music&SFX\/Astrophage - Lupus Nocte\.mp3/g, '/music/Astrophage.mp3');
js = js.replace(/\/Volumes\/Catalin SD\/Catalin BKP\/Downloads\/Music&SFX\/PIXY - LEGACY\.mp3/g, '/music/PIXY - LEGACY.mp3');
js = js.replace(/\/Volumes\/Catalin SD\/Catalin BKP\/Downloads\/Music&SFX\/Blow - Kesha\.mp3/g, '/music/Blow - Kesha.mp3');
js = js.replace(/\/Volumes\/Catalin SD\/Catalin BKP\/Downloads\/Music&SFX\/ES_Deorc Decuple - FormantX\.mp3/g, '/music/ES_Deorc Decuple - FormantX.mp3');
js = js.replace(/\/Volumes\/Catalin SD\/Catalin BKP\/Downloads\/Music&SFX\/No Pole x Where Have You Been \(Remix\)\.mp3/g, '/music/No Pole x Where Have You Been (Remix).mp3');

fs.writeFileSync('js/harmonytunes.js', js);
console.log("Patched song links and art.");
