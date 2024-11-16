import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Allowed file types for the deal logo.
 * @type {readonly string[]}
 */
const allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif'];

/**
 * Enum values for the deal category.
 * @type {readonly string[]}
 */
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

/**
 * Common schema object.
 * @type {object}
 */
const commonSchemaObject = {
  merchantId: zfd.text(z.string().min(1, 'Merchant ID is required')),
  title: zfd.text(z.string().min(1, 'Required').max(255, 'Title must be 255 characters or less')),
  originalPrice: zfd.text(z.string().refine(val => val.length > 0, { message: 'Required' }).transform(val => parseFloat(val)).refine(val => !isNaN(val) && val > 0, { message: 'Original Price must be more than 0' })),
  discount: zfd.text(z.string().refine(val => val.length > 0, { message: 'Required' }).transform(val => parseFloat(val)).refine(val => !isNaN(val) && val > 0 && val <= 100, { message: 'Discount must be between 0 and 100' })),
  logo: zfd.file(z.any()).refine(val => val !== undefined && val !== null, { message: 'Required' }).refine(file => {
    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase();
      return allowedFileTypes.includes(fileType);
    }
    return true;
  }, 'Invalid file type'),
  category: zfd.text(z.enum(categoryEnum, 'Required')),
};

/**
 * Returns the deal schema with dynamic validation for expiration date.
 * @returns {import('zod').ZodType<DealFormSchema>}
 */
const getDealSchema = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysFromToday = new Date(today);
  sevenDaysFromToday.setDate(today.getDate() + 7);

  return zfd.formData({
    ...commonSchemaObject,
    expiration: zfd.text(z.string().refine(val => val.length > 0, { message: 'Required' }).refine(val => {
      const parsedDate = Date.parse(val);
      return !isNaN(parsedDate) && new Date(parsedDate) >= sevenDaysFromToday;
    }, 'Expiration must be seven days from today or later')),
  });
};

/**
 * Static schema for API Gateway validation.
 * This schema doesn't include the dynamic check for expiration date.
 */
const staticDealSchema = zfd.formData({
  ...commonSchemaObject,
  expiration: zfd.text(z.string().refine(val => val.length > 0, { message: 'Required' }).refine((val) => !isNaN(Date.parse(val)), 'Expiration must be a valid date')),
});

/**
 * JSON schema for the deal.
 */
const jsonSchema = zodToJsonSchema(staticDealSchema, {
  $refStrategy: 'none',
  target: 'openApi3',
});

export { getDealSchema, jsonSchema };