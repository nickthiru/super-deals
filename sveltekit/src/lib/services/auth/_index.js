/**
 * Accounts Service
 * Handles all account-related operations for different user types (merchants, customers, admins)
 * Functional implementation
 */

import signUp from './sign-up.js';
import signIn from './sign-in.js';
import getUser from './get-user.js';
import resendVerificationCode from './resend-verification.js';
import verifyEmail from './verify-email.js';

// Export as a single object for use in page.server.js as AuthService
const AuthService = {
	signUp,
	signIn,
	getUser,
	resendVerificationCode,
	verifyEmail
};

export default AuthService;
