// const addCorsHeader = require("./add-cors-header.js");
const Api = require("#src/api/_index.js");

function error(statusCode, message, details = null) {
  const headers = Api.addCorsHeader();
  const body = {
    error: message
  };
  if (details) {
    body.details = details;
  }
  const response = {
    statusCode,
    headers,
    body: JSON.stringify(body)
  };
  console.log(`Error Response: ${JSON.stringify(response, null, 2)}`);
  return response;
}

module.exports = error;