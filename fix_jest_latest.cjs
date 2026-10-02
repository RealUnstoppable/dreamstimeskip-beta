const fs = require('fs');

let config = `export default {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  modulePathIgnorePatterns: ["<rootDir>/dts-hub-website/", "<rootDir>/functions/"],
  transform: {
    "^.+\\\\.jsx?$": "babel-jest"
  },
  moduleNameMapper: {
    "^https://.*/firebase-app\\\\.js$": "<rootDir>/tests/__mocks__/firebase-app.js",
    "^https://.*/firebase-auth\\\\.js$": "<rootDir>/tests/__mocks__/firebase-auth.js",
    "^https://.*/firebase-firestore\\\\.js$": "<rootDir>/tests/__mocks__/firebase-firestore.js",
    "^https://.*$": "jest-transform-stub",
    "^./auth.js$": "<rootDir>/tests/__mocks__/auth.js",
    "^../auth.js$": "<rootDir>/tests/__mocks__/auth.js"
  }
};`;

fs.writeFileSync('jest.config.js', config);

// Let's create auth.js mock
if(!fs.existsSync('tests/__mocks__/auth.js')) {
    fs.writeFileSync('tests/__mocks__/auth.js', `export const auth = { currentUser: { uid: "test-uid" } };
export const db = {};`);
}
