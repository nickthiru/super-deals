/**
 * Auth Verification Types
 * 
 * This module contains JSDoc type definitions related to the authentication verification process.
 * 
 * @module @super-deals/types/auth/verification
 */

/**
 * @typedef {Object} VerificationResponse
 * @property {boolean} success - Whether verification was successful
 * @property {boolean} isSignUpComplete - Whether sign-up process is complete
 * @property {string} message - Response message
 */

/**
 * @typedef {Object} ResendVerificationResponse
 * @property {boolean} success - Whether resend was successful
 * @property {string} message - Response message
 */

/**
 * @typedef {Object} VerificationFormData
 * @property {string} email - User email address
 * @property {string} code - Verification code
 * @property {string} userType - Type of user (e.g., 'merchant', 'consumer')
 */

// Export empty object since JSDoc types are used for documentation only
module.exports = {};
