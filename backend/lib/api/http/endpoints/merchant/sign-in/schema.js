// backend/lib/api/http/endpoints/merchant/sign-up/schema.js
const { z } = require('zod');
const { zfd } = require('zod-form-data');
const { zodToJsonSchema } = require('zod-to-json-schema');

const schema = zfd.formData({
  email: zfd.text(z.string().email('Invalid email address')),
  password: zfd.text(z.string().min(8, 'Password must be at least 8 characters long'))
});

/**
 * JSON schema for API Gateway.
 */
const jsonSchema = zodToJsonSchema(schema, {
  $refStrategy: 'none',
  target: 'openApi3',
});

module.exports = { schema, jsonSchema };