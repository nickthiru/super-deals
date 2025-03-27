import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import * as merchantService from '$lib/services/api/merchantService';
import { signInSchema } from './schema.js';

/**
 * @typedef {Object} SignInResult
 * @property {string} merchantId - Merchant ID
 * @property {string} [token] - Authentication token
 */

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  // Check if we're coming from a successful verification
  const verified = url.searchParams.get('verified') === 'true';
  
  return {
    verified
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  /**
   * Default form action for merchant sign-in
   */
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    
    // Validate form data using Zod schema
    const result = signInSchema.safeParse(formData);
    
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return { 
        success: false, 
        error: Object.values(errors)[0]?.[0] || 'Invalid form data',
        errors
      };
    }
    
    const { email, password, rememberMe } = result.data;
    
    try {
      // Call merchant service to sign in
      const result = await merchantService.signIn(email, password);
      
      // Set authentication cookies/tokens
      if (result && result.merchantId) {
        // In a real app, you would set secure HTTP-only cookies for auth tokens
        cookies.set('authToken', result.token || 'mock-token', {
          path: '/',
          httpOnly: true,
          secure: !dev,
          maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined, // 30 days if remember me is checked
          sameSite: 'strict'
        });
        
        // Redirect to merchant dashboard
        return redirect(303, `/merchants/${result.merchantId}`);
      }
      
      // If we get here without a redirect, something went wrong
      return {
        success: false,
        error: 'Authentication failed. Please check your credentials.'
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
        // This is our redirect, pass it through
        return error;
      }
      
      console.error('Sign-in error:', error);
      
      // Handle error message safely
      let errorMessage = 'Failed to sign in. Please check your credentials.';
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }
};
