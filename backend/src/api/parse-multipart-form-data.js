// backend/src/api/parse-multipart-form-data.js
const multipart = require("parse-multipart-data");
const { Buffer } = require('node:buffer');

/**
 * Parse multipart form data from the event
 * @param {Object} event - The Lambda event object
 * @returns {Object} The parsed deal data
 */
function parseMultipartFormData(event) {
  const decodedBody = Buffer.from(event.body, 'base64');
  const boundary = event.headers["content-type"].split("boundary=")[1];
  const parts = multipart.parse(decodedBody, boundary);

  const deal = {};
  for (let part of parts) {
    if (part.filename) {
      deal.logo = {
        filename: part.filename,
        contentType: part.type,
        data: part.data
      };
    } else {
      deal[part.name] = part.data.toString();
    }
  }
  return deal;
}

module.exports = parseMultipartFormData;