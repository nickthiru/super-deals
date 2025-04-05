// AWS Amplify configuration for SvelteKit
import { Amplify } from 'aws-amplify';

// Track if Amplify has been configured
let isConfigured = false;

/**
 * Configures AWS Amplify with backend resources
 * @param {Object} config - Optional configuration overrides
 */
export function configureAmplify(config = {}) {
  // Skip if already configured to prevent duplicate configuration
  if (isConfigured) return;
  
  // Get environment variables with fallbacks for server-side rendering
  const userPoolId = import.meta.env?.VITE_USER_POOL_ID || process.env.VITE_USER_POOL_ID;
  const userPoolClientId = import.meta.env?.VITE_USER_POOL_CLIENT_ID || process.env.VITE_USER_POOL_CLIENT_ID;
  const identityPoolId = import.meta.env?.VITE_IDENTITY_POOL_ID || process.env.VITE_IDENTITY_POOL_ID;
  const apiUrl = import.meta.env?.VITE_API_URL || process.env.VITE_API_URL;
  
  // Ensure required values are available
  if (!userPoolId || !userPoolClientId) {
    console.error('Amplify configuration error: Missing required Auth configuration');
    console.error('User Pool ID:', userPoolId);
    console.error('User Pool Client ID:', userPoolClientId);
    return;
  }
  
  const amplifyConfig = {
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        identityPoolId,
        loginWith: {
          email: true
        }
      }
    },
    API: {
      REST: {
        api: {
          endpoint: apiUrl,
          region: 'us-east-1'
        }
      }
    },
    ...config
  };

  // Configure Amplify
  Amplify.configure(amplifyConfig);
  isConfigured = true;
  
  console.log('AWS Amplify configured successfully');
  return amplifyConfig;
}
