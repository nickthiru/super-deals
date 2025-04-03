/**
 * Test fixtures for merchant sign-up tests
 */

exports.validMerchantData = {
  businessName: "Test Business LLC",
  email: "nickthiru@gmail.com",
  password: "Test123!@#",
  registrationNumber: "REG123456",
  yearOfRegistration: 2020,
  website: "https://testbusiness.com",
  phone: "+1234567890",
  address: {
    buildingNumber: "123",
    street: "Test Street",
    city: "Test City",
    state: "Test State",
    zip: "12345",
    country: "Test Country",
  },
  primaryContact: {
    name: "Nick Thiru",
    email: "",
    phone: "",
  },
  productCategories: ["Electronics", "Books"],
};

exports.invalidMerchantData = {
  businessName: "Test Business LLC",
  email: "nickthiru@gmail.com",
  password: "Test123!@#",
  registrationNumber: "REG123456",
  yearOfRegistration: 2020,
  website: "https://testbusiness.com",
  phone: "+1234567890",
  address: {
    buildingNumber: "123",
    street: "Test Street",
    city: "Test City",
    state: "Test State",
    zip: "12345",
    country: "", // Invalid: country is required
  },
  primaryContact: {
    name: "Nick Thiru",
    email: "",
    phone: "",
  },
  productCategories: ["Electronics", "Books"],
};
