const addCorsHeader = require("./add-cors-header.js");

/**
 * Returns a success response
 * @param {object} data - The response data
 * @param {number} statusCode - The HTTP status code
 * @returns {object} - The response object
 */
function success(data, statusCode = 200) {
  const headers = addCorsHeader();
  const response = {
    statusCode,
    headers,
    body: JSON.stringify(data),
  };

  return response;
}

module.exports = success;
