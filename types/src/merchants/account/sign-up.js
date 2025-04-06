/**
 * Merchant Sign-up Types
 *
 * This module contains JSDoc type definitions related to the merchant sign-up process.
 *
 * @module @super-deals/types/merchants/account/sign-up
 */

/**
 * @typedef {Object} MerchantSignUpData
 * @property {string} businessName - The name of the merchant's business
 * @property {string} email - Merchant email address
 * @property {string} password - Merchant password
 * @property {string} registrationNumber - Business registration number
 * @property {number} yearOfRegistration - Year the business was registered
 * @property {string} businessType - Type of business (e.g., 'retail', 'wholesale')
 * @property {string} [website] - Optional business website
 * @property {string} phone - Business phone number
 * @property {MerchantAddress} address - Business address
 * @property {MerchantPrimaryContact} primaryContact - Primary contact information
 * @property {string[]} productCategories - Categories of products the merchant sells
 */

/**
 * @typedef {Object} MerchantAddress
 * @property {string} buildingNumber - Building number
 * @property {string} street - Street name
 * @property {string} city - City
 * @property {string} state - State or province
 * @property {string} zip - ZIP or postal code
 * @property {string} country - Country
 */

/**
 * @typedef {Object} MerchantPrimaryContact
 * @property {string} name - Contact person's name
 * @property {string} email - Contact person's email
 * @property {string} phone - Contact person's phone number
 */

/**
 * @typedef {Object} MerchantSignUpResponse
 * @property {string} id - Merchant ID
 * @property {string} email - Merchant email
 * @property {string} status - Account status
 * @property {string} message - Response message
 * @property {string} [verificationCode] - Verification code (only in development mode)
 */

/**
 * @typedef {Object} Step1FormData
 * @property {string} businessName - Business name
 * @property {string} email - Email address
 * @property {string} password - Password
 * @property {string} confirmPassword - Password confirmation
 * @property {string} currentStep - Current form step
 */

/**
 * @typedef {Object} Step2FormData
 * @property {string} registrationNumber - Business registration number
 * @property {string} yearOfRegistration - Year of registration
 * @property {string} businessType - Type of business
 * @property {string} [website] - Optional business website
 * @property {string} currentStep - Current form step
 */

/**
 * @typedef {Object} Step3FormData
 * @property {string} phone - Business phone
 * @property {string} buildingNumber - Building number
 * @property {string} street - Street name
 * @property {string} city - City
 * @property {string} state - State or province
 * @property {string} zip - ZIP or postal code
 * @property {string} country - Country
 * @property {string} primaryContactName - Primary contact name
 * @property {string} primaryContactEmail - Primary contact email
 * @property {string} primaryContactPhone - Primary contact phone
 * @property {string[]} productCategories - Product categories
 * @property {boolean} acceptTerms - Terms and conditions acceptance
 * @property {string} currentStep - Current form step
 */

// Export empty object since JSDoc types are used for documentation only
module.exports = {};
