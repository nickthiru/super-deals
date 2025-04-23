/**
 * @typedef {import('@super-deals/types').ResendVerificationResponse} ResendVerificationResponse
 */

import { useMockApi } from '$lib/config/api';
import * as mockMerchantService from '$lib/services/mock/merchantService';
import { handleApiError } from '$lib/utils/errorHandling';

// Default to global fetch if no fetch function is provided
const defaultFetch = globalThis.fetch;

/**
 * Resend verification code to user email
 * @param {string} userType - User type (merchant, customer, admin)
 * @param {string} email - User email
 * @param {Function} [customFetch=defaultFetch] - Optional fetch function to use
 * @returns {Promise<ResendVerificationResponse>} Resend response
 */
export default async function resendVerificationCode(userType, email, customFetch = defaultFetch) {
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
