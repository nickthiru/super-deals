/**
 * Utility to clear mock data for testing purposes
 * This file should only be used in development environments
 */

// Import the mock service to access its module scope
import * as merchantService from './merchantService.js';

/**
 * Clear mock data for a specific email
 * @param {string} email - Email address to clear
 * @returns {Promise<{success: boolean, merchantFound: boolean, verificationFound: boolean}>}
 */
export async function clearMerchantByEmail(email) {
  if (!email) {
    throw new Error('Email is required');
  }

  // Use a direct approach to clear data
  // This works by calling a specially created function in the mock service
  try {
    // Add a small delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Call the internal function if it exists
    if (typeof merchantService._clearMockDataByEmail === 'function') {
      return await merchantService._clearMockDataByEmail(email);
    }
    
    return {
      success: false,
      merchantFound: false,
      verificationFound: false,
      message: 'Clear function not available'
    };
  } catch (error) {
    console.error('Error clearing mock data:', error);
    return {
      success: false,
      merchantFound: false,
      verificationFound: false,
      message: error.message || 'Unknown error'
    };
  }
}
