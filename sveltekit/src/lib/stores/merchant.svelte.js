// Using Svelte 5 runes for state management
// Note: Runes don't need to be imported in Svelte 5

/**
 * Merchant store using Svelte 5 runes
 * Manages the current merchant state across the application
 */

// Current merchant data
let merchantState = $state(/** @type {import('$lib/types/merchant').Merchant | null} */ (null));

// Loading state
let loadingState = $state(false);

// Error state
let errorState = $state(/** @type {string | null} */ (null));

// Whether the merchant is authenticated
let isAuthenticatedState = $derived(!!merchantState);

// Whether email verification is pending
let isEmailVerificationPendingState = $derived(
  merchantState && 
  merchantState.status === 'Pending Review' && 
  merchantState.emailVerified === false
);

/**
 * Set the current merchant
 * @param {import('$lib/types/merchant').Merchant} merchantData - Merchant data
 */
export function setMerchant(merchantData) {
  merchantState = merchantData;
}

/**
 * Clear the current merchant
 */
export function clearMerchant() {
  merchantState = null;
}

/**
 * Set loading state
 * @param {boolean} loading - Loading state
 */
export function setLoading(loading) {
  loadingState = loading;
}

/**
 * Set error state
 * @param {string|null} errorMessage - Error message or null to clear
 */
export function setError(errorMessage) {
  errorState = errorMessage;
}

// Create derived values and then export functions that return them
const merchantValue = $derived(merchantState);
const isLoadingValue = $derived(loadingState);
const errorValue = $derived(errorState);
const isAuthenticatedValue = $derived(isAuthenticatedState);
const isEmailVerificationPendingValue = $derived(isEmailVerificationPendingState);

// Export functions that return the derived values
export function merchant() {
  return merchantValue;
}

export function isLoading() {
  return isLoadingValue;
}

export function error() {
  return errorValue;
}

export function isAuthenticated() {
  return isAuthenticatedValue;
}

export function isEmailVerificationPending() {
  return isEmailVerificationPendingValue;
}

// Effect to persist merchant data to localStorage
$effect(() => {
  if (typeof window !== 'undefined') {
    if (merchantState) {
      localStorage.setItem('merchant', JSON.stringify(merchantState));
    } else {
      localStorage.removeItem('merchant');
    }
  }
});

// Initialize from localStorage if available
export function initFromLocalStorage() {
  if (typeof window !== 'undefined') {
    const storedMerchant = localStorage.getItem('merchant');
    if (storedMerchant) {
      try {
        merchantState = JSON.parse(storedMerchant);
      } catch (e) {
        console.error('Failed to parse stored merchant data', e);
        localStorage.removeItem('merchant');
      }
    }
  }
}
