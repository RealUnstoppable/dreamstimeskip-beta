export default {
  transform: {},
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^https://www.gstatic.com/firebasejs/9.15.0/(.*)$": "<rootDir>/__mocks__/$1"
  }
};
