const schema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  title: "MerchantsAccountSignUpModel",
  type: "object",
  required: [
    "email",
    "password",
    "businessName",
    "registrationNumber",
    "yearOfRegistration",
    "address",
    "phone",
    "primaryContact",
    "productCategories",
  ],
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
      minLength: 8,
    },
    businessName: {
      type: "string",
      minLength: 1,
    },
    registrationNumber: {
      type: "string",
      minLength: 1,
    },
    yearOfRegistration: {
      type: "integer",
      minimum: 1900,
      maximum: new Date().getFullYear(),
    },
    website: {
      type: "string",
      format: "uri",
    },
    address: {
      type: "object",
      required: ["buildingNumber", "street", "city", "state", "zip", "country"],
      properties: {
        buildingNumber: {
          type: "string",
          minLength: 1,
        },
        street: {
          type: "string",
          minLength: 1,
        },
        city: {
          type: "string",
          minLength: 1,
        },
        state: {
          type: "string",
          minLength: 1,
        },
        zip: {
          type: "string",
          minLength: 1,
        },
        country: {
          type: "string",
          minLength: 1,
        },
      },
    },
    phone: {
      type: "string",
      minLength: 1,
    },
    primaryContact: {
      type: "object",
      required: ["name", "email", "phone"],
      properties: {
        name: {
          type: "string",
          minLength: 1,
        },
        email: {
          type: "string",
          format: "email",
        },
        phone: {
          type: "string",
          minLength: 1,
        },
      },
    },
    productCategories: {
      type: "array",
      minItems: 1,
      items: {
        type: "string",
        enum: [
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
        ],
      },
    },
  },
};

module.exports = schema;
