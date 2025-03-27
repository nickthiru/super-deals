/**
 * Merchant Store
 * Manages merchant state and authentication
 */

import { merchantService } from '$lib/services';
import { goto } from '$app/navigation';

// Merchant store state using Svelte 5 runes
// We are using runes directly without imports as they're built into Svelte 5
// eslint-disable-next-line no-undef
let merchantId = $state(localStorage.getItem('merchantId') || '');
// eslint-disable-next-line no-undef
let merchantData = $state(/** @type {import('$lib/services/api/merchantService').Merchant|null} */ (null));
// eslint-disable-next-line no-undef
let isAuthenticated = $derived(!!merchantId);
// eslint-disable-next-line no-undef
let isLoading = $state(false);
// eslint-disable-next-line no-undef
let error = $state('');

// Export state and actions
export { merchantId, merchantData, isAuthenticated, isLoading, error };

/**
 * @typedef {import('$lib/services/api/merchantService').MerchantData} MerchantData
 */

/**
 * Register a new merchant
 * @param {MerchantData} formData - Merchant registration data
 * @returns {Promise<{success: boolean, message?: string, error?: string, merchantId?: string}>} Result of sign-up
 */
export async function registerMerchant(formData) {
  isLoading = true;
  error = '';

  try {
    const response = await merchantService.signUp(formData);
    
    // Store merchant ID temporarily (not authenticated yet)
    localStorage.setItem('pendingMerchantId', response.id);
    
    isLoading = false;
    return {
      success: true,
      message: 'Registration successful. Please verify your email.',
      merchantId: response.id
    };
  } catch (err) {
    isLoading = false;
    // Type cast err to any to handle unknown type
    error = (/** @type {any} */ (err)).message || 'Failed to register merchant';
    
    return {
      success: false,
      error: error
    };
  }
}

/**
 * Verify merchant email
 * @param {string} email - Merchant email
 * @param {string} code - Verification code
 * @returns {Promise<{success: boolean, message?: string, error?: string}>} Result of verification
 */
export async function verifyMerchantEmail(email, code) {
  isLoading = true;
  error = '';

  try {
    const response = await merchantService.verifyEmail(email, code);
    
    // If verification is successful, we can now consider the merchant registered
    // but not yet authenticated (they need to sign in)
    // We don't use pendingId here but it's good to clean up storage
    localStorage.removeItem('pendingMerchantId');
    
    isLoading = false;
    return {
      success: true,
      message: response.message || 'Email verified successfully'
    };
  } catch (err) {
    isLoading = false;
    // Type cast err to any to handle unknown type
    error = (/** @type {any} */ (err)).message || 'Failed to verify email';
    
    return {
      success: false,
      error: error
    };
  }
}

/**
 * Resend verification code
 * @param {string} email - Merchant email
 * @returns {Promise<{success: boolean, message?: string, error?: string}>} Result of resend
 */
export async function resendVerificationCodeToMerchant(email) {
  isLoading = true;
  error = '';

  try {
    const response = await merchantService.resendVerificationCode(email);
    
    isLoading = false;
    return {
      success: true,
      message: response.message || 'Verification code resent successfully'
    };
  } catch (err) {
    isLoading = false;
    // Type cast err to any to handle unknown type
    error = (/** @type {any} */ (err)).message || 'Failed to resend verification code';
    
    return {
      success: false,
      error: error
    };
  }
}

/**
 * Sign in merchant
 * @param {string} email - Merchant email
 * @param {string} password - Merchant password
 * @returns {Promise<{success: boolean, message?: string, error?: string}>} Result of sign-in
 */
export async function signInMerchant(email, password) {
  isLoading = true;
  error = '';

  try {
    const response = await merchantService.signIn(email, password);
    
    // Store merchant ID in local storage for persistence
    localStorage.setItem('merchantId', response.merchantId);
    merchantId = response.merchantId;
    
    // Load merchant data
    await loadMerchantData(response.merchantId);
    
    isLoading = false;
    return {
      success: true,
      message: 'Signed in successfully'
    };
  } catch (err) {
    isLoading = false;
    // Type cast err to any to handle unknown type
    error = (/** @type {any} */ (err)).message || 'Failed to sign in';
    
    return {
      success: false,
      error: error
    };
  }
}

/**
 * Load merchant data
 * @param {string} id - Merchant ID
 * @returns {Promise<void>}
 */
export async function loadMerchantData(id) {
  if (!id) return;
  
  isLoading = true;
  error = '';

  try {
    // Type safety: ensure data is not null before assignment
    const data = await merchantService.getMerchantById(id);
    if (data) {
      // Explicitly type cast to Merchant type
      merchantData = /** @type {import('$lib/services/api/merchantService').Merchant} */ (data);
      merchantId = id;
    }
    isLoading = false;
  } catch (err) {
    isLoading = false;
    // Type cast err to any to handle unknown type
    error = (/** @type {any} */ (err)).message || 'Failed to load merchant data';
    // If we can't load the merchant data, sign them out
    signOutMerchant();
  }
}

/**
 * Sign out merchant
 * @returns {void}
 */
export function signOutMerchant() {
  // Clear local storage
  localStorage.removeItem('merchantId');
  
  // Reset store state
  merchantId = '';
  merchantData = null;
  error = '';
  
  // Redirect to sign-in page
  goto('/merchants/sign-in');
}

// Initialize store when a merchant ID is available but data isn't loaded
// eslint-disable-next-line no-undef
$effect(() => {
  // If we have a merchant ID stored but no merchant data, load it
  if (merchantId && !merchantData) {
    loadMerchantData(merchantId);
  }
});
