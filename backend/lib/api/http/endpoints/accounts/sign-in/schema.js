const { z } = require('zod');
const { zfd } = require('zod-form-data');
const { zodToJsonSchema } = require('zod-to-json-schema');

const schema = zodToJsonSchema(
  z.object({
    email: zfd.text(z.string().email('Invalid email address')),
    password: zfd.text(z.string().min(8, 'Password must be at least 8 characters long'))
  }),
  {
    $refStrategy: 'none',
    target: 'openApi3',
  });

module.exports = schema;