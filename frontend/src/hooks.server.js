// import { redirect } from '@sveltejs/kit';
// import { isPublicRoute } from '$lib/config/routes.js';
// import { jwtDecode } from 'jwt-decode';
import { dev } from '$app/environment';
import { devConfig } from '$lib/config/dev.js';

/**
 * Validate and decode JWT token
 * This function is currently unused but preserved for future reference
 * @param {string} token
 * @returns {Object | null}
 */
// function decodeToken(token) {
//   try {
//     /** @type {any} */
//     const decoded = jwtDecode(token);
//     return {
//       sub: decoded.sub,
//       email: decoded.email,
//       userType: decoded['custom:userType'],
//       ...(decoded['custom:businessName'] && { businessName: decoded['custom:businessName'] })
//     };
//   } catch (error) {
//     console.error('Token validation error:', error);
//     return null;
//   }
// }

/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ event, request, fetch }) {
  const authHeader = event.request.headers.get('Authorization');
  if (authHeader) {
    request.headers.set('Authorization', authHeader);
  }
  return fetch(request);
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error }) {
  console.error('Server error:', error);
  return {
    message: 'An unexpected error occurred.',
    ...(error instanceof Error && 'code' in error ? { code: error.code } : {})
  };
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // AUTHENTICATION CODE COMMENTED OUT FOR SIMPLIFICATION
  /*
  const currentPath = event.url.pathname;

  // Check if we're in development mode with auth bypass enabled
  if (dev && devConfig.bypassAuth) {
    // Set mock user in locals for development
    // @ts-ignore - Set user information in locals
    event.locals.user = devConfig.mockUser;
    return resolve(event);
  }

  if (isPublicRoute(currentPath)) {
    return resolve(event);
  }

  const authHeader = event.request.headers.get('Authorization');

  if (!authHeader) {
    throw redirect(303, '/merchants/sign-in');
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const user = decodeToken(token);

    if (!user) {
      throw redirect(303, '/merchants/sign-in');
    }

    // @ts-ignore - Set user information in locals
    event.locals.user = user;
  } catch (error) {
    console.error('Authentication error:', error);
    throw redirect(303, '/merchants/sign-in');
  }
  */

  // Always set mock user in development mode for simplicity
  if (dev) {
    // @ts-ignore - Set user information in locals
    event.locals.user = devConfig.mockUser;
  }

  return resolve(event);
}