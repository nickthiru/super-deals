/**
 * @typedef {Object} VerificationResponse
 * @property {boolean} success - Whether verification was successful
 * @property {boolean} isSignUpComplete - Whether sign-up process is complete
 * @property {string} message - Verification message
 * @property {string} [userType] - Type of user being verified
 */

import { useMockApi } from '$lib/config/api';
import * as mockMerchantService from '$lib/services/mock/merchantService';
import { handleApiError } from '$lib/utils/errorHandling';
import { confirmSignUp } from 'aws-amplify/auth';

/**
 * Verify user email with verification code
 * @param {string} userType - User type (merchant, customer, admin)
 * @param {string} email - User email
 * @param {string} code - Verification code
 * @returns {Promise<VerificationResponse>} Verification response with isSignUpComplete flag
 */
export default async function verifyEmail(userType, email, code) {
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
