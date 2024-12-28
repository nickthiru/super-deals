import { fail, redirect } from '@sveltejs/kit';

import schema from './schema.js';
import Api from '$lib/api/_index.js';

export const load = ({ cookies }) => {
  return {
    username: cookies.get('username')
  };
};

export const actions = {
  default: async ({ request, fetch }) => {
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
    const response = await Api.send(fetch, 'accounts/confirm-sign-up', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log(`Response Status: ${response.status}`);
    console.log(`Response StatusText: ${response.statusText}`);

    if (response.status !== 200) {
      return fail(response.status, {
        errors: ['Failed to confirm sign-up'],
      });
    }

    // const responseBody = await response.json();
    // console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);

    // return {
    //   success: true,
    //   message: responseBody.message,
    // };

    // Redirect to the sign-in page after successful confirmation
    throw redirect(303, `/merchants/sign-in`);
  }
};