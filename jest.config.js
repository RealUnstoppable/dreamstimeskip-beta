module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^https://www.gstatic.com/firebasejs/.*$': '<rootDir>/tests/__mocks__/firebase.js',
    '^./auth.js$': '<rootDir>/tests/__mocks__/auth.js'
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
