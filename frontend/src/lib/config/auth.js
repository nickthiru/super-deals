/**
 * Authentication configuration for AWS Cognito
 * @type {import('@aws-amplify/auth').AuthConfig}
 */
export const authConfig = {
  Cognito: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
    loginWith: {
      oauth: {
        domain: import.meta.env.VITE_COGNITO_DOMAIN,
        scopes: ['openid', 'email', 'profile', 'deals/read', 'deals/write', 'deals/delete'],
        responseType: 'code',
        redirectSignIn: ['http://localhost:5173'],
        redirectSignOut: ['http://localhost:5173'],
      }
    }
  }
};
