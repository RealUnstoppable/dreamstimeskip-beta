export default {
  testEnvironment: 'jsdom',
  transform: {},
  moduleNameMapper: {
    '^https://www.gstatic.com/firebasejs/9.15.0/(.*)$': '<rootDir>/tests/mocks/$1'
  }
};
