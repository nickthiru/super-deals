import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import * as merchantService from '$lib/services/api/merchantService';
import { ERROR_CODES } from '$lib/utils/errorHandling';
import { verificationCodeSchema, resendCodeSchema } from './schema.js';

/**
 * @typedef {Object} ApiError
 * @property {string} message - Error message
 * @property {string} [code] - Error code
 */

/** @type {import('./$types').PageServerLoad} */
export function load({ cookies, url }) {
	// Get email from query params or cookies
	const email = url.searchParams.get('email') || cookies.get('pendingConfirmation') || '';
	const userType = url.searchParams.get('userType') || cookies.get('pendingUserType') || 'merchant';

	return {
		email,
		userType
	};
}

/** @type {import('./$types').Actions} */
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
				error: Object.values(errors)[0]?.[0] || 'Please enter a valid verification code'
			};
		}

		const { email, code1, code2, code3, code4, code5, code6 } = result.data;
		const verificationCode = code1 + code2 + code3 + code4 + code5 + code6;

		if (dev) {
			console.log('Server-side verification for:', email);
			console.log('Verification code:', verificationCode);
		}

		try {
			// Call verification service
			const result = await merchantService.verifyEmail(email, verificationCode);

			if (dev) {
				console.log('Verification successful:', result);
			}

			// Clear cookies
			cookies.delete('pendingConfirmation', { path: '/' });
			cookies.delete('pendingUserType', { path: '/' });
			cookies.delete('devVerificationCode', { path: '/' });

			// Redirect to sign-in page
			// throw redirect(303, `/${userType}s/sign-in?verified=true`);
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
				error: errorMessage
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
				error: Object.values(errors)[0]?.[0] || 'Please provide a valid email address'
			};
		}

		const { email } = result.data;

		try {
			const result = await merchantService.resendVerificationCode(email);

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
				message: 'A new verification code has been sent to your email'
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
				error: errorMessage
			};
		}
	}
};
