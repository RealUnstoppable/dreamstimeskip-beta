export default {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js$': '<rootDir>/tests/mocks/firebase-auth.js',
    '^https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js$': '<rootDir>/tests/mocks/firebase-firestore.js',
    '^https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js$': '<rootDir>/tests/mocks/firebase-app.js',
  },
  transform: {}
};