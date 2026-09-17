const fs = require('fs');

if (!fs.existsSync('__mocks__')) {
    fs.mkdirSync('__mocks__');
}

fs.writeFileSync('__mocks__/firebase-app.js', 'export const getApps = () => []; export const initializeApp = () => {};\n');

let jestConfig = fs.readFileSync('jest.config.js', 'utf8');

if (!jestConfig.includes('"^https://.*/firebase-app\\\\.js$": "<rootDir>/__mocks__/firebase-app.js"')) {
    jestConfig = jestConfig.replace(/"\^https:\\\/\\\/.*\\\/firebase-firestore\\.js\$": "<rootDir>\/__mocks__\/firebase-firestore\.js",/, '"^https:\\\/\\\/.*\\\/firebase-firestore\\.js\$": "<rootDir>\/__mocks__\/firebase-firestore.js",\n    "^https://.*/firebase-app\\\\.js$": "<rootDir>/__mocks__/firebase-app.js",');
    fs.writeFileSync('jest.config.js', jestConfig);
}

fs.writeFileSync('__mocks__/firebase-firestore.js', 'export const doc = () => {}; export const getDoc = () => {}; export const setDoc = () => {}; export const addDoc = () => {}; export const arrayRemove = () => {}; export const arrayUnion = () => {}; export const collection = () => {}; export const getDocs = () => {}; export const query = () => {}; export const where = () => {}; export const orderBy = () => {}; export const serverTimestamp = () => {};\n');
