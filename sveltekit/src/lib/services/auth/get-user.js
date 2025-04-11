/**
 * @typedef {any} UserProfile Generic user profile for any user type
 */

import { useMockApi } from '$lib/config/api';
import * as mockMerchantService from '$lib/services/mock/merchantService';
import { handleApiError } from '$lib/utils/errorHandling';

// Default to global fetch if no fetch function is provided
const defaultFetch = globalThis.fetch;

/**
 * Get user details by ID
 * @param {string} userType - User type (merchant, customer, admin)
 * @param {string} userId - User ID
 * @param {Function} [customFetch=defaultFetch] - Optional fetch function to use
 * @returns {Promise<UserProfile>} User details
 */
export default async function getUser(userType, userId, customFetch = defaultFetch) {
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
