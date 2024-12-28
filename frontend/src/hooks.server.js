import { redirect } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
// import { csrf } from '@sveltejs/kit';

// export const handle = csrf(handleAuth); // Use the csrf middleware when it's time to deploy to AWS
export const handle = handleAuth;

/** @type {import('@sveltejs/kit').HandleFetch} */
export async function handleFetch({ event, request, fetch }) {
  const accessToken = event.cookies.get('accessToken');
  if (accessToken) {
    request.headers.set('Authorization', accessToken);
  }
  return fetch(request);
}

export async function getSession({ locals }) {
  return {
    user: locals.user
  };
}



async function handleAuth({ event, resolve }) {

  const publicRoutes = [
    /^\/public\/?$/,
    /^\/merchants\/sign-up\/?$/,
    /^\/merchants\/sign-in\/?$/,
    /^\/merchants\/confirm-sign-up\/?$/,
    /^\/customers\/sign-up\/?$/,
    /^\/customers\/sign-in\/?$/,
    /^\/customers\/confirm-sign-up\/?$/,
    /^\/admins\/sign-in\/?$/,
  ];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => route.test(event.url.pathname));

  const accessToken = event.cookies.get('accessToken');
  let user = null;

  if (accessToken) {
    try {
      const decodedToken = jwtDecode(accessToken);

      // Server-side expiration check
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        throw new Error('Token expired');
      }

      user = {
        id: decodedToken.sub,
        groups: decodedToken['cognito:groups'],
        merchantId: decodedToken['custom:merchantId'],
      };

    } catch (error) {
      console.error('Invalid or expired token:', error);
      event.cookies.delete('accessToken', { path: '/' });
    }
  }

  if (!isPublicRoute) {
    const protectedRoutes = [
      { pattern: /^\/merchants\/([^/]+)\/.*/, requiredGroup: 'merchant', redirectPath: '/merchants/sign-in', idType: 'merchantId' },
      { pattern: /^\/customers\/([^/]+)\/.*/, requiredGroup: 'customer', redirectPath: '/customers/sign-in', idType: 'customerId' },
      { pattern: /^\/admins\/([^/]+)\/.*/, requiredGroup: 'admin', redirectPath: '/admins/sign-in', idType: 'adminId' },
    ];

    for (const { pattern, requiredGroup, redirectPath, idType } of protectedRoutes) {
      const match = event.url.pathname.match(pattern);
      if (match) {
        if (!user || !user.groups || !user.groups.includes(requiredGroup)) {
          throw redirect(303, redirectPath);
        }

        const requestedUserId = match[1]; // The captured user ID from the URL
        if (user[idType] !== requestedUserId) {
          // User is trying to access a resource that doesn't belong to them
          throw redirect(303, '/unauthorized');
        }

        break; // Exit the loop if we've found a matching route
      }
    }
  }

  // Set the user in event.locals only if we have a valid user
  if (user) {
    event.locals.user = user;
  }

  return await resolve(event);
}