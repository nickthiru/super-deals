import { fail } from '@sveltejs/kit';
import { getSchema } from './schema.js';

import API from '$lib/api/_index.js';


export const actions = {
  default: async ({ request, fetch }) => {
    // Get the form data
    const formData = await request.formData();

    // Get the schema with the current date
    const schema = getSchema();

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

    // Handle the validated form data if successful
    const response = await API.send(fetch, 'merchant/deals', {
      method: "POST",
      body: formData
    });

    console.log(`Backend Response: ${JSON.stringify(response, null, 2)}`);

    if (response.statusCode !== 200) {
      return fail(response.statusCode, {
        errors: ['Failed to add deal'],
      });
    }

    // Redirect the user after successful form submission
    // return redirect(303, '/merchant/deals/add/success');
  }
};