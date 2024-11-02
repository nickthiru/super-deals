const { zfd } = require('zod-form-data');
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');

/** @type {readonly string[]} */
const allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif'];

/** @type {readonly string[]} */
const categoryEnum = [
  'foodDrink',
  'bathroom',
  'jewelery',
  'sports',
  'tech',
  'auto',
  'entertainment',
  'travel',
];

// Common schema object
const commonSchemaObject = {
  merchantId: zfd.text(z.string().min(1, 'Merchant ID is required')),
  title: zfd.text(z.string().max(255, 'Title must be 255 characters or less')),
  originalPrice: zfd.text(z.coerce.number().min(0, 'Original Price must be a positive number')),
  discount: zfd.text(z.coerce.number().min(0, 'Discount must be at least 0').max(100, 'Discount cannot exceed 100')),
  logo: zfd.file(z.instanceof(File).refine(file => {
    const fileType = file.name.split('.').pop().toLowerCase();
    return allowedFileTypes.includes(fileType);
  }, 'Invalid file type')),
  category: zfd.text(z.enum(categoryEnum, 'Category is required')),
};

/**
 * Returns the deal schema with dynamic validation for expiration date.
 * @returns {import('zod').ZodType<getDealSchema>}
 */
function getDealSchema() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return zfd.formData({
    ...commonSchemaObject,
    expiration: zfd.text(z.string().refine((val) => !isNaN(Date.parse(val)) && new Date(val) >= today, 'Expiration must be today\'s date or later')),
  });
}

/**
 * Static schema for API Gateway validation.
 * This schema doesn't include the dynamic check for expiration date.
 */
const staticDealSchema = zfd.formData({
  ...commonSchemaObject,
  expiration: zfd.text(z.string().refine((val) => !isNaN(Date.parse(val)), 'Expiration must be a valid date')),
});
// Convert the Zod schema to JSON schema
const jsonSchema = zodToJsonSchema(staticDealSchema, {
  $refStrategy: 'none',
  target: 'openApi3',
});

/**
 * Export the getDealSchema function for use in +page.server.js validations.
 * This function returns a schema that includes dynamic validation logic,
 * such as checking that the expiration date is not in the past.
 */
// module.exports = getDealSchema;

/**
 * Export the jsonSchema object for use in API Gateway Model validations.
 * This schema is a static representation of the deal schema, and is used
 * to validate incoming requests to the API Gateway.
 */
// module.exports.jsonSchema = jsonSchema;

module.exports = {
  /**
 * Export the getDealSchema function for use in +page.server.js validations.
 * This function returns a schema that includes dynamic validation logic,
 * such as checking that the expiration date is not in the past.
 */
  getDealSchema,
  /**
 * Export the jsonSchema object for use in API Gateway Model validations.
 * This schema is a static representation of the deal schema, and is used
 * to validate incoming requests to the API Gateway.
 */
  jsonSchema,
};