import { fail, redirect } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';

import schema from './schema.js';
import Api from '$lib/api/_index.js';
import Utils from '$lib/utils/_index.js';

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

    const {
      accessToken,
      idToken,
      refreshToken,
      expiresIn
    } = responseBody;

    if (responseBody) {
      console.log('Attempting to set tokens in cookie');

      const maxAge = (60 * 60 * 24 * 7);  // 1 week

      Utils.createCookie(cookies, "accessToken", accessToken, maxAge);
      // cookies.set('accessToken', responseBody.accessToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'strict',
      //   path: '/',
      //   maxAge: 60 * 60 * 24 * 7, // 1 week
      // });
      console.log('AccessToken cookie set:', cookies.get('accessToken'));

      Utils.createCookie(cookies, "idToken", idToken, maxAge);
      // cookies.set('idToken', responseBody.idToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'strict',
      //   path: '/',
      //   maxAge: 60 * 60 * 24 * 7, // 1 week
      // });
      console.log('idToken cookie set:', cookies.get('idToken'));

      Utils.createCookie(cookies, "refreshToken", refreshToken, maxAge);
      // cookies.set('refreshToken', responseBody.refreshToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'strict',
      //   path: '/',
      //   maxAge: 60 * 60 * 24 * 7, // 1 week
      // });
      console.log('refreshToken cookie set:', cookies.get('refreshToken'));

      Utils.createCookie(cookies, "expiresIn", expiresIn, maxAge);
      // cookies.set('expiresIn', responseBody.expiresIn, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'strict',
      //   path: '/',
      //   maxAge: 60 * 60 * 24 * 7, // 1 week
      // });
      console.log('expiresIn cookie set:', cookies.get('expiresIn'));

      // Decode the access token to get the sub (user ID)
      const decodedToken = jwtDecode(idToken);
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