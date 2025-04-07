/**
 * Merchant Entity Types
 * 
 * This module contains JSDoc type definitions related to merchant entities.
 * 
 * @module @super-deals/types/merchants/entity
 */

/**
 * @typedef {Object} Merchant
 * @property {string} id - Merchant ID
 * @property {string} businessName - Business name
 * @property {string} registrationNumber - Business registration number
 * @property {number} yearOfRegistration - Year of business registration
 * @property {string} businessType - Type of business
 * @property {string} email - Contact email
 * @property {string} phone - Contact phone
 * @property {string} address - Business address
 * @property {string} city - Business city
 * @property {string} state - Business state/province
 * @property {string} country - Business country
 * @property {string} postalCode - Business postal code
 * @property {string} status - Account status
 * @property {string} [website] - Business website (optional)
 */

/**
 * @typedef {Object} SignInResponse
 * @property {boolean} success - Whether sign-in was successful
 * @property {string} merchantId - Merchant ID
 * @property {string} token - Auth token
 * @property {string} message - Response message
 */

// Export empty object since JSDoc types are used for documentation only
module.exports = {};
