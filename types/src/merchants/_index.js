/**
 * Merchant Types
 *
 * This module contains JSDoc type definitions related to merchants in the Super Deals platform.
 *
 * @module @super-deals/types/merchants
 */

// Re-export all merchant-related types

/**
 * @typedef {import('./entity').Merchant} Merchant
 * @typedef {import('./entity').SignInResponse} SignInResponse
 */

/**
 * @typedef {import('./account/sign-up').MerchantSignUpData} MerchantSignUpData
 * @typedef {import('./account/sign-up').MerchantAddress} MerchantAddress
 * @typedef {import('./account/sign-up').MerchantPrimaryContact} MerchantPrimaryContact
 * @typedef {import('./account/sign-up').MerchantSignUpResponse} MerchantSignUpResponse
 * @typedef {import('./account/sign-up').Step1FormData} Step1FormData
 * @typedef {import('./account/sign-up').Step2FormData} Step2FormData
 * @typedef {import('./account/sign-up').Step3FormData} Step3FormData
 */

// Export empty object since JSDoc types are used for documentation only
module.exports = {};
