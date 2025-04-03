const fs = require("fs");
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
};