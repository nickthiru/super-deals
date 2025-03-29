// AWS Amplify configuration for SvelteKit
import { Amplify } from 'aws-amplify';

/**
 * Configures AWS Amplify with backend resources
 * @param {Object} config - Optional configuration overrides
 */
export function configureAmplify(config = {}) {
  const amplifyConfig = {
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
        identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
        loginWith: {
          email: true
        }
      }
    },
    API: {
      REST: {
        api: {
          endpoint: import.meta.env.VITE_API_URL,
          region: 'us-east-1'
        }
      }
    },
    ...config
  };

  Amplify.configure(amplifyConfig);
}
