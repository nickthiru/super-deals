const { z } = require('zod');
const { zfd } = require('zod-form-data');
const { zodToJsonSchema } = require('zod-to-json-schema');

const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long');

const schema = zodToJsonSchema(
  zfd.formData({
    businessName: zfd.text(z.string().min(1, 'Business Name is required').max(255, 'Business Name must be 255 characters or less')),
    email: zfd.text(z.string().email('Invalid email address')),
    password: zfd.text(passwordSchema),
    confirmPassword: zfd.text(passwordSchema),
    userGroup: zfd.text(z.literal('merchant'))
  }).refine(data => {
    console.log('Refine data:', data);
    return data.password === data.confirmPassword;
  }, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  }),
  {
    $refStrategy: 'none',
    target: 'openApi3',
  });

module.exports = schema;
