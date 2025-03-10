import { redirect } from '@sveltejs/kit';
import { auth } from '$lib/stores/auth';
import { get } from 'svelte/store';

/** @type {import('./$types').PageLoad} */
export async function load() {
  try {
    // Get auth state from the store instead of calling Amplify directly
    const authState = get(auth);
    
    if (!authState.initialized) {
      // Wait for auth to initialize if it hasn't already
      await auth.initialize();
    }
    
    if (!authState.isAuthenticated || !authState.user) {
      // User is not authenticated, redirect to public page
      return {
        userType: 'public'
      };
    }
    
    const userType = authState.user.userType || 'public';
    
    // Redirect based on user type
    if (userType === 'merchant') {
      return redirect(302, `/merchants/${authState.user.sub}`);
    }
    
    return {
      userType
    };
  } catch (error) {
    console.error('Error in page load:', error);
    return {
      userType: 'public'
    };
  }
}