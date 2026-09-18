const fs = require('fs');

if (fs.existsSync('tests/harmonytunes.test.js')) {
    let content = fs.readFileSync('tests/harmonytunes.test.js', 'utf8');
    content = content.replace("import { jest } from '@jest/globals';", "// import { jest } from '@jest/globals';");
    fs.writeFileSync('tests/harmonytunes.test.js', content);
}
