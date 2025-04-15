import { redirect } from '@sveltejs/kit';

/**
 * @typedef {Object} PageServerLoadEvent
 * @property {Object} cookies - The cookies object
 * @property {function} cookies.get - Function to get a cookie value
 */

/**
 * @typedef {Object} LoadOutput
 * @property {string} email - The user's email address
 * @property {string} userType - The type of user (merchant or customer)
 */

/**
 * Load function for the verification sent page
 * @param {PageServerLoadEvent} param0 - The load event
 * @returns {LoadOutput} The data for the page
 */
export function load({ cookies }) {
	// Get the pending confirmation email from cookies
	const email = cookies.get('pendingConfirmation');
	const userType = cookies.get('pendingUserType') || 'customer';

	// If no email in cookies, redirect to sign-up
	if (!email) {
		throw redirect(303, '/');
	}

	return {
		email,
		userType
	};
}
