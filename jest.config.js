module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  moduleNameMapper: {
    '^https://www.gstatic.com/firebasejs/9.15.0/firebase-(.*).js$': '<rootDir>/tests/__mocks__/firebase-$1.js'
  }
};
