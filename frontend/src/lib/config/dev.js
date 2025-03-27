/**
 * Development mode configuration
 * These settings are only used during local development
 */
export const devConfig = {
  // Set to true to bypass all authentication and protected routes
  // This allows you to work on the frontend without needing to authenticate
  bypassAuth: true,
  
  // When bypassAuth is true, this user will be used as the mock authenticated user
  mockUser: {
    sub: 'dev-user-id',
    email: 'dev@example.com',
    userType: 'merchant', // Change to 'customer' or 'admin' as needed
    businessName: 'Dev Business'
  }
};
