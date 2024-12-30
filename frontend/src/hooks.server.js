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
  console.log('Access Token:', accessToken ? 'Present' : 'Not present');
  let user = null;

  if (accessToken) {
    try {
      const decodedToken = jwtDecode(accessToken);
      console.log('Decoded Token:', decodedToken);

      // Server-side expiration check
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        throw new Error('Token expired');
      }

      user = {
        userId: decodedToken.sub,
        groups: decodedToken['cognito:groups'],
      };
      console.log('User object:', user);

    } catch (error) {
      console.error('Invalid or expired token:', error);
      event.cookies.delete('accessToken', { path: '/' });
    }
  }

  if (!isPublicRoute) {
    const protectedRoutes = [
      { pattern: /^\/merchants\/([^/]+)\/?$/, requiredGroup: 'merchants', redirectPath: '/merchants/sign-in', idType: 'userId' },
      { pattern: /^\/customers\/([^/]+)\/?$/, requiredGroup: 'customers', redirectPath: '/customers/sign-in', idType: 'userId' },
      { pattern: /^\/admins\/([^/]+)\/?$/, requiredGroup: 'admins', redirectPath: '/admins/sign-in', idType: 'userId' },
    ];

    for (const { pattern, requiredGroup, redirectPath, idType } of protectedRoutes) {
      console.log('Checking route:', event.url.pathname);

      const match = event.url.pathname.match(pattern);
      if (match) {
        console.log('Matched route:', { pattern: pattern.toString(), requiredGroup, redirectPath, idType });
        console.log('User:', user);
        console.log('User groups:', user ? user.groups : 'No user');
        console.log('Required group:', requiredGroup);

        if (!user || !user.groups || !user.groups.some(group => group.toLowerCase() === requiredGroup.toLowerCase())) {
          console.log('Authorization failed: user does not have required group');
          throw redirect(303, redirectPath);
        }

        const requestedUserId = match[1]; // The captured user ID from the URL
        console.log('Requested User ID:', requestedUserId);
        console.log('User ID:', user[idType]);

        if (user[idType] !== requestedUserId) {
          console.log('Authorization failed: user ID mismatch');
          throw redirect(303, '/unauthorized');
        }

        console.log('Authorization successful');
        break; // Exit the loop if we've found a matching route
      } else {
        console.log('Route did not match');
      }
    }

    console.log('Finished checking protected routes');
  }

  // Set the user in event.locals only if we have a valid user
  if (user) {
    event.locals.user = user;
  }

  return await resolve(event);
}