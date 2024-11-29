// frontend/src/routes/merchant/sign-up/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import schema from './schema.js';
import Api from '$lib/api/_index.js';

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    // Validate form data
    const validationResult = schema.safeParse(data);

    if (!validationResult.success) {
      return fail(400, {
        errors: validationResult.error.flatten().fieldErrors
      });
    }

    // Send the validated form data if successful
    const response = await Api.send(fetch, 'merchant/sign-up', {
      method: "POST",
      body: formData
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

    // Redirect to merchant dashboard after successful sign-up
    throw redirect(303, `/merchants/${responseBody.merchantId}/dashboard`);
  }
};