// src/hooks.js
import { redirect } from '@sveltejs/kit';
import jwt_decode from 'jwt-decode';

export async function handle({ event, resolve }) {
  const accessToken = event.cookies.get('accessToken');

  if (accessToken) {
    try {
      const decodedToken = jwt_decode(accessToken);
      event.locals.user = {
        id: decodedToken.sub,
        type: decodedToken['custom:userType'],
        merchantId: decodedToken['custom:merchantId'],
      };
    } catch (error) {
      console.error('Invalid token:', error);
      event.cookies.delete('accessToken');
    }
  }

  const protectedRoutes = [
    /^\/merchants\/[^/]+\/.*/,  // Protect all routes under /merchants/[merchantId]/
  ];

  const user = event.locals.user;

  const isProtected = protectedRoutes.some((pattern) => pattern.test(event.url.pathname));

  if (isProtected) {
    if (!user || user.type !== 'merchant') {
      throw redirect(303, '/merchant/sign-in');
    }
  }

  return await resolve(event);
}

export async function getSession({ locals }) {
  return {
    user: locals.user
  };
}