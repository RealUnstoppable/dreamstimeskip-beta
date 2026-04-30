export default {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js$': '<rootDir>/tests/__mocks__/firebase-firestore.js',
    '\\./auth\\.js$': '<rootDir>/tests/__mocks__/auth.js'
  },
  transform: {},
};
