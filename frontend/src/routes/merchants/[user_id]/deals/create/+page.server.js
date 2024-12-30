import { fail } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';

import { getSchema } from './schema.js';
import Api from '$lib/api/_index.js';

export function load({ cookies }) {
  return {
    accessToken: cookies.get('accessToken'),
  };
}

export const actions = {
  default: async ({ request, fetch, cookies }) => {
    // Get the form data
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    // Get the idToken from the cookie and decode it
    const idToken = cookies.get('idToken');
    if (!idToken) {
      return fail(401, { errors: { auth: ['Not authenticated'] } });
    }

    // Get the schema with the current date
    const schema = getSchema();

    try {
      const decodedToken = jwtDecode(idToken);
      data.userId = decodedToken.sub; // Add userId to the form data

      // Parse and validate the form data
      const result = schema.safeParse(formData);
      console.log("result: " + JSON.stringify(result, null, 2));

      // In case of an error, return the data and errors
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        const data = Object.fromEntries(formData);
        // Remove the logo file from the data returned to the client
        delete data.logo;
        return fail(400, {
          data,
          errors,
        });
      }

      // Send the validated form data if successful
      const response = await Api.send(fetch, "deals", {
        method: "POST",
        body: formData,
      });
      console.log(`Response Status: ${response.status}`);
      console.log(`Response StatusText: ${response.statusText}`);

      const responseBody = await response.json();
      console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);

      if (response.status !== 200) {
        return fail(response.status, {
          errors: ['Failed to add deal'],
        });
      }

      // Redirect the user after successful form submission
      // return redirect(303, '/merchant/deals/add/success');
    } catch (error) {
      console.error('Error creating deal:', error);
      return fail(500, {
        errors: { server: ['An unexpected error occurred'] }
      });
    }
  }
};