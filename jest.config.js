export default {
  testEnvironment: 'node',
  transform: {},
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js$': '<rootDir>/__mocks__/firebase-auth.js',
    '^https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js$': '<rootDir>/__mocks__/firebase-firestore.js',
    '^https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js$': '<rootDir>/__mocks__/firebase-app.js'
  }
};
