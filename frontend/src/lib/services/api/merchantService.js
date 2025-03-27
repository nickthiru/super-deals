/**
 * Merchant API Service for Frontend
 * Handles all merchant-related API calls
 */

import { apiConfig } from '$lib/config/api';

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
    const response = await fetch(`${apiConfig.apiBaseUrl}/merchants/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(merchantData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to sign up: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Merchant sign-up error:', error);
    throw error;
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
    const response = await fetch(`${apiConfig.apiBaseUrl}/merchants/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, code })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to verify email: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
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
    const response = await fetch(`${apiConfig.apiBaseUrl}/merchants/${merchantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to get merchant: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get merchant error:', error);
    throw error;
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
    const response = await fetch(`${apiConfig.apiBaseUrl}/merchants/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to resend verification: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Resend verification error:', error);
    throw error;
  }
}

/**
 * @typedef {Object} SignInResponse
 * @property {boolean} success - Whether sign-in was successful
 * @property {string} merchantId - Merchant ID
 * @property {string} token - Auth token (in a real implementation)
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
    const response = await fetch(`${apiConfig.apiBaseUrl}/merchants/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to sign in: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Sign-in error:', error);
    throw error;
  }
}
