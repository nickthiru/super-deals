// AWS Amplify configuration for SvelteKit
import { configureAmplify } from '$lib/config/amplify';
import { browser } from '$app/environment';

/**
 * Load function for root layout
 * Configures AWS Amplify on the client side
 */
export const load = async () => {
  // Only run on browser, not during SSR
  if (browser) {
    configureAmplify();
  }
  
  return {};
};
