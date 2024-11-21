// backend/src/utils/api/error.js

const addCorsHeader = require("./addCorsHeader.js");

function error(statusCode, message, details = null) {
  const headers = addCorsHeader();
  const body = {
    error: message
  };
  if (details) {
    body.details = details;
  }
  return {
    statusCode,
    headers,
    body: JSON.stringify(body)
  };
}

module.exports = error;