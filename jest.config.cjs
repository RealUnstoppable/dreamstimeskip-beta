module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^https://www\\.gstatic\\.com/firebasejs/.*/firebase-auth\\.js$': '<rootDir>/__mocks__/firebase-auth.js',
    '^https://www\\.gstatic\\.com/firebasejs/.*/firebase-firestore\\.js$': '<rootDir>/__mocks__/firebase-firestore.js',
    '\\./auth\\.js': '<rootDir>/__mocks__/auth.js'
  }
};
