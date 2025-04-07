/**
 * @super-deals/types
 *
 * This module exports all shared JSDoc type definitions for the Super Deals project.
 * It serves as a central location for type definitions that are used across multiple
 * projects, including the SvelteKit frontend and AWS CDK backend.
 *
 * @module @super-deals/types
 */

// Re-export all type modules

/**
 * Merchant Types
 * @typedef {import('./merchants/_index').Merchant} Merchant
 * @typedef {import('./merchants/_index').SignInResponse} SignInResponse
 * @typedef {import('./merchants/_index').MerchantSignUpData} MerchantSignUpData
 * @typedef {import('./merchants/_index').MerchantAddress} MerchantAddress
 * @typedef {import('./merchants/_index').MerchantPrimaryContact} MerchantPrimaryContact
 * @typedef {import('./merchants/_index').MerchantSignUpResponse} MerchantSignUpResponse
 * @typedef {import('./merchants/_index').Step1FormData} Step1FormData
 * @typedef {import('./merchants/_index').Step2FormData} Step2FormData
 * @typedef {import('./merchants/_index').Step3FormData} Step3FormData
 */

/**
 * Auth Types
 * @typedef {import('./auth/_index').VerificationResponse} VerificationResponse
 * @typedef {import('./auth/_index').ResendVerificationResponse} ResendVerificationResponse
 * @typedef {import('./auth/_index').VerificationFormData} VerificationFormData
 */

// Export empty object since JSDoc types are used for documentation only
module.exports = {};
