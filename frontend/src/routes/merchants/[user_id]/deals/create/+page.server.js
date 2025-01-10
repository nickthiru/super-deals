import { fail, error } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
import KSUID from "ksuid";
import { fetchAuthSession } from 'aws-amplify/auth';
import { S3Client } from "@aws-sdk/client-s3";

import backendOutputs from '$backend-outputs';
import getSchema from './schema.js';
import Api from '$lib/api/_index.js';
import Utils from '$lib/utils/_index.js';

/**
 * Server-side load function for the deal creation page
 * Validates user authentication, authorization, and prepares necessary credentials
 * @param {{ cookies: Object, locals: { user?: { userId?: string }, session?: Object } }} params
 * @returns {Promise<{ userId: string, credentials: Object, dealId?: string }>}
 */
export async function load({ cookies, locals }) {
  console.log('Load function started');
  try {
    const idToken = cookies.get('idToken');
    if (!idToken) {
      console.error('No idToken found in cookies');
      throw error(401, 'Not authenticated');
    }

    const { user, session } = locals;
    if (!user || !user.userId) {
      console.error('User not found in locals:', locals);
      throw error(401, 'User not found in locals');
    }
    console.log('userId in load function:', user.userId);

    // Check if user has merchant permissions and can write deals
    if (!Utils.auth.isMerchant(session) || !Utils.auth.canWriteDeals(session)) {
      console.error('User lacks merchant or deal write permissions:', user.userId);
      throw error(403, 'Insufficient permissions to create deals');
    }

    try {
      // Get credentials from Amplify
      const { credentials } = await fetchAuthSession();
      if (!credentials) {
        throw new Error('Failed to get AWS credentials');
      }

      // Generate a unique ID for the deal
      const dealId = KSUID.randomSync(new Date()).string;

      return {
        userId: user.userId,
        credentials,
        dealId,
        s3BucketName: backendOutputs.BackendStackdevStorageStack55F9793E.S3BucketName
      };
    } catch (credError) {
      console.error('Error getting AWS credentials:', credError);
      throw error(500, 'Error getting AWS credentials');
    }
  } catch (loadError) {
    console.error('Unexpected error in load function:', loadError, 'Stack:', loadError?.stack);
    throw error(500, 'An unexpected error occurred during page load');
  }
}

export const actions = {
  /**
   * @param {{ request: Request, fetch: Function, cookies: Object, locals: { session?: Object } }} params
   * @returns {Promise<void>}
   */
  default: async ({ request, fetch, cookies, locals }) => {
    console.log('Action function started');
    try {
      const { session } = locals;

      // Verify merchant permissions and scopes
      if (!Utils.auth.isMerchant(session) || !Utils.auth.canWriteDeals(session)) {
        return fail(403, { error: 'Insufficient permissions to create deals' });
      }

      const formData = await request.formData();
      const idToken = cookies.get('idToken');
      if (!idToken) {
        console.error('No idToken found in cookies');
        return fail(401, {
          errors: {
            auth: ['Not authenticated']
          }
        });
      }

      try {
        const decodedToken = jwtDecode(idToken);
        formData.set('userId', decodedToken.sub);
        console.log('Added userId to form data');

        const schema = getSchema();
        console.log('Schema retrieved');

        const result = schema.safeParse(formData);
        console.log("Validation result:", JSON.stringify(result, null, 2));

        if (!result.success) {
          console.error('Form validation failed:', result.error);
          const errors = result.error.flatten().fieldErrors;
          return fail(400, {
            data: Object.fromEntries(formData),
            errors,
          });
        }

        console.log('Sending request to API');
        const response = await Api.send(fetch, "deals", {
          method: "POST",
          body: JSON.stringify(Object.fromEntries(formData)),
          headers: {
            'Content-Type': 'application/json'
          },
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