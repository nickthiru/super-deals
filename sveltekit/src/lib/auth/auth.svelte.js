// Authentication utilities using Svelte 5 runes
import { signUp, signIn, signOut, getCurrentUser, confirmSignUp } from 'aws-amplify/auth';

/**
 * @typedef {Object} AuthState
 * @property {Object|null} user - The authenticated user object
 * @property {boolean} isLoading - Whether authentication is in progress
 * @property {Object|null} error - Any authentication error
 */

/**
 * Reactive authentication state
 * @type {AuthState}
 */
export const auth = $state({
  user: null,
  isLoading: true,
  error: null
});

// Computed properties
// Create a derived value and then export a function that returns it
const isAuthenticatedValue = $derived(!!auth.user);
export function isAuthenticated() {
  return isAuthenticatedValue;
}

// Load the current authenticated user
$effect(() => {
  checkAuthState();
});

/**
 * Check the current authentication state
 * @returns {Promise<void>}
 */
export async function checkAuthState() {
  auth.isLoading = true;
  auth.error = null;
  
  try {
    /** @type {Object} */
    const currentUser = await getCurrentUser();
    auth.user = currentUser;
  } catch (/** @type {any} */ err) {
    auth.user = null;
    // Only set error if it's not the "not authenticated" error
    if (typeof err === 'object' && err !== null && 
        'message' in err && 
        (err.message !== 'The user is not authenticated' && 
        err.message !== 'No current user')) {
      auth.error = err;
    }
  } finally {
    auth.isLoading = false;
  }
}



/**
 * Confirm sign up with verification code
 * @param {string} email - User's email
 * @param {string} code - Verification code
 * @returns {Promise<Object>} - Confirmation result
 */
export async function confirmUserSignUp(email, code) {
  auth.isLoading = true;
  auth.error = null;
  
  try {
    return await confirmSignUp({
      username: email,
      confirmationCode: code
    });
  } catch (/** @type {any} */ err) {
    auth.error = err;
    throw err;
  } finally {
    auth.isLoading = false;
  }
}

/**
 * Sign in a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Sign in result
 */
export async function loginUser(email, password) {
  auth.isLoading = true;
  auth.error = null;
  
  try {
    /** @type {Object} */
    const result = await signIn({
      username: email,
      password
    });
    // After sign in, refresh the user state
    await checkAuthState();
    return result;
  } catch (/** @type {any} */ err) {
    auth.error = err;
    throw err;
  } finally {
    auth.isLoading = false;
  }
}

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  auth.isLoading = true;
  auth.error = null;
  
  try {
    await signOut();
    auth.user = null;
  } catch (/** @type {any} */ err) {
    auth.error = err;
    throw err;
  } finally {
    auth.isLoading = false;
  }
}


