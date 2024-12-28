import { fail, redirect } from '@sveltejs/kit';

import schema from './schema.js';
import Api from '$lib/api/_index.js';

export const actions = {
  default: async ({ request, fetch, cookies, event }) => {
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
    const response = await Api.send(fetch, 'accounts/sign-in', event, {
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
        errors: ['Failed to sign-up merchant'],
      });
    }

    const responseBody = await response.json();
    console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);

    // Set the access token as a secure HTTP-only cookie
    if (responseBody.accessToken) {
      cookies.set('accessToken', responseBody.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      cookies.set('merchantId', responseBody.merchantId, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

    redirect(303, `/merchants/${responseBody.merchantId}`);
  }
};