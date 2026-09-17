const fs = require('fs');
let config = fs.readFileSync('jest.config.js', 'utf8');

// Use exact paths mapped correctly for the tests
config = config.replace(/"\^https:\\\/\\\/.*\\\/firebase-auth\\\\.js\$": "<rootDir>\/__mocks__\/firebase-auth.js",/g,
  '"^https://.*/firebase-auth\\\\.js$": "<rootDir>/tests/__mocks__/firebase-auth.js",');

config = config.replace(/"\^https:\\\/\\\/.*\\\/firebase-firestore\\\\.js\$": "<rootDir>\/__mocks__\/firebase-firestore.js",/g,
  '"^https://.*/firebase-firestore\\\\.js$": "<rootDir>/tests/__mocks__/firebase-firestore.js",');

config = config.replace(/"\^https:\\\/\\\/.*\\\/firebase-app\\\\.js\$": "<rootDir>\/__mocks__\/firebase-app.js",/g,
  '"^https://.*/firebase-app\\\\.js$": "<rootDir>/tests/__mocks__/firebase-app.js",');

config = config.replace(/"\^.\/auth.js\$": "<rootDir>\/__mocks__\/auth.js"/g,
  '"^./auth.js$": "<rootDir>/tests/__mocks__/auth.js"');

fs.writeFileSync('jest.config.js', config);

// Let's create auth.js mock
if(!fs.existsSync('tests/__mocks__/auth.js')) {
    fs.writeFileSync('tests/__mocks__/auth.js', `export const auth = { currentUser: { uid: "test-uid" } };
export const db = {};`);
}
