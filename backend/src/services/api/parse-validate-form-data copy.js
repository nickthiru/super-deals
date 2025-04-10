const multipart = require("parse-multipart-data");
const { Buffer } = require('node:buffer');
const { zfd } = require('zod-form-data');
const { z } = require('zod');

/**
 * Parse and validate form data from the event
 * @param {Object} event - The Lambda event object
 * @param {Object} schema - The Zod schema for validation
 * @returns {Object} The validated form data
 */
function parseAndValidateFormData(event, schema) {
  const contentType = event.headers["content-type"];
  let formData;

  if (contentType.startsWith("multipart/form-data")) {
    const decodedBody = Buffer.from(event.body, 'base64');
    const boundary = contentType.split("boundary=")[1];
    const parts = multipart.parse(decodedBody, boundary);

    formData = {};
    for (let part of parts) {
      if (part.filename) {
        formData[part.name] = {
          filename: part.filename,
          contentType: part.type,
          data: part.data
        };
      } else {
        formData[part.name] = part.data.toString();
      }
    }
  } else if (contentType === "application/json") {
    formData = JSON.parse(event.body);
  } else {
    throw new Error("Unsupported content type: " + contentType);
  }

  const result = schema.safeParse(formData);
  if (!result.success) {
    const detailedErrors = result.error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));

    throw new Error(`Validation failed: ${JSON.stringify(detailedErrors, null, 2)}`);
  }

  return result.data;
}

module.exports = { parseAndValidateFormData };