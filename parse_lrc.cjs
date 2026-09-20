const fs = require('fs');

const lyricsStr = `
- text: See you so excited
  start_ms: 12720
  end_ms: 14970
- text: You got him locked down
  start_ms: 14970
  end_ms: 17030
- text: You're moving like I did
  start_ms: 17030
  end_ms: 18890
- text: Before I found out
  start_ms: 18890
  end_ms: 21240
- text: He ain't just a pretty-faced talker
  start_ms: 21240
  end_ms: 22930
- text: Good with his money, close to his mother
  start_ms: 22930
  end_ms: 25170
- text: You're seeing one-sided
  start_ms: 25170
  end_ms: 27190
- text: You got him right now
  start_ms: 27190
  end_ms: 29410
- text: And shed be like, "He's so perfect"
  start_ms: 29410
  end_ms: 31310
- text: I be like, "OH, what version?"
  start_ms: 31310
  end_ms: 33530
- text: '"Ain''t nobody got me this nervous"'
  start_ms: 33530
  end_ms: 35620
- text: Oh baby, I been there
  start_ms: 35620
  end_ms: 37910
- text: And right in that same position
  start_ms: 37910
  end_ms: 39990
- text: So baby don't get this twisted
  start_ms: 39990
  end_ms: 41860
- text: No, nothing could make me miss it
  start_ms: 41860
  end_ms: 43870
- text: Take him he's yours
  start_ms: 43870
  end_ms: 45740
- text: It's okay, I'm okay, had him in the first place
  start_ms: 45740
  end_ms: 47810
- text: It's okay, I'm okay (I'm okay, yeah, yeah)
  start_ms: 47810
  end_ms: 49870
- text: It's okay, I'm okay, I don't really gotta say
  start_ms: 49870
  end_ms: 51920
- text: It's okay
  start_ms: 51920
  end_ms: 53020
- text: You can have him anyway
  start_ms: 53020
  end_ms: 55940
- text: Anyway
  start_ms: 55940
  end_ms: 57250
- text: You can have him anyway
  start_ms: 57250
  end_ms: 60020
- text: Anyway
  start_ms: 60020
  end_ms: 62860
- text: Was such a romantic
  start_ms: 62860
  end_ms: 64980
- text: You got me like, "Fuck that"
  start_ms: 64980
  end_ms: 67040
- text: Some months and some long flights
  start_ms: 67040
  end_ms: 68970
- text: No I can't go near that
  start_ms: 68970
  end_ms: 71250
- text: And shed be like, "He's so perfect"
  start_ms: 71250
  end_ms: 73500
- text: I be like, "Oh what version?"
  start_ms: 73500
  end_ms: 75220
- text: '"Ain''t nobody got me this nervous'
  start_ms: 75220
  end_ms: 77570
- text: Oh, baby, I've been there
  start_ms: 77570
  end_ms: 79670
- text: And right in that same position
  start_ms: 79670
  end_ms: 81660
- text: So baby, don't get this twisted
  start_ms: 81660
  end_ms: 83470
- text: No nothin' could make me miss it
  start_ms: 83470
  end_ms: 85600
- text: Take him he's yours
  start_ms: 85600
  end_ms: 87480
- text: It's okay, I'm okay, had him in the first place
  start_ms: 87480
  end_ms: 89530
- text: It's okay, I'm okay
  start_ms: 89530
  end_ms: 91610
- text: It's okay, I'm okay, I don't really gotta say
  start_ms: 91610
  end_ms: 93780
- text: It's okay
  start_ms: 93780
  end_ms: 94650
- text: You can have him anyway
  start_ms: 94650
  end_ms: 97530
- text: Anyway
  start_ms: 97530
  end_ms: 98800
- text: You can have him anyway
  start_ms: 98800
  end_ms: 101650
- text: Anyway
  start_ms: 101650
  end_ms: 104110
- text: It's okay, I'm okay, had him in the first place
  start_ms: 104110
  end_ms: 106270
- text: It's okay, I'm okay
  start_ms: 106270
  end_ms: 108310
- text: It's okay, I'm okay, I don't really gotta say
  start_ms: 108310
  end_ms: 110470
- text: It's okay
  start_ms: 110470
  end_ms: 111380
- text: You can have him anyway
  start_ms: 111380
  end_ms: 114390
- text: Anway
  start_ms: 114390
  end_ms: 115680
- text: You can have him anyway
  start_ms: 115680
  end_ms: 118310
- text: Anyway
  start_ms: 118310
  end_ms: 121430
- text: I don't want him anyway, girl, take him
  start_ms: 121430
  end_ms: 125710
- text: I don't want him anyway, girl, take him
  start_ms: 125710
  end_ms: 129910
- text: I don't want him anyway, girl, take him
  start_ms: 129910
  end_ms: 133980
- text: I don't want him, I don't want him
  start_ms: 133980
  end_ms: 138110
- text: I don't want him anyway, girl, take him
  start_ms: 138110
  end_ms: 142450
- text: I don't want him anyway, girl, take him
  start_ms: 142450
  end_ms: 146460
- text: I don't it's okay, it's okay, take him
  start_ms: 146460
  end_ms: 150860
- text: I don't want him, I don't want him
  start_ms: 150860
  end_ms: 155360
`;

const blocks = lyricsStr.split('- text: ').filter(x => x.trim().length > 0);
const jsonArr = [];

for (const b of blocks) {
    const lines = b.trim().split('\n');
    let text = lines[0].trim();
    if(text.startsWith("'") && text.endsWith("'")) text = text.slice(1, -1);
    if(text.startsWith('"') && text.endsWith('"')) text = text.slice(1, -1);
    
    const startStr = lines.find(l => l.includes('start_ms:'));
    const endStr = lines.find(l => l.includes('end_ms:'));
    
    const startMs = parseInt(startStr.split(':')[1].trim(), 10);
    const endMs = parseInt(endStr.split(':')[1].trim(), 10);
    
    const startSec = startMs / 1000;
    const endSec = endMs / 1000;
    
    const words = text.split(' ');
    const wordDur = (endSec - startSec) / words.length;
    
    const wordObjs = words.map((w, i) => {
        return {
            text: w,
            start: parseFloat((startSec + (i * wordDur)).toFixed(2)),
            duration: parseFloat(wordDur.toFixed(2))
        };
    });
    
    jsonArr.push({
        start: parseFloat(startSec.toFixed(2)),
        end: parseFloat(endSec.toFixed(2)),
        words: wordObjs
    });
}

// Now replace in js/lyrics-data.js
let fileData = fs.readFileSync('js/lyrics-data.js', 'utf8');
let objStr = fileData.replace('export const lyricsData = ', '').trim();
if (objStr.endsWith(';')) objStr = objStr.slice(0, -1);

let lyricsData = eval('(' + objStr + ')');
lyricsData['tate-mcrae-its-okay-im-okay'] = jsonArr;

fs.writeFileSync('js/lyrics-data.js', 'export const lyricsData = ' + JSON.stringify(lyricsData, null, 4) + ';\n');
console.log("Replaced with EXACT official timings!");
