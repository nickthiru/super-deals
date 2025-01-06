import { fail, error } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
import KSUID from "ksuid";

import backendOutputs from '$backend-outputs';
import getSchema from './schema.js';
import Api from '$lib/api/_index.js';
import Utils from '$lib/utils/_index.js';

export async function load({ cookies, locals }) {
  console.log('Load function started');
  try {
    console.log('tempCredentials at start of load:', cookies.get('tempCredentials'));

    const idToken = cookies.get('idToken');
    if (!idToken) {
      console.error('No idToken found in cookies');
      throw error(401, 'Not authenticated');
    }

    const { user } = locals;
    if (!user || !user.userId) {
      console.error('User not found in locals:', locals);
      throw error(401, 'User not found in locals');
    }
    console.log('userId in load function:', user.userId);

    let tempCredentials = cookies.get('tempCredentials');
    if (tempCredentials) {
      try {
        // tempCredentials = JSON.parse(tempCredentials);
        // console.log('Parsed tempCredentials:', tempCredentials);

        console.log('tempCredentials:', tempCredentials);

        if (tempCredentials.expiration && new Date(tempCredentials.expiration) > new Date()) {
          console.log('tempCredentials still valid');
          return {
            userId: user.userId,
            tempCredentials
          };
        } else {
          console.log('Deleting expired tempCredentials');
          Utils.deleteCookie(cookies, 'tempCredentials');
          console.log('tempCredentials after deletion:', cookies.get('tempCredentials'));
        }
      } catch (parseError) {
        console.error('Error parsing tempCredentials:', parseError);
      }
    }

    const cognitoUserPoolId = backendOutputs.BackendStackdevAuthStackUserPoolStack194876D6.UserPoolId;
    const cognitoIdentityPoolId = backendOutputs.BackendStackdevAuthStackIdentityPoolStackDD35B90A.IdentityPoolId;

    try {
      tempCredentials = await Utils.generateTempCredentials(idToken, cognitoUserPoolId, cognitoIdentityPoolId);
      console.log('Generated new tempCredentials:', tempCredentials);

      const maxAge = calculateMaxAge(tempCredentials.expiration);
      console.log('Calculated maxAge:', maxAge);

      Utils.createCookie(cookies, 'tempCredentials', tempCredentials, maxAge);
      console.log('tempCredentials cookie set');

      // Generate a unique ID for the deal
      const dealId = KSUID.randomSync(new Date()).string;

      return {
        userId: user.userId,
        tempCredentials,
        dealId,
      };
    } catch (credError) {
      console.error('Error generating temporary credentials:', credError);
      throw error(500, 'Error generating temporary credentials');
    }
  } catch (loadError) {
    console.error('Unexpected error in load function:', loadError, 'Stack:', loadError?.stack);
    throw error(500, 'An unexpected error occurred during page load');
  } finally {
    console.log('tempCredentials at end of load:', cookies.get('tempCredentials'));
    console.log('Load function completed');
  }
}

export const actions = {
  default: async ({ request, fetch, cookies }) => {
    console.log('Action function started');
    try {
      const formData = await request.formData();
      const data = Object.fromEntries(formData);
      console.log('Received form data:', data);

      const idToken = cookies.get('idToken');
      if (!idToken) {
        console.error('No idToken found in cookies');
        return fail(401, {
          errors: {
            auth: ['Not authenticated']
          }
        });
      }

      const schema = getSchema();
      console.log('Schema retrieved');

      try {
        const decodedToken = jwtDecode(idToken);
        data.userId = decodedToken.sub;
        console.log('Decoded token and added userId to form data');

        const result = schema.safeParse(formData);
        console.log("Validation result:", JSON.stringify(result, null, 2));

        if (!result.success) {
          console.error('Form validation failed:', result.error);
          const errors = result.error.flatten().fieldErrors;
          const returnData = { ...data };
          delete returnData.logo;
          return fail(400, {
            data: returnData,
            errors,
          });
        }

        console.log('Sending request to API');
        const response = await Api.send(fetch, "deals", {
          method: "POST",
          body: formData,
        });
        console.log(`Response Status: ${response.status}`);
        console.log(`Response StatusText: ${response.statusText}`);

        const responseBody = await response.json();
        console.log(`Response Body: ${JSON.stringify(responseBody, null, 2)}`);

        if (response.status !== 200) {
          console.error('API request failed:', response.status, responseBody);
          return fail(response.status, {
            errors: ['Failed to add deal'],
          });
        }

        console.log('Deal created successfully');
        // Uncomment the following line when ready to redirect
        // return redirect(303, '/merchant/deals/add/success');
      } catch (tokenError) {
        console.error('Error processing token or creating deal:', tokenError);
        return fail(500, {
          errors: { server: ['An unexpected error occurred while processing your request'] }
        });
      }
    } catch (actionError) {
      console.error('Unexpected error in action function:', actionError);
      return fail(500, {
        errors: { server: ['An unexpected error occurred'] }
      });
    } finally {
      console.log('Action function completed');
    }
  }
}

function calculateMaxAge(expirationDate) {
  const now = new Date();
  const expiration = new Date(expirationDate);
  return Math.max(0, Math.floor((expiration - now) / 1000));
}