import { redirect } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
import { isPublicRoute } from '$lib/config/routes.js';

/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ event, request, fetch }) {
  // Forward the Authorization header from the client if present
  const authHeader = event.request.headers.get('Authorization');
  if (authHeader) {
    request.headers.set('Authorization', authHeader);
  }
  return fetch(request);
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event }) {
  console.error('Server error:', error, 'Stack:', error?.stack, 'Event:', event);
  return {
    message: 'An unexpected error occurred.',
    code: error?.code ?? 'UNKNOWN'
  };
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const currentPath = event.url.pathname;
  
  // Check if the current path matches any public route
  if (isPublicRoute(currentPath)) {
    return resolve(event);
  }

  // Get the Authorization header which should contain the Amplify session token
  const authHeader = event.request.headers.get('Authorization');
  
  if (!authHeader) {
    throw redirect(303, '/merchants/sign-in');
  }

  try {
    // Decode the JWT token
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwtDecode(token);

    // Set user information in locals for use in routes
    event.locals.user = {
      sub: decoded.sub,
      email: decoded.email,
      groups: decoded['cognito:groups'] || [],
      userType: decoded['custom:userType'],
      ...(decoded['custom:businessName'] && { businessName: decoded['custom:businessName'] })
    };

    return resolve(event);
  } catch (error) {
    console.error('Token validation error:', error);
    throw redirect(303, '/merchants/sign-in');
  }
}