/**
 * @typedef {import('@super-deals/types').SignInResponse} SignInResponse
 */

import { useMockApi } from '$lib/config/api';
import * as mockMerchantService from '$lib/services/mock/merchantService';
import { handleApiError } from '$lib/utils/errorHandling';
import { signIn as amplifySignIn } from 'aws-amplify/auth';

// Default to global fetch if no fetch function is provided
const defaultFetch = globalThis.fetch;

/**
 * Sign in a user
 * @param {string} userType - User type (merchant, customer, admin)
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Function} [_customFetch=defaultFetch] - Optional fetch function (reserved for future use)
 * @returns {Promise<SignInResponse>} Sign-in response
 */
export default async function signIn(
	userType,
	email,
	password,
	// We're keeping this parameter for API consistency with other functions
	// eslint-disable-next-line no-unused-vars
	_customFetch = defaultFetch
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
