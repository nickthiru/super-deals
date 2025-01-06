import { zfd } from 'zod-form-data';
import { z } from 'zod';

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
  userId: zfd.text(z.string().min(1, 'User ID is required')),
  dealId: zfd.text(z.string().min(1, 'Deal ID is required')),
  title: zfd.text(z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less')),
  originalPrice: zfd.numeric(z.number().min(1, 'Original Price is required').positive('Original Price must be a positive number')),
  discount: zfd.numeric(z.number().min(0, 'Discount is required').max(100, 'Discount must be between 0 and 100')),
  logoFileKey: zfd.text(z.string().min(1, 'Logo File Key is required')),
  category: zfd.text(z.enum(categoryEnum, 'Category is required')),
  expiration: zfd.text(z.string().min(1, 'Expiration is required').refine((val) => !isNaN(Date.parse(val)), 'Expiration must be a valid date')),
};

/**
 * Returns the deal schema with dynamic validation for expiration date.
 * @returns {import('zod').ZodType<DealFormSchema>}
 */
const getSchema = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysFromToday = new Date(today);
  sevenDaysFromToday.setDate(today.getDate() + 7);

  return zfd.formData({
    ...commonSchemaObject,
    expiration: zfd.text(z.string().refine(val => val.length > 0, { message: 'Expiration is required' }).refine(val => {
      const parsedDate = Date.parse(val);
      return !isNaN(parsedDate) && new Date(parsedDate) >= sevenDaysFromToday;
    }, 'Expiration must be seven days from today or later')),
  });
};

export default getSchema;