import { redirect } from '@sveltejs/kit';
import { isPublicRoute } from '$lib/config/routes.js';
import { jwtDecode } from 'jwt-decode';

/** @typedef {{ sub: string, email: string, userType: string, businessName?: string }} User */

/**
 * Validate and decode JWT token
 * @param {string} token
 * @returns {User | null}
 */
function decodeToken(token) {
  try {
    /** @type {any} */
    const decoded = jwtDecode(token);
    return {
      sub: decoded.sub,
      email: decoded.email,
      userType: decoded['custom:userType'],
      ...(decoded['custom:businessName'] && { businessName: decoded['custom:businessName'] })
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
}

/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ event, request, fetch }) {
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
      throw new Error('Invalid token');
    }

    // @ts-ignore - Set user information in locals
    event.locals.user = user;
    return resolve(event);
  } catch (error) {
    console.error('Authentication error:', error);
    throw redirect(303, '/merchants/sign-in');
  }
}