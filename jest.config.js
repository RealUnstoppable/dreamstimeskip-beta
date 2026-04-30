module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^https://www.gstatic.com/firebasejs/9.15.0/firebase-(.*).js$': '<rootDir>/__mocks__/firebase-$1.js',
    '^\\./auth\\.js$': '<rootDir>/__mocks__/auth.js'
  }
};
