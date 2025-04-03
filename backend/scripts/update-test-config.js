/**
 * Script to update test configuration from backend outputs.json
 * Similar to the SvelteKit update-env.js script but for test config
 */

const fs = require("fs");
const path = require("path");

// Paths configuration
const OUTPUTS_PATH = path.resolve(__dirname, "../outputs.json");
const CONFIG_PATH = path.resolve(__dirname, "../tests/api/config.js");

/**
 * Updates the test config with latest values from outputs.json
 */
function updateTestConfig() {
  try {
    // Read outputs.json
    const outputs = JSON.parse(fs.readFileSync(OUTPUTS_PATH, "utf8"));

    // Extract API URL from outputs
    const apiUrl =
      outputs.BackendStackDevApiStackHttpStackB0C9C4D3?.RestApiUrldev;

    if (!apiUrl) {
      throw new Error("API URL not found in outputs.json");
    }

    // Generate new config content
    const configContent = `const fs = require("fs");
const path = require("path");

/**
 * Get API URL from outputs.json
 * @returns {string} The API URL
 */
function getApiUrl() {
  try {
    const outputsPath = path.resolve(__dirname, "../../outputs.json");
    const outputs = JSON.parse(fs.readFileSync(outputsPath, "utf8"));

    // Extract API URL from outputs
    const apiUrl =
      outputs.BackendStackDevApiStackHttpStackB0C9C4D3?.RestApiUrldev;

    if (!apiUrl) {
      throw new Error("API URL not found in outputs.json");
    }

    return apiUrl;
  } catch (error) {
    console.error("Error reading API URL from outputs.json:", error);
    throw error;
  }
}

module.exports = {
  apiUrl: process.env.TEST_API_URL || getApiUrl(),
};`;

    // Write new config
    fs.writeFileSync(CONFIG_PATH, configContent, "utf8");
    console.log("Successfully updated test config with latest API URL");
  } catch (error) {
    console.error("Error updating test config:", error);
    process.exit(1);
  }
}

updateTestConfig();
