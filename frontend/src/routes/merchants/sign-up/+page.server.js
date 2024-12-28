import { fail, redirect } from '@sveltejs/kit';

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
    const response = await Api.send(fetch, 'accounts/sign-up', {
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

    // After successful sign-up
    cookies.set('username', responseBody.username, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'prod',
      maxAge: 60 * 5 // 5 minutes, just enough time to complete confirmation
    });

    return redirect(303, '/merchants/post-sign-up');
  }
};