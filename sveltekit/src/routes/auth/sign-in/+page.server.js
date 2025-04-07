import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import * as merchantService from '$lib/services/api/merchantService';
import { ERROR_CODES } from '$lib/utils/errorHandling';
import { signInSchema, forgotPasswordSchema } from './schema.js';

/**
 * @typedef {Object} ApiError
 * @property {string} message - Error message
 * @property {string} [code] - Error code
 */

/** @type {import('./$types').PageServerLoad} */
export function load({ url, cookies }) {
	// Check if the user was redirected from email verification
	const verified = url.searchParams.get('verified') === 'true';

	// Get user type from query params or cookies
	const userType = url.searchParams.get('userType') || cookies.get('userType') || 'merchant';

	// Store user type in cookies for persistence
	if (userType) {
		cookies.set('userType', userType, { path: '/' });
	}

	return {
		verified,
		userType
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	/**
	 * Default form action for signing in
	 */
	signIn: async ({ request, cookies }) => {
		const formData = await request.formData();

		// Validate form data using Zod schema
		const result = signInSchema.safeParse(formData);

		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			return {
				success: false,
				error: Object.values(errors)[0]?.[0] || 'Please check your input'
			};
		}

		const { email, password, userType } = result.data;

		if (dev) {
			console.log('Server-side sign-in for:', email);
		}

		try {
			// Call sign-in service
			const signInResult = await merchantService.signIn(email, password);

			if (dev) {
				console.log('Sign-in successful:', signInResult);
			}

			// Store user type in cookies
			cookies.set('userType', userType, { path: '/' });

			// Redirect to merchant dashboard
			if (userType === 'merchant') {
				throw redirect(303, `/merchants/${signInResult.merchantId}`);
			} else {
				// For other user types
				throw redirect(303, '/');
			}
		} catch (error) {
			if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
				// This is our redirect, pass it through
				throw error;
			}

			// Handle API errors
			if (dev) {
				console.error('Sign-in error:', error);
			}

			let errorMessage = 'Failed to sign in. Please check your credentials and try again.';

			if (error && typeof error === 'object') {
				const apiError = /** @type {ApiError} */ (error);

				if ('code' in apiError) {
					if (apiError.code === ERROR_CODES.USER_NOT_FOUND) {
						errorMessage = 'Account not found. Please check your email or sign up.';
					} else if (apiError.code === ERROR_CODES.INCORRECT_PASSWORD) {
						errorMessage = 'Incorrect password. Please try again.';
					} else if (apiError.code === ERROR_CODES.USER_NOT_CONFIRMED) {
						errorMessage = 'Email not verified. Please check your email for a verification link.';
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
	 * Form action for forgot password
	 */
	forgotPassword: async ({ request }) => {
		const formData = await request.formData();

		// Validate form data using Zod schema
		const result = forgotPasswordSchema.safeParse(formData);

		if (!result.success) {
			const errors = result.error.flatten().fieldErrors;
			return {
				success: false,
				error: Object.values(errors)[0]?.[0] || 'Please provide a valid email address'
			};
		}

		// We'll use these variables in the future implementation
		// const { email, userType } = result.data;

		try {
			// Call forgot password service (to be implemented)
			// const result = await merchantService.forgotPassword(email);

			// For now, return a success message
			return {
				success: true,
				message: 'If an account exists with this email, a password reset link will be sent.'
			};
		} catch (error) {
			if (dev) {
				console.error('Forgot password error:', error);
			}

			// Always return a generic message for security
			return {
				success: true,
				message: 'If an account exists with this email, a password reset link will be sent.'
			};
		}
	}
};
