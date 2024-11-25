const addCorsHeader = require("./addCorsHeader.js");

function success(data, statusCode = 200) {
  const headers = addCorsHeader();
  const response = {
    statusCode,
    headers,
    body: JSON.stringify(data)
  };
  console.log(`Success Response: ${JSON.stringify(response, null, 2)}`);
  return response;
}

module.exports = success;