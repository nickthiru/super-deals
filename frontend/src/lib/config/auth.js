/**
 * Authentication configuration for AWS Cognito
 * @typedef {Object} AuthConfig
 * @property {Object} Cognito - Cognito configuration
 * @property {string} Cognito.userPoolId - User pool ID
 * @property {string} Cognito.userPoolClientId - User pool client ID
 * @property {Object} Cognito.loginWith - Login configuration
 * @property {Object} Cognito.loginWith.oauth - OAuth configuration
 */

/** @type {AuthConfig} */
export const authConfig = {
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
        ],
      }
    }
  }
};
