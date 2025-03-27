/**
 * Merchant API Service
 * Handles all merchant-related API calls
 */

import { apiConfig, useMockApi } from '$lib/config/api';
import * as mockMerchantService from '$lib/services/mock/merchantService';
import { handleApiError } from '$lib/utils/errorHandling';

/**
 * @typedef {Object} MerchantData
 * @property {string} email - Merchant email
 * @property {string} businessName - Business name
 * @property {string} password - Password
 */

/**
 * @typedef {Object} MerchantSignUpResponse
 * @property {string} id - Merchant ID
 * @property {string} email - Merchant email
 * @property {string} status - Account status
 * @property {string} message - Response message
 */

/**
 * Sign up a new merchant
 * @param {MerchantData} merchantData - Merchant sign-up data
 * @returns {Promise<MerchantSignUpResponse>} Sign-up response
 */
export async function signUp(merchantData) {
  try {
    // Use mock service if configured to do so
    if (useMockApi()) {
      return await mockMerchantService.signUp(merchantData);
    }

    // Real API implementation
    const response = await fetch(`${apiConfig.apiBaseUrl}/merchants/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(merchantData)
    });

    if (!response.ok) {
      throw response;
    }

    /** @type {MerchantSignUpResponse} */
    const data = await response.json();
    return data;
  } catch (error) {
    throw await handleApiError(error);
  }
}

/**
 * @typedef {Object} VerificationResponse
 * @property {boolean} success - Whether verification was successful
 * @property {string} message - Response message
 */

/**
 * Verify merchant email with verification code
 * @param {string} email - Merchant email
 * @param {string} code - Verification code
 * @returns {Promise<VerificationResponse>} Verification response
 */
export async function verifyEmail(email, code) {
  try {
    // Use mock service if configured to do so
    if (useMockApi()) {
      return await mockMerchantService.verifyEmail(email, code);
    }

    // Real API implementation
    const response = await fetch(`${apiConfig.apiBaseUrl}/merchants/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, code })
    });

    if (!response.ok) {
      throw response;
    }

    /** @type {VerificationResponse} */
    const data = await response.json();
    return data;
  } catch (error) {
    throw await handleApiError(error);
  }
}

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
 */

/**
 * Get merchant details by ID
 * @param {string} merchantId - Merchant ID
 * @returns {Promise<Merchant>} Merchant details
 */
export async function getMerchantById(merchantId) {
  try {
    // Use mock service if configured to do so
    if (useMockApi()) {
      return await mockMerchantService.getMerchantById(merchantId);
    }

    // Real API implementation
    const response = await fetch(`${apiConfig.apiBaseUrl}/merchants/${merchantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw response;
    }

    /** @type {Merchant} */
    const data = await response.json();
    return data;
  } catch (error) {
    throw await handleApiError(error);
  }
}

/**
 * @typedef {Object} ResendVerificationResponse
 * @property {boolean} success - Whether resend was successful
 * @property {string} message - Response message
 */

/**
 * Resend verification code to merchant email
 * @param {string} email - Merchant email
 * @returns {Promise<ResendVerificationResponse>} Resend response
 */
export async function resendVerificationCode(email) {
  try {
    // Use mock service if configured to do so
    if (useMockApi()) {
      return await mockMerchantService.resendVerificationCode(email);
    }

    // Real API implementation
    const response = await fetch(`${apiConfig.apiBaseUrl}/merchants/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw response;
    }

    /** @type {ResendVerificationResponse} */
    const data = await response.json();
    return data;
  } catch (error) {
    throw await handleApiError(error);
  }
}

/**
 * @typedef {Object} SignInResponse
 * @property {boolean} success - Whether sign-in was successful
 * @property {string} merchantId - Merchant ID
 * @property {string} token - Auth token 
 * @property {string} message - Response message
 */

/**
 * Sign in merchant
 * @param {string} email - Merchant email
 * @param {string} password - Merchant password
 * @returns {Promise<SignInResponse>} Sign-in response
 */
export async function signIn(email, password) {
  try {
    // Use mock service if configured to do so
    if (useMockApi()) {
      return await mockMerchantService.signIn(email, password);
    }

    // Real API implementation
    const response = await fetch(`${apiConfig.apiBaseUrl}/merchants/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw response;
    }

    /** @type {SignInResponse} */
    const data = await response.json();
    return data;
  } catch (error) {
    throw await handleApiError(error);
  }
}
