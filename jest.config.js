export default {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  modulePathIgnorePatterns: ["<rootDir>/dts-hub-website/", "<rootDir>/functions/"],
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  moduleNameMapper: {
    "^https://.*/firebase-app\\.js$": "<rootDir>/tests/__mocks__/firebase-app.js",
    "^https://.*/firebase-app-check\\.js$": "<rootDir>/tests/__mocks__/firebase-app-check.js",
    "^https://.*/firebase-auth\\.js$": "<rootDir>/tests/__mocks__/firebase-auth.js",
    "^https://.*/firebase-firestore\\.js$": "<rootDir>/tests/__mocks__/firebase-firestore.js",
    "^https://.*$": "jest-transform-stub",
    "^./auth.js$": "<rootDir>/tests/__mocks__/auth.js"
  }
};
