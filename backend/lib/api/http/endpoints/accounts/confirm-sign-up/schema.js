const { z } = require('zod');
const { zfd } = require('zod-form-data');
const { zodToJsonSchema } = require('zod-to-json-schema');

const schema = zodToJsonSchema(
  z.object({
    username: z.string().min(1, 'Username is required'),
    confirmationCode: z.string().min(6, '6-Digit Confirmation Code Required'),
  }),
  {
    $refStrategy: 'none',
    target: 'openApi3',
  }
);

module.exports = schema;