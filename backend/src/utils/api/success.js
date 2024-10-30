const addCorsHeader = require("./addCorsHeader.js");

function success(data, statusCode = 200) {
  const headers = addCorsHeader();
  return {
    statusCode,
    headers,
    body: JSON.stringify(data)
  };
}

module.exports = success;