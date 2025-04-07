/**
 * Mock implementation of merchant API service
 * Used for development and testing when backend is not available
 */

import { apiConfig } from '$lib/config/api';
import { generateMerchantId, generateVerificationCode } from '../../utils/idGenerator';
import { ERROR_CODES } from '$lib/utils/errorHandling';
import { browser } from '$app/environment';

/**
 * @typedef {import('@super-deals/types').MerchantSignUpData} MerchantSignUpData
 * @typedef {import('@super-deals/types').MerchantSignUpResponse} MerchantSignUpResponse
 * @typedef {import('@super-deals/types').VerificationResponse} VerificationResponse
 * @typedef {import('@super-deals/types').ResendVerificationResponse} ResendVerificationResponse
 * @typedef {import('@super-deals/types').Merchant} Merchant
 * @typedef {import('@super-deals/types').SignInResponse} SignInResponse
 */

// Storage key for mock data
const MOCK_MERCHANTS_STORAGE_KEY = 'mock_merchants_data';
const MOCK_VERIFICATIONS_STORAGE_KEY = 'mock_verifications_data';

// In-memory storage for mock data (fallback for server-side)
/** @type {Map<string, {code: string, merchantId: string}>} */
const pendingVerifications = new Map();

/**
 * @typedef {Object} MockMerchant
 * Extends the Merchant type with additional fields needed for mock implementation
 * @property {string} id - Merchant ID
 * @property {string} email - Merchant email
 * @property {string} businessName - Business name
 * @property {string} password - Password (only for mock implementation)
 * @property {string} registrationNumber - Business registration number
 * @property {number} yearOfRegistration - Year of business registration
 * @property {string} businessType - Type of business
 * @property {string} phone - Contact phone
 * @property {string} address - Business address
 * @property {string} city - Business city
 * @property {string} state - Business state/province
 * @property {string} country - Business country
 * @property {string} postalCode - Business postal code
 * @property {string} status - Account status ('pending_verification' | 'active')
 * @property {string} [createdAt] - Creation timestamp
 * @property {string} [emailVerifiedAt] - Email verification timestamp
 */

/** @type {Map<string, MockMerchant>} */
const merchants = new Map();

/**
 * Load mock data from localStorage in browser environment
 */
function loadMockData() {
  if (browser) {
    try {
      // Load merchants
      const merchantsData = localStorage.getItem(MOCK_MERCHANTS_STORAGE_KEY);
      if (merchantsData) {
        const parsedData = JSON.parse(merchantsData);
        Object.entries(parsedData).forEach(([key, value]) => {
          merchants.set(key, value);
        });
      }
      
      // Load verifications
      const verificationsData = localStorage.getItem(MOCK_VERIFICATIONS_STORAGE_KEY);
      if (verificationsData) {
        const parsedData = JSON.parse(verificationsData);
        Object.entries(parsedData).forEach(([key, value]) => {
          pendingVerifications.set(key, value);
        });
      }
    } catch (error) {
      console.error('Error loading mock data from localStorage:', error);
    }
  }
}

/**
 * Save mock data to localStorage in browser environment
 */
function saveMockData() {
  if (browser) {
    try {
      // Save merchants
      const merchantsObj = Object.fromEntries(merchants.entries());
      localStorage.setItem(MOCK_MERCHANTS_STORAGE_KEY, JSON.stringify(merchantsObj));
      
      // Save verifications
      const verificationsObj = Object.fromEntries(pendingVerifications.entries());
      localStorage.setItem(MOCK_VERIFICATIONS_STORAGE_KEY, JSON.stringify(verificationsObj));
    } catch (error) {
      console.error('Error saving mock data to localStorage:', error);
    }
  }
}

/**
 * Clear mock data for a specific email (for development/testing only)
 * @param {string} email - Email to clear
 * @returns {{success: boolean, merchantFound: boolean, verificationFound: boolean, message: string}}
 */
