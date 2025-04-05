// Server-side AWS Amplify configuration for SvelteKit
import { configureAmplify } from '$lib/config/amplify';

// Configure Amplify for server-side operations
// This ensures all server actions and server-side load functions have access to configured Amplify
configureAmplify();

/**
 * Server-side load function for root layout
 * This runs on the server for all routes
 */
export const load = async () => {
  // Any server-side data needed globally can be returned here
  return {};
};
