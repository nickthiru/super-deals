const multipart = require("parse-multipart-data");
const { Buffer } = require('node:buffer');
const { zfd } = require('zod-form-data');
const { z } = require('zod');

/**
 * Parse and validate (if a schema is provided) the Request data
 * @param {Object} event - The Lambda event object
 * @param {Object} schema - The Zod schema for validation
 * @returns {Object} The validated form data
 */
function parseEventWithOptionalValidation(event, schema = null) {
  const contentType = event.headers["content-type"];

  if (contentType.startsWith("multipart/form-data")) {
    const decodedBody = Buffer.from(event.body, 'base64');
    const boundary = contentType.split("boundary=")[1];
    const parts = multipart.parse(decodedBody, boundary);

    var data = {};
    for (let part of parts) {
      if (part.filename) {
        data[part.name] = {
          filename: part.filename,
          contentType: part.type,
          data: part.data
        };
      } else {
        data[part.name] = part.data.toString();
      }
    }
  } else if (contentType === "application/json") {
    data = JSON.parse(event.body);
  } else {
    throw new Error("Unsupported content type: " + contentType);
  }

  if (schema) {
    const result = schema.safeParse(data);
    if (!result.success) {
      const detailedErrors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }));

      throw new Error(`Validation failed: ${JSON.stringify(detailedErrors, null, 2)}`);
    }

    return result.data;
  }

  return data;
}

module.exports = { parseEventWithOptionalValidation };