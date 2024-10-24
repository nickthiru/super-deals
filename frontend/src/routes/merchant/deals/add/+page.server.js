// frontend/src/routes/merchant/deals/add/+page.server.js
import { fail, redirect } from '@sveltejs/kit';
import dealSchema from './deal.schema.js';
import { BackendStackApiStackHttpStackA5B3EBBB } from "$backend/outputs.json";

const { RestApiEndpoint0551178A: BaseUrl } = BackendStackApiStackHttpStackA5B3EBBB;

export const actions = {
  default: async ({ request, fetch }) => {
    // Get the form data
    const formData = await request.formData();

    // Parse and validate the form data
    const result = dealSchema.safeParse(formData);

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

    // Handle the validated form data if successful (e.g., save the deal, call an API, etc.)
    const response = await fetch(`${BaseUrl}` + 'merchant/deals', {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      return fail(response.status, {
        errors: ['Failed to add deal'],
      });
    }

    // Redirect the user after successful form submission
    return redirect(303, '/merchant/deals/add/success');
  }
};