// Authentication utilities using Svelte 5 runes
import {
	signIn as amplifySignIn,
	signOut,
	getCurrentUser,
	confirmSignUp,
	resendSignUpCode
} from 'aws-amplify/auth';
import { useMockApi } from '$lib/config/api';
import * as mockMerchantService from '$lib/services/mock/merchantService';
import { handleApiError } from '$lib/utils/errorHandling';

import { dev } from '$app/environment';

/**
 * @typedef {import('@super-deals/types').MerchantSignUpData} MerchantSignUpData
 * @typedef {import('@super-deals/types').MerchantSignUpResponse} MerchantSignUpResponse
 * @typedef {import('@super-deals/types').ResendVerificationResponse} ResendVerificationResponse
 * @typedef {import('@super-deals/types').SignInResponse} SignInResponse
 * @typedef {any} SignUpData Generic sign-up data for any user type
 * @typedef {any} SignUpResponse Generic sign-up response for any user type
 * @typedef {any} UserProfile Generic user profile for any user type
 *
 * @typedef {Object} VerificationResponse
 * @property {boolean} success - Whether the verification was successful
 * @property {boolean} isSignUpComplete - Whether the sign-up process is complete
 * @property {string} message - A message describing the result
 * @property {string} userType - The type of user being verified
 */

/**
 * @typedef {Object} MockVerificationResponse
 * @property {boolean} success - Whether the verification was successful
 * @property {boolean} [isSignUpComplete] - Whether the sign-up process is complete
 * @property {string} message - A message describing the result
 */

/**
 * @typedef {Object} AuthState
 * @property {Object|null} user - The authenticated user object
 * @property {string|null} userType - The type of user (merchant, customer, admin)
 * @property {boolean} isLoading - Whether authentication is in progress
 * @property {Object|null} error - Any authentication error
 */

// Default to global fetch if no fetch function is provided
const defaultFetch = globalThis.fetch;

/**
 * Reactive authentication state
 * @type {AuthState}
 */
export const auth = $state({
	user: null,
	userType: null,
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
		if (
			typeof err === 'object' &&
			err !== null &&
			'message' in err &&
			err.message !== 'The user is not authenticated' &&
			err.message !== 'No current user'
		) {
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
 * @param {string} [userType='user'] - User type (merchant, customer, admin)
 * @returns {Promise<Object>} - Confirmation result
 */
export async function confirmUserSignUp(email, code, userType = 'user') {
	auth.isLoading = true;
	auth.error = null;

	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			// Mock service might not support userType parameter yet
			/** @type {MockVerificationResponse} */
			const result = await mockMerchantService.verifyEmail(email, code);

			// Ensure the result has the isSignUpComplete property
			if (!('isSignUpComplete' in result)) {
				result.isSignUpComplete = result.success;
			}

			// Store the user type with the result
			/** @type {VerificationResponse} */
			const typedResult = {
				...result,
				userType,
				isSignUpComplete: result.isSignUpComplete || result.success
			};

			// In mock mode, simulate publishing to  if verification was successful
			if (typedResult.isSignUpComplete) {
				console.log('[MOCK] Would publish to :', {
					email,
					userType,
					verificationTime: new Date().toISOString()
				});
			}

			return typedResult;
		}

		// Use AWS Amplify for email verification
		const { isSignUpComplete, nextStep } = await confirmSignUp({
			username: email,
			confirmationCode: code
		});

		if (dev) {
			console.log('Email verification result:', { isSignUpComplete, nextStep });
		}

		// Create response object in the expected format
		const data = {
			success: isSignUpComplete,
			isSignUpComplete,
			message: isSignUpComplete ? 'Email verified successfully' : 'Email verification failed',
			userType
		};

		// If sign-up is complete, mock welcome email in development
		if (isSignUpComplete && dev) {
			console.log('MOCK: Would send welcome email to:', email);
			console.log('MOCK: Email data:', {
				email,
				userType,
				verificationTime: new Date().toISOString()
			});
		}

		return data;
	} catch (/** @type {any} */ err) {
		auth.error = err;
		throw await handleApiError(err);
	} finally {
		auth.isLoading = false;
	}
}

/**
 * Sign up a new user
 * @param {SignUpData} signUpData - User sign-up data (must include userType field)
 * @param {Function} [customFetch=defaultFetch] - Optional fetch function to use
 * @returns {Promise<SignUpResponse>} Sign-up response
 */
export async function registerUser(signUpData, customFetch = defaultFetch) {
	auth.isLoading = true;
	auth.error = null;

	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			// Pass the data to the mock service
			return await mockMerchantService.signUp(signUpData);
		}

		// For direct API calls
		// Note: userType must be included in signUpData from the page.server.js action
		// This ensures the backend receives the user type information
		const fetchToUse = customFetch || defaultFetch;
		const response = await fetchToUse(`/api/accounts`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(signUpData)
		});

		if (!response.ok) {
			throw response;
		}

		/** @type {SignUpResponse} */
		const data = await response.json();
		return data;
	} catch (/** @type {any} */ err) {
		auth.error = err;
		throw await handleApiError(err);
	} finally {
		auth.isLoading = false;
	}
}

/**
 * Resend verification code to user email
 * @param {string} userType - User type (merchant, customer, admin)
 * @param {string} email - User email
 * @param {Function} [customFetch=defaultFetch] - Optional fetch function to use
 * @returns {Promise<ResendVerificationResponse>} Resend response
 */
export async function resendVerificationCode(userType, email, customFetch = defaultFetch) {
	auth.isLoading = true;
	auth.error = null;

	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			return await mockMerchantService.resendVerificationCode(email);
		}

		// Try using Amplify directly first
		try {
			await resendSignUpCode({ username: email });
			return {
				success: true,
				message: 'Verification code resent successfully'
			};
		} catch (amplifyErr) {
			// If Amplify fails, try the API
			console.log('Amplify resend failed, trying API:', amplifyErr);
		}

		// Fall back to API implementation
		const fetchToUse = customFetch || defaultFetch;
		const response = await fetchToUse(`/api/accounts/${userType}s/resend-verification`, {
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
	} catch (/** @type {any} */ err) {
		auth.error = err;
		throw await handleApiError(err);
	} finally {
		auth.isLoading = false;
	}
}

/**
 * Sign in a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} [userType='user'] - User type (merchant, customer, admin)
 * @returns {Promise<SignInResponse>} - Sign in result
 */
export async function loginUser(email, password, userType = 'user') {
	auth.isLoading = true;
	auth.error = null;

	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			return await mockMerchantService.signIn(email, password);
		}

		// Use Amplify for authentication
		const result = await amplifySignIn({
			username: email,
			password
		});

		// Set the user type in the auth state
		auth.userType = userType;

		// After sign in, refresh the user state
		await checkAuthState();

		// Create response object in the expected format for API consistency
		const { isSignedIn } = result;
		console.log('Sign in result:', result); // Log for debugging

		/** @type {SignInResponse} */
		const formattedResult = {
			success: isSignedIn,
			message: isSignedIn ? 'Sign in successful' : 'Sign in failed',
			merchantId: isSignedIn ? email : '', // Using email as ID, empty string if not signed in
			token: isSignedIn ? `amplify-token-${Date.now()}` : '' // Mock token for compatibility
		};

		return formattedResult;
	} catch (/** @type {any} */ err) {
		auth.error = err;
		throw await handleApiError(err);
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
