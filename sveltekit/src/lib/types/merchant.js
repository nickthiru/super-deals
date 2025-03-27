/**
 * Merchant type definitions
 */

/**
 * @typedef {Object} MerchantAddress
 * @property {string} buildingNumber - Building number
 * @property {string} street - Street
 * @property {string} city - City
 * @property {string} state - State
 * @property {string} zip - Zip code
 * @property {string} country - Country
 */

/**
 * @typedef {Object} MerchantPrimaryContact
 * @property {string} name - Contact name
 * @property {string} email - Contact email
 * @property {string} phone - Contact phone number
 */

/**
 * @typedef {Object} MerchantSignUpData
 * @property {string} businessName - Name of business
 * @property {string} registrationNumber - Business registration number
 * @property {number} yearOfRegistration - Year of business registration
 * @property {string} email - Email address
 * @property {string} [website] - Website URL (optional)
 * @property {MerchantAddress} address - Business address
 * @property {string} phone - Business phone number
 * @property {MerchantPrimaryContact} primaryContact - Primary contact information
 * @property {string[]} productCategories - Product categories
 * @property {string} password - Password for account (not stored in DB as plaintext)
 */

/**
 * @typedef {Object} Merchant
 * @property {string} id - Entity ID using KSUID
 * @property {string} businessName - Name of business
 * @property {string} registrationNumber - Business registration number
 * @property {number} yearOfRegistration - Year of business registration
 * @property {string} email - Email address
 * @property {string} [website] - Website URL (optional)
 * @property {MerchantAddress} address - Business address
 * @property {string} phone - Business phone number
 * @property {MerchantPrimaryContact} primaryContact - Primary contact information
 * @property {string[]} productCategories - Product categories
 * @property {string} status - Status (Pending Review, Approved, Rejected)
 * @property {boolean} emailVerified - Whether the email has been verified
 * @property {Date} createdAt - Date when merchant was created
 * @property {Date} updatedAt - Date when merchant was last updated
 */

/**
 * @typedef {Object} MerchantVerificationRequest
 * @property {string} email - Email to verify
 * @property {string} code - Verification code
 */

/**
 * @typedef {Object} MerchantSignUpResponse
 * @property {string} id - Merchant ID
 * @property {string} email - Merchant email
 * @property {string} status - Account status
 * @property {string} message - Response message
 */

/**
 * @typedef {Object} MerchantVerificationResponse
 * @property {boolean} success - Whether verification was successful
 * @property {string} message - Response message
 * @property {string} [nextStep] - Next step in the process
 */

/**
 * @typedef {Object} VerificationResponse
 * @property {boolean} success - Whether the verification was successful
 * @property {string} message - Success or error message
 * @property {string} [merchantId] - ID of the verified merchant (if successful)
 * @property {string} [token] - Authentication token (if successful)
 */

/**
 * @typedef {Object} ResendVerificationRequest
 * @property {string} email - Merchant email
 */

/**
 * @typedef {Object} ResendVerificationResponse
 * @property {boolean} success - Whether the verification code was resent successfully
 * @property {string} message - Success or error message
 */

/**
 * @typedef {'Pending Review' | 'Approved' | 'Rejected' | 'Additional Information Required'} MerchantStatus
 */

export {};
