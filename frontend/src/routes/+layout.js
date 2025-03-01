import { Amplify } from 'aws-amplify';

/**
 * Initialize AWS Amplify configuration
 */
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN,
          scopes: ['openid', 'email', 'profile', 'deals/read', 'deals/write', 'deals/delete'],
          responseType: 'code',
          redirectSignIn: [
            'http://localhost:5173',
            'http://localhost:5173/merchants/sign-in',
            'http://localhost:5173/merchants/dashboard'
          ],
          redirectSignOut: [
            'http://localhost:5173',
            'http://localhost:5173/merchants/sign-in'
          ]
        }
      }
    }
  }
}, {
  ssr: false
});

export const ssr = false;
