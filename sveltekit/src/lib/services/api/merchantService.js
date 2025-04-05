/**
 * Merchant API Service
 * Handles all merchant-related API calls
 */

import { apiConfig, useMockApi } from '$lib/config/api';
import * as mockMerchantService from '$lib/services/mock/merchantService';
import { handleApiError } from '$lib/utils/errorHandling';

// Default to global fetch if no fetch function is provided
const defaultFetch = globalThis.fetch;

/**
 * @typedef {Object} MerchantData
 * @property {string} email - Merchant email
 * @property {string} businessName - Business name
 * @property {string} password - Password
 */

/**
 * @typedef {Object} MerchantSignUpResponse
 * @property {string} id - Merchant ID
 * @property {string} email - Merchant email
 * @property {string} status - Account status
 * @property {string} message - Response message
 */

/**
 * Sign up a new merchant
 * @param {MerchantData} merchantData - Merchant sign-up data
 * @param {Function} [customFetch=defaultFetch] - Optional fetch function to use
 * @returns {Promise<MerchantSignUpResponse>} Sign-up response
 */
export async function signUp(merchantData, customFetch = defaultFetch) {
	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			return await mockMerchantService.signUp(merchantData);
		}

		console.log('apiBaseUrl', apiConfig.apiBaseUrl);
		console.log('full url', `${apiConfig.apiBaseUrl}merchants/account/sign-up`);

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

/**
 * @typedef {Object} VerificationResponse
 * @property {boolean} success - Whether verification was successful
 * @property {string} message - Response message
 */

/**
 * Verify merchant email with verification code
 * @param {string} email - Merchant email
 * @param {string} code - Verification code
 * @param {Function} [customFetch=defaultFetch] - Optional fetch function to use
 * @returns {Promise<VerificationResponse>} Verification response
 */
export async function verifyEmail(email, code, customFetch = defaultFetch) {
	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			return await mockMerchantService.verifyEmail(email, code);
		}

		// Real API implementation
		const fetchToUse = customFetch || defaultFetch;
		const response = await fetchToUse(`${apiConfig.apiBaseUrl}merchants/verify-email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, code })
		});

		if (!response.ok) {
			throw response;
		}

		/** @type {VerificationResponse} */
		const data = await response.json();
		return data;
	} catch (error) {
		throw await handleApiError(error);
	}
}

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

/**
 * @typedef {Object} ResendVerificationResponse
 * @property {boolean} success - Whether resend was successful
 * @property {string} message - Response message
 */

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

/**
 * @typedef {Object} SignInResponse
 * @property {boolean} success - Whether sign-in was successful
 * @property {string} merchantId - Merchant ID
 * @property {string} token - Auth token
 * @property {string} message - Response message
 */

/**
 * Sign in merchant
 * @param {string} email - Merchant email
 * @param {string} password - Merchant password
 * @param {Function} [customFetch=defaultFetch] - Optional fetch function to use
 * @returns {Promise<SignInResponse>} Sign-in response
 */
export async function signIn(email, password, customFetch = defaultFetch) {
	try {
		// Use mock service if configured to do so
		if (useMockApi()) {
			return await mockMerchantService.signIn(email, password);
		}

		// Real API implementation
		const fetchToUse = customFetch || defaultFetch;
		const response = await fetchToUse(`${apiConfig.apiBaseUrl}merchants/sign-in`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});

		if (!response.ok) {
			throw response;
		}

		/** @type {SignInResponse} */
		const data = await response.json();
		return data;
	} catch (error) {
		throw await handleApiError(error);
	}
}
