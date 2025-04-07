/**
 * Merchant API Service
 * Handles all merchant-related API calls
 */

import { apiConfig, useMockApi } from '$lib/config/api';
import * as mockMerchantService from '$lib/services/mock/merchantService';
import { handleApiError } from '$lib/utils/errorHandling';
import { confirmSignUp, signIn as amplifySignIn } from 'aws-amplify/auth';

// Default to global fetch if no fetch function is provided
const defaultFetch = globalThis.fetch;

/**
 * @typedef {import('@super-deals/types').MerchantSignUpData} MerchantSignUpData
 * @typedef {import('@super-deals/types').MerchantSignUpResponse} MerchantSignUpResponse
 * @typedef {import('@super-deals/types').VerificationResponse} VerificationResponse
 * @typedef {import('@super-deals/types').ResendVerificationResponse} ResendVerificationResponse
 * @typedef {import('@super-deals/types').Merchant} Merchant
 * @typedef {import('@super-deals/types').SignInResponse} SignInResponse
 */

/**
 * Sign up a new merchant
 * @param {MerchantSignUpData} merchantData - Merchant sign-up data
 * @param {Function} [customFetch=defaultFetch] - Optional fetch function to use
 * @returns {Promise<MerchantSignUpResponse>} Sign-up response
 */
export async function signUp(merchantData, customFetch = defaultFetch) {
	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			return await mockMerchantService.signUp(merchantData);
		}

		// Real API implementation
		const fetchToUse = customFetch || defaultFetch;
		const response = await fetchToUse(`${apiConfig.apiBaseUrl}merchants/account/sign-up`, {
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

// VerificationResponse type is imported from @super-deals/types

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
 * Get merchant details by ID
 * @param {string} merchantId - Merchant ID
 * @param {Function} [customFetch=defaultFetch] - Optional fetch function to use
 * @returns {Promise<Merchant>} Merchant details
 */
export async function getMerchantById(merchantId, customFetch = defaultFetch) {
	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			return await mockMerchantService.getMerchantById(merchantId);
		}

		// Real API implementation
		const fetchToUse = customFetch || defaultFetch;
		const response = await fetchToUse(`${apiConfig.apiBaseUrl}merchants/${merchantId}`, {
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

// ResendVerificationResponse type is imported from @super-deals/types

/**
 * Resend verification code to merchant email
 * @param {string} email - Merchant email
 * @param {Function} [customFetch=defaultFetch] - Optional fetch function to use
 * @returns {Promise<ResendVerificationResponse>} Resend response
 */
export async function resendVerificationCode(email, customFetch = defaultFetch) {
	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			return await mockMerchantService.resendVerificationCode(email);
		}

		// Real API implementation
		const fetchToUse = customFetch || defaultFetch;
		const response = await fetchToUse(`${apiConfig.apiBaseUrl}merchants/resend-verification`, {
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

		// Use AWS Amplify for sign in
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
