const addCorsHeader = require("./addCorsHeader.js");

module.exports = {
  // addCorsHeader,
  // success,
  // error,
}

// function prepareResponse() {
//   // console.log("Inside 'prepareResponse()'");

//   const corsHeader = Api.addCorsHeader();
//   // console.log("(+) corsHeadear: " + JSON.stringify(corsHeader));

//   const headers = {
//     ...corsHeader,
//   };
//   console.log("(+) headers: " + JSON.stringify(headers));

//   const body = JSON.stringify({
//     Message: "Resource created"
//   });
//   console.log("(+) body: " + JSON.stringify(body));

//   return {
//     statusCode: 201,
//     headers: headers,
//     body: body,
//   };
// }