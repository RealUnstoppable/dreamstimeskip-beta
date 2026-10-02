const fs = require('fs');

if (!fs.existsSync('__mocks__')) {
    fs.mkdirSync('__mocks__');
}

if (!fs.existsSync('__mocks__/firebase.js')) {
    fs.writeFileSync('__mocks__/firebase.js', 'export const auth = {}; export const db = {}; export const app = {};\n');
}

let jestConfig = fs.readFileSync('jest.config.js', 'utf8');

if (!jestConfig.includes('"^./firebase.js$": "<rootDir>/__mocks__/firebase.js"')) {
    jestConfig = jestConfig.replace(/"\^.\/auth\.js\$": "<rootDir>\/__mocks__\/auth\.js",/, '"^./auth.js$": "<rootDir>/__mocks__/auth.js",\n    "^./firebase.js$": "<rootDir>/__mocks__/firebase.js",');
    fs.writeFileSync('jest.config.js', jestConfig);
}
