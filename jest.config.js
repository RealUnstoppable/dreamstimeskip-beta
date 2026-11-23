export default {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  modulePathIgnorePatterns: ["<rootDir>/dts-hub-website/", "<rootDir>/functions/"],
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  moduleNameMapper: {
    "^node:test$": "<rootDir>/tests/__mocks__/node-test.js",
    "^test$": "<rootDir>/tests/__mocks__/node-test.js",
    "^.*/firebase-admin(\\.js)?$": "<rootDir>/tests/__mocks__/firebase-admin.js",
    "^https://.*/firebase-app\\.js$": "<rootDir>/tests/__mocks__/firebase-app.js",
    "^https://.*/firebase-auth\\.js$": "<rootDir>/tests/__mocks__/firebase-auth.js",
    "^https://.*/firebase-firestore\\.js$": "<rootDir>/tests/__mocks__/firebase-firestore.js",
    "^https://.*/firebase-vertexai\\.js$": "<rootDir>/tests/__mocks__/firebase-vertexai.js",
    "^https://.*/firebase-app-check\\.js$": "<rootDir>/tests/__mocks__/firebase-app-check.js",
    "^https://.*$": "jest-transform-stub",
    "^./auth.js$": "<rootDir>/tests/__mocks__/auth.js"
  }
};
