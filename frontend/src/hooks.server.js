import { redirect } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
// import { csrf } from '@sveltejs/kit';

import Utils from '$lib/utils/_index.js';

import { isPublicRoute, findProtectedRoute } from '$lib/config/routes.js';

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

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event }) {
  console.error('Server error:', error, 'Stack:', error?.stack, 'Event:', event);
  return {
    message: 'An unexpected error occurred.',
    code: error?.code ?? 'UNKNOWN'
  };
}



async function handleAuth({ event, resolve }) {
  console.log('\n--- New Request ---');
  try {
    console.log('handleAuth started for path:', event.url.pathname);
    const idToken = event.cookies.get('idToken');
    console.log('ID Token:', idToken ? 'Present' : 'Not present');

    const currentPath = event.url.pathname;

    // Check if the current path matches any public route
    const publicRoute = isPublicRoute(currentPath);
    console.log('Is public route:', publicRoute);

    // Function to delete all auth-related cookies
    const deleteAuthCookies = () => {
      const cookiesToDelete = ['idToken', 'accessToken', 'refreshToken', 'username', 'expiresIn', 'tempCredentials'];
      cookiesToDelete.forEach(cookieName => {
        console.log(`Attempting to delete cookie: ${cookieName}`);
        console.log(`Before deletion, ${cookieName} value:`, event.cookies.get(cookieName));
        try {
          Utils.deleteCookie(event.cookies, cookieName);
          console.log(`After deletion attempt, ${cookieName} value:`, event.cookies.get(cookieName));
        } catch (deletionError) {
          console.error(`Error deleting cookie ${cookieName}:`, deletionError);
        }
      });

      // Double-check all cookies
      cookiesToDelete.forEach(cookieName => {
        const cookieValue = event.cookies.get(cookieName);
        console.log(`After deletion attempt, ${cookieName} is ${cookieValue ? 'still present' : 'successfully deleted'}`);
      });

      // Specific check for tempCredentials
      const tempCredentialsAfterDeletion = event.cookies.get('tempCredentials');
      console.log('tempCredentials after deletion:', tempCredentialsAfterDeletion || 'successfully deleted');
    };

    // If no idToken is present, delete all auth cookies
    if (!idToken) {
      console.log('No idToken found. Deleting all auth cookies.');
      deleteAuthCookies();
    }

    if (!idToken && !publicRoute) {
      console.log('No idToken found and not a public route. Redirecting to /public');
      return new Response(null, {
        status: 302,
        headers: { Location: '/public' }
      });
    }

    if (idToken) {
      try {
        const decodedToken = jwtDecode(idToken);
        console.log('Decoded Token:', decodedToken);

        // Server-side expiration check
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          console.log('Token expired');
          throw new Error('Token expired');
        }

        event.locals.user = {
          userId: decodedToken.sub,
          groups: decodedToken['cognito:groups'] || [],
        };
        console.log('User object:', event.locals.user);

        // Check protected routes
        const matchedProtectedRoute = findProtectedRoute(currentPath);
        if (matchedProtectedRoute) {
          console.log('Matched protected route:', matchedProtectedRoute);
          const userGroups = event.locals.user.groups;
          if (!userGroups.includes(matchedProtectedRoute.requiredGroup)) {
            console.log('User not in required group. Redirecting to:', matchedProtectedRoute.redirectPath);
            throw redirect(302, matchedProtectedRoute.redirectPath);
          }
          console.log('User authorized for protected route');
        }

      } catch (error) {
        console.error('Error processing token:', error);

        deleteAuthCookies();

        event.locals.user = null;

        // // Delete all authentication-related cookies
        // const cookiesToDelete = ['idToken', 'accessToken', 'refreshToken', 'username', 'expiresIn', 'tempCredentials'];

        // cookiesToDelete.forEach(cookieName => {
        //   console.log(`Attempting to delete cookie: ${cookieName}`);
        //   try {
        //     Utils.deleteCookie(event.cookies, cookieName);
        //     console.log(`Successfully deleted cookie: ${cookieName}`);
        //   } catch (deletionError) {
        //     console.error(`Error deleting cookie ${cookieName}:`, deletionError);
        //   }
        // });

        // // Double-check all cookies
        // cookiesToDelete.forEach(cookieName => {
        //   const cookieValue = event.cookies.get(cookieName);
        //   console.log(`After deletion attempt, ${cookieName} is ${cookieValue ? 'still present' : 'successfully deleted'}`);
        // });

        // // Specific check for tempCredentials
        // const tempCredentialsAfterDeletion = event.cookies.get('tempCredentials');
        // if (tempCredentialsAfterDeletion) {
        //   console.error('Failed to delete tempCredentials cookie. Current value:', tempCredentialsAfterDeletion);
        // } else {
        //   console.log('tempCredentials cookie successfully deleted');
        // }

        // event.locals.user = null;

        if (!publicRoute) {
          console.log('Not a public route. Redirecting to /public');
          return new Response(null, {
            status: 302,
            headers: { Location: '/public' }
          });
        }
      }
    } else {
      console.log('No idToken found');

      event.locals.user = null;

      if (!publicRoute) {
        console.log('Not a public route. Redirecting to /public');
        throw redirect(302, '/public');
      }
    }

    console.log('Calling resolve function');
    const tempCredentialsBeforeResolve = event.cookies.get('tempCredentials');
    console.log('Before resolve - tempCredentials:', tempCredentialsBeforeResolve || 'not found');
    const result = await resolve(event);
    console.log('Resolve function completed');

    return result;

  } catch (error) {
    console.error('Unhandled error in hooks:', error);
    return new Response('Internal Server Error', { status: 500 });
  } finally {
    console.log('handleAuth completed');
  }
}