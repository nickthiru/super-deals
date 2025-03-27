// import { redirect } from '@sveltejs/kit';
// import { auth } from '$lib/stores/auth';
// import { get } from 'svelte/store';
import { dev } from '$app/environment';
import { devConfig } from '$lib/config/dev.js';

/** @type {import('./$types').PageLoad} */
export async function load() {
  // AUTHENTICATION CODE COMMENTED OUT FOR SIMPLIFICATION
  /*
  try {
    // In development mode with auth bypass enabled, skip redirects
    if (dev && devConfig.bypassAuth) {
      // Check if we're already on the merchant page to avoid redirect loops
      if (url.pathname === `/merchants/${devConfig.mockUser.sub}`) {
        return {
          userType: devConfig.mockUser.userType
        };
      }
      
      // Only redirect if we're on the root page
      if (url.pathname === '/') {
        return redirect(302, `/merchants/${devConfig.mockUser.sub}`);
      }
      
      return {
        userType: devConfig.mockUser.userType
      };
    }
    
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
  */
  
  // Simple mock user for development
  if (dev) {
    return {
      userType: devConfig.mockUser.userType
    };
  }
  
  return {
    userType: 'public'
  };
}