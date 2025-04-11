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

import { useMockApi } from '$lib/config/api';
import * as mockMerchantService from '$lib/services/mock/merchantService';
import { handleApiError } from '$lib/utils/errorHandling';

// Default to global fetch if no fetch function is provided
const defaultFetch = globalThis.fetch;

/**
 * Sign up a new user (merchant, customer, admin)
 * @param {string} userType - User type (merchant, customer, admin)
 * @param {SignUpData} signUpData - User sign-up data
 * @param {Function} [customFetch=defaultFetch] - Optional fetch function to use
 * @returns {Promise<SignUpResponse>} Sign-up response
 */
export default async function signUp(userType, signUpData, customFetch = defaultFetch) {
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
