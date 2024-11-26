// const addCorsHeader = require("./add-cors-header.js");
const Api = require("#src/api/_index.js");

function success(data, statusCode = 200) {
  const headers = Api.addCorsHeader();
  const response = {
    statusCode,
    headers,
    body: JSON.stringify(data)
  };
  console.log(`Success Response: ${JSON.stringify(response, null, 2)}`);
  return response;
}

module.exports = success;