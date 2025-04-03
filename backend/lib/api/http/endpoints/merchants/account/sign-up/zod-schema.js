const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

/**
 * Enum values for product categories.
 * @type {readonly string[]}
 */
const productCategoriesEnum = [
  "Electronics",
  "Clothing",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Books",
  "Toys & Games",
  "Sports & Outdoors",
  "Automotive",
  "Health & Wellness",
  "Food & Grocery",
  "Jewelry",
  "Office Supplies",
];

/**
 * Returns the merchant sign-up schema for request validation.
 * @returns {object} JSON Schema for merchant sign-up
 */
const schema = zodToJsonSchema(
  z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    businessName: z.string().min(1, "Business name is required"),
    registrationNumber: z.string().min(1, "Registration number is required"),
    yearOfRegistration: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear()),
    website: z.string().url().optional(),
    address: z.object({
      buildingNumber: z.string().min(1, "Building number is required"),
      street: z.string().min(1, "Street is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zip: z.string().min(1, "Zip code is required"),
      country: z.string().min(1, "Country is required"),
    }),
    phone: z.string().min(1, "Business phone is required"),
    primaryContact: z.object({
      name: z.string().min(1, "Contact name is required"),
      email: z.string().email("Valid contact email is required"),
      phone: z.string().min(1, "Contact phone is required"),
    }),
    productCategories: z
      .array(z.enum(productCategoriesEnum, "Invalid product category"))
      .min(1, "At least one product category is required"),
  }),
  {
    $refStrategy: "none",
    target: "openApi3",
  }
);

module.exports = schema;