export function _clearMockDataByEmail(email) {
  if (!email) {
    return { 
      success: false, 
      merchantFound: false, 
      verificationFound: false,
      message: 'Email is required'
    };
  }
  
  // Load latest data from localStorage
  loadMockData();
  
  const emailLower = email.toLowerCase();
  let merchantFound = false;
  
  // Find and remove merchant by email
  for (const merchant of merchants.values()) {
    if (merchant.email && merchant.email.toLowerCase() === emailLower) {
      merchants.delete(merchant.id);
      merchantFound = true;
      console.log(`Deleted merchant with ID: ${merchant.id}, email: ${merchant.email}`);
    }
  }
  
  // Find and remove pending verification by email
  let verificationFound = false;
  if (pendingVerifications.has(emailLower)) {
    pendingVerifications.delete(emailLower);
    verificationFound = true;
    console.log(`Deleted verification for email: ${email}`);
  }
  
  // Save updated data to localStorage
  saveMockData();
  
  return {
    success: true,
    merchantFound,
    verificationFound,
    message: merchantFound || verificationFound
      ? `Successfully cleared mock data for ${email}`
      : `No mock data found for ${email}`
  };
}

/**
 * Simulate a delay to mimic network latency
 * @returns {Promise<void>}
 */
async function mockDelay() {
  return new Promise(resolve => setTimeout(resolve, apiConfig.mockDelay));
}

/**
 * Simulate random failures to test error handling
 * @throws {Error} Random error with configurable probability
 */
function simulateRandomFailure() {
  if (
    apiConfig.mockBehavior.simulateRandomFailures &&
    Math.random() < apiConfig.mockBehavior.failureProbability
  ) {
    const error = new Error('Simulated random failure');
    // @ts-ignore - Adding code property to Error
    error.code = ERROR_CODES.SERVER_ERROR;
    throw error;
  }
}

/**
 * Sign up a new merchant
 * @param {MerchantSignUpData} merchantData - Merchant sign-up data
 * @returns {Promise<MerchantSignUpResponse>} Sign-up response
 */
export async function signUp(merchantData) {
  // Load latest data from localStorage
  loadMockData();
  
  await mockDelay();
  simulateRandomFailure();

  // Check if email already exists
  if (Array.from(merchants.values()).some(m => m.email === merchantData.email)) {
    const error = new Error('Email already exists');
    // @ts-ignore - Adding code property to Error
    error.code = ERROR_CODES.EMAIL_EXISTS;
    throw error;
  }

  const merchantId = generateMerchantId();
  const verificationCode = generateVerificationCode();
  const now = new Date().toISOString();

  // Create new merchant
  /** @type {MockMerchant} */
  const merchant = {
    id: merchantId,
    email: merchantData.email,
    businessName: merchantData.businessName,
    password: merchantData.password, // In a real app, this would be hashed
    registrationNumber: merchantData.registrationNumber,
    yearOfRegistration: merchantData.yearOfRegistration,
    businessType: merchantData.businessType,
    phone: merchantData.phone,
    address: merchantData.address?.buildingNumber + ' ' + merchantData.address?.street,
    city: merchantData.address?.city,
    state: merchantData.address?.state,
    country: merchantData.address?.country,
    postalCode: merchantData.address?.zip,
    status: 'pending_verification',
    createdAt: now
  };

  // Store merchant and verification code
  merchants.set(merchantId, merchant);
  pendingVerifications.set(merchantData.email.toLowerCase(), {
    code: verificationCode,
    merchantId
  });
  
  // Save to localStorage
  saveMockData();

  // In development mode, return the verification code for testing
  if (import.meta.env.DEV) {
    return {
      id: merchantId,
      email: merchantData.email,
      status: 'pending_verification',
      message: 'Merchant created successfully. Please verify your email.',
      verificationCode
    };
  }

  return {
    id: merchantId,
    email: merchantData.email,
    status: 'pending_verification',
    message: 'Merchant created successfully. Please verify your email.'
  };
}

/**
 * Verify merchant email with verification code
 * @param {string} email - Merchant email
 * @param {string} code - Verification code
 * @returns {Promise<VerificationResponse>} Verification response
 */
