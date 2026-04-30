module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    '^https://www.gstatic.com/firebasejs/(.*)': '<rootDir>/__mocks__/firebase-mock.js'
  }
};
