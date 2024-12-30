const addCorsHeader = require("./add-cors-header.js");

function success(data, statusCode = 200) {
  const headers = addCorsHeader();
  const response = {
    statusCode,
    headers,
    body: JSON.stringify(data)
  };

  return response;
}

module.exports = success;