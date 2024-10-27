import { zfd } from 'zod-form-data';
import { z } from 'zod';

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

/**
 * @typedef {Object} DealSchema
 * @property {string} merchantId
 * @property {string} title
 * @property {number} originalPrice
 * @property {number} discount
 * @property {File} logo
 * @property {typeof categoryEnum[number]} category
 * @property {string} expiration
 */

/** @type {import('zod').ZodType<DealSchema>} */
const dealSchema = zfd.formData({
  merchantId: zfd.text(z.string().nonempty('Merchant ID is required')),
  title: zfd.text(z.string().max(255, 'Title must be 255 characters or less')),
  originalPrice: zfd.text(z.coerce.number().min(0, 'Original Price must be a positive number')),
  discount: zfd.text(z.coerce.number().min(0, 'Discount must be at least 0').max(100, 'Discount cannot exceed 100')),
  logo: zfd.file(z.instanceof(File).refine(file => {
    const fileType = file.name.split('.').pop().toLowerCase();
    return allowedFileTypes.includes(fileType);
  }, 'Invalid file type')),
  category: zfd.text(z.enum(categoryEnum, 'Category is required')),
  expiration: zfd.text(z.string().refine((val) => !isNaN(Date.parse(val)), 'Expiration must be a valid date')),
});

export default dealSchema;