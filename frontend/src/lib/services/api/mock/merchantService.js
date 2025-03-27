/**
 * Mock Merchant API Service
 * 
 * Provides mock implementations of merchant API endpoints for development
 */

import { apiConfig } from '$lib/config/api';

/**
 * @typedef {Object} MerchantSignUpResponse
 * @property {string} id - Merchant ID
 * @property {string} email - Merchant email
 * @property {string} status - Account status
 * @property {string} message - Response message
 */

/**
 * @typedef {Object} VerificationResponse
 * @property {boolean} success - Whether verification was successful
 * @property {string} message - Response message
 */

/**
 * @typedef {Object} ResendVerificationResponse
 * @property {boolean} success - Whether resend was successful
 * @property {string} message - Response message
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
 */

/**
 * @typedef {Object} SignInResponse
 * @property {boolean} success - Whether sign-in was successful
 * @property {string} merchantId - Merchant ID
 * @property {string} token - Auth token (in a real implementation)
 * @property {string} message - Response message
 */

/**
 * @typedef {Object} MerchantData
 * @property {string} email - Merchant email
 * @property {string} businessName - Business name
 * @property {string} password - Password
 */

// Store for pending email verifications
const pendingVerifications = new Map();

// Mock merchant database
const merchants = new Map();

// Generate a random ID
function generateId() {
  return `merchant_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

// Generate a verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simulate network delay
async function mockDelay() {
  await new Promise(resolve => setTimeout(resolve, apiConfig.mockDelay));
}

// Simulate random failures for testing error handling
function simulateRandomFailure() {
  const { simulateRandomFailures, failureProbability } = apiConfig.mockBehavior;
  
  if (simulateRandomFailures && Math.random() < failureProbability) {
    throw new Error('Random failure simulated for testing');
  }
}

/**
 * Mock sign up implementation
 * @param {MerchantData} merchantData 
 * @returns {Promise<MerchantSignUpResponse>}
 */
export async function signUp(merchantData) {
  await mockDelay();
  simulateRandomFailure();
  
  // Validate email
  if (!merchantData.email) {
    throw new Error('Email is required');
  }
  
  // Check if email already exists
  if (merchants.has(merchantData.email)) {
    throw new Error('Email already registered');
  }
  
  // Create a mock merchant
  const merchantId = generateId();
  const verificationCode = generateVerificationCode();
  
  // Create merchant object with partial data
  const merchant = {
    id: merchantId,
    email: merchantData.email,
    businessName: merchantData.businessName || 'Unnamed Business',
    status: 'UNCONFIRMED'
  };
  
  // Store merchant
  merchants.set(merchantData.email, merchant);
  
  // Store verification code for later verification
  pendingVerifications.set(merchantData.email, { 
    code: verificationCode, 
    merchantId 
  });
  
  console.log(`[MOCK API] Created merchant: ${merchant.id}, verification code: ${verificationCode}`);
  
  return {
    id: merchantId,
    email: merchantData.email,
    status: 'UNCONFIRMED',
    message: 'Merchant created successfully. Please verify your email.'
  };
}

/**
 * Mock verify email implementation
 * @param {string} email 
 * @param {string} code 
 * @returns {Promise<VerificationResponse>}
 */
export async function verifyEmail(email, code) {
  await mockDelay();
  simulateRandomFailure();
  
  // Check if email exists in pending verifications
  if (!pendingVerifications.has(email)) {
    throw new Error('No pending verification found for this email');
  }
  
  const verification = pendingVerifications.get(email);
  
  // Check if code matches
  if (verification.code !== code) {
    throw new Error('Invalid verification code');
  }
  
  // Update merchant status
  const merchant = merchants.get(email);
  merchant.status = 'CONFIRMED';
  
  // Remove from pending verifications
  pendingVerifications.delete(email);
  
  return {
    success: true,
    message: 'Email verified successfully'
  };
}

/**
 * Mock resend verification code implementation
 * @param {string} email 
 * @returns {Promise<ResendVerificationResponse>}
 */
export async function resendVerificationCode(email) {
  await mockDelay();
  simulateRandomFailure();
  
  // Check if email exists
  if (!merchants.has(email)) {
    throw new Error('Email not found');
  }
  
  const merchant = merchants.get(email);
  
  // Only resend for unconfirmed accounts
  if (merchant.status !== 'UNCONFIRMED') {
    throw new Error('Email already verified');
  }
  
  // Generate a new verification code
  const verificationCode = generateVerificationCode();
  
  // Update verification code
  pendingVerifications.set(email, { 
    code: verificationCode, 
    merchantId: merchant.id 
  });
  
  console.log(`[MOCK API] Resent verification code for ${email}: ${verificationCode}`);
  
  return {
    success: true,
    message: 'Verification code resent'
  };
}

/**
 * Mock get merchant by ID implementation
 * @param {string} merchantId 
 * @returns {Promise<Merchant>}
 */
export async function getMerchantById(merchantId) {
  await mockDelay();
  simulateRandomFailure();
  
  // Find merchant by ID
  let targetMerchant = null;
  
  for (const merchant of merchants.values()) {
    if (merchant.id === merchantId) {
      targetMerchant = merchant;
      break;
    }
  }
  
  if (!targetMerchant) {
    throw new Error('Merchant not found');
  }
  
  // Return a copy with some additional mock data
  return {
    ...targetMerchant,
    businessType: 'Retail',
    registrationNumber: 'REG123456',
    yearOfRegistration: 2023,
    phone: '+1234567890',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    country: 'USA',
    postalCode: '12345'
  };
}

/**
 * Mock sign in implementation
 * @param {string} email 
 * @param {string} password - Not used in mock implementation
 * @returns {Promise<SignInResponse>}
 */
export async function signIn(email, password) {
  await mockDelay();
  simulateRandomFailure();
  
  // Check if email exists
  if (!merchants.has(email)) {
    throw new Error('Invalid email or password');
  }
  
  const merchant = merchants.get(email);
  
  // Check if account is confirmed
  if (merchant.status !== 'CONFIRMED') {
    throw new Error('Email not verified');
  }
  
  // In mock implementation, password is not validated
  // This is a mock authentication only
  
  return {
    success: true,
    merchantId: merchant.id,
    token: 'mock-auth-token-' + Date.now(),
    message: 'Signed in successfully'
  };
}
