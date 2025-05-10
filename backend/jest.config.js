const baseTestDir = "<rootDir>/tests";

const config = {
  testEnvironment: "node",
  // testMatch: [`${baseTestDir}/api/**/*.test.js`],
  // testMatch: [`${baseTestDir}/testing/**/*.test.js`],
  testMatch: [`${baseTestDir}/**/*.test.js`],
};

module.exports = config;
