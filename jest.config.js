module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js$': '<rootDir>/js/__mocks__/firebase-app.js',
    '^https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js$': '<rootDir>/js/__mocks__/firebase-auth.js',
    '^https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js$': '<rootDir>/js/__mocks__/firebase-firestore.js',
    '^./auth.js$': '<rootDir>/js/__mocks__/auth.js'
  }
};
