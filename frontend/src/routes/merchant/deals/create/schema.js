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
// const commonSchemaObject = {
//   merchantId: zfd.text(z.string().min(1, 'Merchant ID is required')),
//   title: zfd.text(z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less')),
//   originalPrice: zfd.text(z.string().refine(val => val.length > 0, { message: 'Original Price is required' }).transform(val => parseFloat(val)).refine(val => !isNaN(val) && val > 0, { message: 'Original Price must be more than 0' })),
//   discount: zfd.text(z.string().refine(val => val.length > 0, { message: 'Discount is required' }).transform(val => parseFloat(val)).refine(val => !isNaN(val) && val > 0 && val <= 100, { message: 'Discount must be between 0 and 100' })),
//   logo: zfd.file(z.any()).refine(val => val !== undefined && val !== null, { message: 'Logo is required' }).refine(file => {
//     if (file) {
//       const fileType = file.name.split('.').pop().toLowerCase();
//       return allowedFileTypes.includes(fileType);
//     }
//     return true;
//   }, 'Invalid file type'),
//   category: zfd.text(z.enum(categoryEnum, 'Category is required')),
//   expiration: zfd.text(z.string().min(1, 'Expiration is required').refine((val) => !isNaN(Date.parse(val)), 'Expiration must be a valid date')),
// };
const commonSchemaObject = {
  merchantId: zfd.text(z.string().min(1, 'Merchant ID is required')),
  title: zfd.text(z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less')),
  originalPrice: zfd.numeric(z.number().min(1, 'Original Price is required').positive('Original Price must be a positive number')),
  discount: zfd.numeric(z.number().min(0, 'Discount is required').max(100, 'Discount must be between 0 and 100')),
  // logo: zfd.file(
  //   z.object({
  //     filename: z.string().min(1, "Filename is required"),
  //     contentType: z.string().refine((type) => {
  //       const fileType = type.split('/').pop().toLowerCase();
  //       return allowedFileTypes.includes(fileType);
  //     }, "Invalid file type"),
  //     data: z.instanceof(File, "File data must be a file")
  //   })
  // ),
  logo: z.instanceof(File),
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
// const getDealSchema = () => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const sevenDaysFromToday = new Date(today);
//   sevenDaysFromToday.setDate(today.getDate() + 7);

//   return zfd.formData({
//     ...commonSchemaObject,
//     expiration: zfd.text(z.string().min(1, 'Expiration is required').refine(val => {
//       const parsedDate = Date.parse(val);
//       return !isNaN(parsedDate) && new Date(parsedDate) >= sevenDaysFromToday;
//     }, 'Expiration must be seven days from today or later')),
//   });
// };

/**
 * Static schema for API Gateway validation.
 * This schema doesn't include the dynamic check for expiration date.
 */
const staticSchema = zfd.formData(commonSchemaObject);

/**
 * JSON schema for the deal.
 */
const jsonSchema = zodToJsonSchema(staticSchema, {
  $refStrategy: 'none',
  target: 'openApi3',
});

export { getSchema, jsonSchema };