// import { redirect } from '@sveltejs/kit';
// import { dev } from '$app/environment';
// import { devConfig } from '$lib/config/dev.js';

/** @type {import('./$types').PageLoad} */
export function load() {
  // AUTHENTICATION CODE COMMENTED OUT FOR SIMPLIFICATION
  /*
  // In development mode with auth bypass enabled, redirect to the merchant's dashboard
  if (dev && devConfig.bypassAuth) {
    // Only redirect if we're on the exact /merchants path
    if (url.pathname === '/merchants') {
      return redirect(302, `/merchants/${devConfig.mockUser.sub}`);
    }
    
    // Otherwise, just return without redirecting
    return {};
  }
  
  // In production, this would handle normal authentication flow
  */
  
  // Simple return for now
  return {};
}

export const ssr = false;
