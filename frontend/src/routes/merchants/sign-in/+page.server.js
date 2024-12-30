import { fail, redirect } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';

import schema from './schema.js';
import Api from '$lib/api/_index.js';

export const actions = {
  default: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log('Received Form Data:', data); // Log the form data

    // Validate form data
    const validationResult = schema.safeParse(data);

    if (!validationResult.success) {
      return fail(400, {
        errors: validationResult.error.flatten().fieldErrors
      });
    }

    // Send the validated form data if successful
    const response = await Api.send(fetch, 'accounts/sign-in', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    console.log(`Response Status: ${response.status}`);
    console.log(`Response StatusText: ${response.statusText}`);

    if (response.status !== 200) {
      return fail(response.status, {
        errors: ['Failed to sign-in merchant'],
      });
    }

    const responseBody = await response.json();
    console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);

    if (responseBody) {
      console.log('Attempting to set tokens in cookie');

      cookies.set('accessToken', responseBody.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      console.log('AccessToken cookie set:', cookies.get('accessToken'));

      cookies.set('idToken', responseBody.idToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      console.log('idToken cookie set:', cookies.get('idToken'));

      cookies.set('refreshToken', responseBody.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      cookies.set('expiresIn', responseBody.expiresIn, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      // Decode the access token to get the sub (user ID)
      const decodedToken = jwtDecode(responseBody.idToken);
      const userId = decodedToken.sub;

      // Redirect to the merchant's dashboard using the userId from the token
      console.log(`Redirecting to: /merchants/${userId}`);
      throw redirect(303, `/merchants/${userId}`);
    }

    // If we reach here, something went wrong
    return fail(500, {
      errors: ['An unexpected error occurred during sign-in'],
    });
  }
};