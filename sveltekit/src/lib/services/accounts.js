/**
 * Accounts Service
 * Handles all account-related operations for different user types (merchants, customers, admins)
 */

import { useMockApi } from '$lib/config/api';
import * as mockMerchantService from '$lib/services/mock/merchantService';
import { handleApiError } from '$lib/utils/errorHandling';
import { confirmSignUp, signIn as amplifySignIn } from 'aws-amplify/auth';

// Default to global fetch if no fetch function is provided
const defaultFetch = globalThis.fetch;

/**
 * @typedef {import('@super-deals/types').MerchantSignUpData} MerchantSignUpData
 * @typedef {import('@super-deals/types').MerchantSignUpResponse} MerchantSignUpResponse
 * @typedef {Object} VerificationResponse
 * @property {boolean} success - Whether verification was successful
 * @property {boolean} isSignUpComplete - Whether sign-up process is complete
 * @property {string} message - Verification message
 * @property {string} [userType] - Type of user being verified
 * @typedef {import('@super-deals/types').ResendVerificationResponse} ResendVerificationResponse
 * @typedef {import('@super-deals/types').Merchant} Merchant
 * @typedef {import('@super-deals/types').SignInResponse} SignInResponse
 * @typedef {any} SignUpData Generic sign-up data for any user type
 * @typedef {any} SignUpResponse Generic sign-up response for any user type
 * @typedef {any} UserProfile Generic user profile for any user type
 */

/**
 * Sign up a new user (merchant, customer, admin)
 * @param {string} userType - User type (merchant, customer, admin)
 * @param {SignUpData} signUpData - User sign-up data
 * @param {Function} [customFetch=defaultFetch] - Optional fetch function to use
 * @returns {Promise<SignUpResponse>} Sign-up response
 */
export async function signUp(userType, signUpData, customFetch = defaultFetch) {
	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			// Pass the user type to the mock service if it supports it
			// Add userType to the signUpData object instead of passing it separately
			const enrichedData = { ...signUpData, userType };
			return await mockMerchantService.signUp(enrichedData);
		}

		// Real API implementation
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
	} catch (error) {
		throw await handleApiError(error);
	}
}

// VerificationResponse type is imported from @super-deals/types

/**
 * Verify user email with verification code
 * @param {string} userType - User type (merchant, customer, admin)
 * @param {string} email - User email
 * @param {string} code - Verification code
 * @returns {Promise<VerificationResponse>} Verification response with isSignUpComplete flag
 */
export async function verifyEmail(userType, email, code) {
	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			// Mock service might not support userType parameter yet, so handle both cases
			// Use the original mock service but enrich the result with userType info
			const result = await mockMerchantService.verifyEmail(email, code);

			// Cast the result to any first to avoid type errors when accessing properties
			const anyResult = /** @type {any} */ (result);

			// Ensure the result has the isSignUpComplete property
			if (!('isSignUpComplete' in anyResult)) {
				anyResult.isSignUpComplete = anyResult.success;
			}

			// Now cast to the correct return type
			const typedResult = /** @type {VerificationResponse} */ (anyResult);

			// Store the user type with the result (for internal use)
			/** @type {any} */ (typedResult).userType = userType;

			return typedResult;
		}

		// Use AWS Amplify for email verification
		const { isSignUpComplete, nextStep } = await confirmSignUp({
			username: email,
			confirmationCode: code
		});

		console.log('Email verification result:', { isSignUpComplete, nextStep });

		// Create response object in the expected format
		/** @type {VerificationResponse} */
		const data = {
			success: isSignUpComplete,
			isSignUpComplete, // Include this flag for the caller to use
			message: isSignUpComplete ? 'Email verified successfully' : 'Email verification failed'
		};

		// Log the nextStep separately (not part of the expected response type)
		console.log('Next step details:', nextStep);
		return data;
	} catch (error) {
		console.log('Error confirming sign up:', error);
		throw await handleApiError(error);
	}
}

// Merchant type is imported from @super-deals/types

/**
 * Get user details by ID
 * @param {string} userType - User type (merchant, customer, admin)
 * @param {string} userId - User ID
 * @param {Function} [customFetch=defaultFetch] - Optional fetch function to use
 * @returns {Promise<UserProfile>} User details
 */
export async function getUserById(userType, userId, customFetch = defaultFetch) {
	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			return await mockMerchantService.getMerchantById(userId);
		}

		// Real API implementation
		const fetchToUse = customFetch || defaultFetch;
		const response = await fetchToUse(`/api/accounts/${userType}s/${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw response;
		}

		/** @type {UserProfile} */
		const data = await response.json();
		return data;
	} catch (error) {
		throw await handleApiError(error);
	}
}

// ResendVerificationResponse type is imported from @super-deals/types

/**
 * Resend verification code to user email
 * @param {string} userType - User type (merchant, customer, admin)
 * @param {string} email - User email
 * @param {Function} [customFetch=defaultFetch] - Optional fetch function to use
 * @returns {Promise<ResendVerificationResponse>} Resend response
 */
export async function resendVerificationCode(userType, email, customFetch = defaultFetch) {
	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			return await mockMerchantService.resendVerificationCode(email);
		}

		// Real API implementation
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
	} catch (error) {
		throw await handleApiError(error);
	}
}

// SignInResponse type is imported from @super-deals/types

/**
 * Sign in a user
 * @param {string} userType - User type (merchant, customer, admin)
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Function} [_customFetch=defaultFetch] - Optional fetch function (reserved for future use)
 * @returns {Promise<SignInResponse>} Sign-in response
 */
export async function signIn(
	userType,
	email,
	password,
	/* eslint-disable-next-line no-unused-vars */ _customFetch = defaultFetch
) {
	// Currently using AWS Amplify directly
	// _customFetch parameter is reserved for future API-based authentication
	// but not used in the current implementation
	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			return await mockMerchantService.signIn(email, password);
		}

		// For direct Amplify authentication (can be replaced with API call if needed)
		// Note: Currently using direct Amplify auth, but in the future we could use custom fetch
		// for API calls to a custom endpoint
		// const fetchToUse = customFetch || defaultFetch;

		const { isSignedIn, nextStep } = await amplifySignIn({
			username: email,
			password
		});

		console.log('Sign in result:', { isSignedIn, nextStep });

		// Create response object in the expected format
		/** @type {SignInResponse} */
		const data = {
			success: isSignedIn,
			message: isSignedIn ? 'Sign in successful' : 'Sign in failed',
			merchantId: isSignedIn ? email : '', // Using email as ID, empty string if not signed in
			token: isSignedIn ? `amplify-token-${Date.now()}` : '' // Mock token for compatibility
		};

		// Log the nextStep separately (not part of the expected response type)
		console.log('Next step details:', nextStep);
		return data;
	} catch (error) {
		console.log('Error signing in:', error);
		throw await handleApiError(error);
	}
}
