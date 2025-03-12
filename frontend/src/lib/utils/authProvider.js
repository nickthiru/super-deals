/**
 * Authentication Provider
 * Conditionally uses either real AWS Cognito or mock authentication
 * based on environment settings
 */

import { dev } from '$app/environment';
import * as realAuth from 'aws-amplify/auth';
import mockAuth from './mockAuth';

// Check if we should use mock auth in development
const useMockAuth = dev && import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// Export the appropriate auth implementation
export const signUp = useMockAuth ? mockAuth.signUp : realAuth.signUp;
export const confirmSignUp = useMockAuth ? mockAuth.confirmSignUp : realAuth.confirmSignUp;
export const resendSignUpCode = useMockAuth ? mockAuth.resendSignUpCode : realAuth.resendSignUpCode;
export const signIn = useMockAuth ? mockAuth.signIn : realAuth.signIn;
export const signInWithRedirect = useMockAuth ? mockAuth.signInWithRedirect : realAuth.signInWithRedirect;
export const signOut = useMockAuth ? mockAuth.signOut : realAuth.signOut;
export const getCurrentUser = useMockAuth ? mockAuth.getCurrentUser : realAuth.getCurrentUser;
export const fetchAuthSession = useMockAuth ? mockAuth.fetchAuthSession : realAuth.fetchAuthSession;

// For debugging
if (useMockAuth) {
  console.log('🔧 Using MOCK authentication for development');
} else {
  console.log('🔒 Using REAL AWS Cognito authentication');
}