export async function verifyEmail(email, code) {
  await mockDelay();
  simulateRandomFailure();

  // Check if verification exists
  const verification = pendingVerifications.get(email);
  if (!verification) {
    const error = new Error('No verification pending for this email');
    // @ts-ignore - Adding code property to Error
    error.code = ERROR_CODES.EMAIL_NOT_FOUND;
    throw error;
  }

  // Check if code is valid
  if (verification.code !== code) {
    const error = new Error('Invalid verification code');
    // @ts-ignore - Adding code property to Error
    error.code = ERROR_CODES.INVALID_CODE;
    throw error;
  }

  // Get merchant and update status
  const merchant = merchants.get(verification.merchantId);
  if (merchant) {
    merchant.status = 'active';
    merchant.emailVerifiedAt = new Date().toISOString();
    merchants.set(verification.merchantId, merchant);
  }

  // Remove verification
  pendingVerifications.delete(email);

  // Save updated data to localStorage
  saveMockData();

  // Return response
  return {
    success: true,
    message: 'Email verified successfully'
  };
}

/**
 * Get merchant by ID
 * @param {string} merchantId - Merchant ID
 * @returns {Promise<Merchant>} Merchant data
 */
export async function getMerchantById(merchantId) {
  await mockDelay();
  simulateRandomFailure();

  // Check if merchant exists
  const merchant = merchants.get(merchantId);
  if (!merchant) {
    const error = new Error('Merchant not found');
    // @ts-ignore - Adding code property to Error
    error.code = ERROR_CODES.EMAIL_NOT_FOUND;
    throw error;
  }

  // Return merchant data (as type Merchant)
  // @ts-ignore - Ignoring type mismatch for mock implementation
  return { ...merchant };
}

/**
 * Resend verification code to merchant email
 * @param {string} email - Merchant email
 * @returns {Promise<ResendVerificationResponse>} Resend verification response
 */
export async function resendVerificationCode(email) {
  await mockDelay();
  simulateRandomFailure();

  // Check if merchant exists with this email
  const merchant = Array.from(merchants.values()).find(m => m.email === email);
  if (!merchant) {
    const error = new Error('No account found with this email');
    // @ts-ignore - Adding code property to Error
    error.code = ERROR_CODES.EMAIL_NOT_FOUND;
    throw error;
  }

  // Check if merchant is already verified
  if (merchant.status === 'active') {
    const error = new Error('Email is already verified');
    // @ts-ignore - Adding code property to Error
    error.code = ERROR_CODES.VALIDATION_ERROR;
    throw error;
  }

  // Generate new verification code
  const verificationCode = generateVerificationCode();
  
  // Store verification code
  pendingVerifications.set(email, { 
    code: verificationCode, 
    merchantId: merchant.id 
  });

  // Save updated data to localStorage
  saveMockData();

  // Return response
  return {
    success: true,
    message: 'Verification code resent successfully'
  };
}

/**
 * Sign in merchant
 * @param {string} email - Merchant email
 * @param {string} password - Merchant password
 * @returns {Promise<SignInResponse>} Sign-in response
 */
export async function signIn(email, password) {
  await mockDelay();
  simulateRandomFailure();

  // Find merchant by email
  const merchant = Array.from(merchants.values()).find(m => m.email === email);
  
  // Check if merchant exists
  if (!merchant) {
    const error = new Error('Invalid email or password');
    // @ts-ignore - Adding code property to Error
    error.code = ERROR_CODES.INVALID_CREDENTIALS;
    throw error;
  }

  // Check if merchant is verified
  if (merchant.status !== 'active') {
    const error = new Error('Email not verified. Please verify your email before signing in.');
    // @ts-ignore - Adding code property to Error
    error.code = ERROR_CODES.EMAIL_NOT_VERIFIED;
    throw error;
  }

  // In a real system, we would check the password hash
  // For mock purposes, we'll just check if the password matches
  if (merchant.password !== password) {
    const error = new Error('Invalid email or password');
    // @ts-ignore - Adding code property to Error
    error.code = ERROR_CODES.INVALID_CREDENTIALS;
    throw error;
  }

  // Generate a mock token
  const token = `mock-token-${merchant.id}-${Date.now()}`;

  // Return sign-in response
  return {
    success: true,
    merchantId: merchant.id,
    token: token,
    message: 'Signed in successfully'
  };
}
