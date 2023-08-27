// eslint-disable-next-line no-undef
module.exports = {
  transform: {
    '\\.js$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|jpg|png)$': '<rootDir>/src/js/empty-module.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
};
