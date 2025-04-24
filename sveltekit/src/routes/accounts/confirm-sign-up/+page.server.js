import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import * as accountsService from '$lib/services/accounts.svelte.js';
import { ERROR_CODES } from '$lib/utils/errorHandling';
import { verificationCodeSchema, resendCodeSchema } from './schema.js';

/**
 * @typedef {Object} VerificationResult
 * @property {boolean} success - Whether the verification was successful
 * @property {boolean} isSignUpComplete - Whether the sign-up process is complete
 * @property {string} message - A message describing the result
 * @property {string} userType - The type of user being verified
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message - Error message
 * @property {string} [code] - Error code
 */

/** @type {import('./$types.js').PageServerLoad} */
export function load({ cookies, url }) {
	// Get email from query params or cookies
	const email = url.searchParams.get('email') || cookies.get('pendingConfirmation') || '';
	const userType = url.searchParams.get('userType') || cookies.get('pendingUserType') || 'merchant';

	return {
		email,
		userType
	};
}

/** @type {import('./$types.js').Actions} */
export const actions = {
	/**
	 * Default form action for verifying email
	 */
	verify: async ({ request, cookies }) => {
		const formData = await request.formData();

		// Validate form data using Zod schema
		const result = verificationCodeSchema.safeParse(formData);

		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			return {
				success: false,
				error: Object.values(errors)[0]?.[0] || 'Please enter a valid verification code',
				type: 'verify'
			};
		}

		const { email, code1, code2, code3, code4, code5, code6 } = result.data;
		const verificationCode = code1 + code2 + code3 + code4 + code5 + code6;

		if (dev) {
			console.log('Server-side verification for:', email);
			console.log('Verification code:', verificationCode);
		}

		try {
			// Get user type from cookies or default to merchant
			const userType = cookies.get('pendingUserType') || 'merchant';

			// Call verification service
			const result = await accountsService.confirmUserSignUp(email, verificationCode, userType);
			
			// Check if the result has the expected properties
			const isSignUpComplete = typeof result === 'object' && result !== null && 'isSignUpComplete' in result 
				? result.isSignUpComplete 
				: false;

			if (dev) {
				console.log('Verification successful:', result);
			}

			// Clear cookies
			cookies.delete('pendingConfirmation', { path: '/' });
			cookies.delete('pendingUserType', { path: '/' });
			cookies.delete('devVerificationCode', { path: '/' });

			// Check if sign-up is complete
			if (isSignUpComplete) {
				// Redirect to sign-up-completed page
				throw redirect(303, `/accounts/sign-up-completed?userType=${userType}`);
			} else {
				// Something went wrong, but verification was processed
				return {
					email,
					error:
						'Verification was processed, but sign-up could not be completed. Please contact support.',
					type: 'verify'
				};
			}
		} catch (error) {
			if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
				// This is our redirect, pass it through
				throw error;
			}

			// Handle API errors
			if (dev) {
				console.error('Verification error:', error);
			}

			let errorMessage = 'Failed to verify email. Please try again.';

			// Extract error message if available
			if (error && typeof error === 'object') {
				if ('message' in error && typeof error.message === 'string') {
					errorMessage = error.message;
				} else if ('code' in error && typeof error.code === 'string') {
					// Handle specific error codes
					switch (error.code) {
						case 'CodeMismatchException':
							errorMessage = 'The verification code is incorrect. Please check and try again.';
							break;
						case 'ExpiredCodeException':
							errorMessage = 'The verification code has expired. Please request a new code.';
							break;
						case 'LimitExceededException':
							errorMessage = 'Too many attempts. Please try again later.';
							break;
						default:
							errorMessage = `Verification failed: ${error.code}`;
					}
				}
			}

			if (error && typeof error === 'object') {
				const apiError = /** @type {ApiError} */ (error);

				if ('code' in apiError) {
					if (apiError.code === ERROR_CODES.EMAIL_NOT_FOUND) {
						errorMessage = 'No verification pending for this email. Please sign up first.';
					} else if (apiError.code === ERROR_CODES.INVALID_CODE) {
						errorMessage = 'Invalid verification code. Please try again.';
					}
				}

				if ('message' in apiError && typeof apiError.message === 'string') {
					errorMessage = apiError.message;
				}
			}

			return {
				success: false,
				error: errorMessage,
				type: 'resend'
			};
		}
	},

	/**
	 * Form action for resending verification code
	 */
	resendCode: async ({ request, cookies }) => {
		const formData = await request.formData();

		// Validate form data using Zod schema
		const result = resendCodeSchema.safeParse(formData);

		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			return {
				success: false,
				error: Object.values(errors)[0]?.[0] || 'Please provide a valid email address',
				type: 'resend'
			};
		}

		const { email } = result.data;

		try {
			// Get user type from cookies or default to merchant
			const userType = cookies.get('pendingUserType') || 'merchant';

			const result = await accountsService.resendVerificationCode(userType, email);

			if (dev) {
				console.log('Resend successful:', result);

				// In development mode, we might want to store the verification code
				// for easier testing
				if (result && typeof result === 'object' && 'mockCode' in result) {
					const mockCode = String(result.mockCode);
					cookies.set('devVerificationCode', mockCode, { path: '/' });
				}
			}

			return {
				success: true,
				message: 'A new verification code has been sent to your email',
				type: 'resend'
			};
		} catch (error) {
			if (dev) {
				console.error('Resend error:', error);
			}

			let errorMessage = 'Failed to resend verification code. Please try again.';

			if (error && typeof error === 'object') {
				const apiError = /** @type {ApiError} */ (error);

				if ('code' in apiError && apiError.code === ERROR_CODES.EMAIL_NOT_FOUND) {
					errorMessage = 'Email not found. Please sign up first.';
				} else if ('message' in apiError && typeof apiError.message === 'string') {
					errorMessage = apiError.message;
				}
			}

			return {
				success: false,
				error: errorMessage,
				type: 'resend'
			};
		}
	}
};
