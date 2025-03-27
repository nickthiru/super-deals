# Authentication Bypass for Development

## Overview

The Super Deals frontend includes a development mode that allows you to temporarily bypass all authentication and protected routes while you continue to develop the application. This feature is useful when you're working on parts of the application that would normally require authentication, but you want to focus on frontend development without dealing with authentication flows.

## How It Works

The authentication bypass is implemented through a simple configuration file (`src/lib/config/dev.js`) that controls whether authentication is enforced. When bypass is enabled:

1. All protected routes become accessible without authentication
2. A mock user is provided to the application, simulating an authenticated session
3. No redirects to sign-in pages occur
4. You can freely navigate to any page in the application

## Using Authentication Bypass

### Enabling/Disabling Bypass

To enable or disable authentication bypass, edit the `bypassAuth` flag in `src/lib/config/dev.js`:

```javascript
export const devConfig = {
  // Set to true to bypass all authentication and protected routes
  bypassAuth: true,
  
  // Mock user configuration
  mockUser: {
    sub: 'dev-user-id',
    email: 'dev@example.com',
    userType: 'merchant', // Change to 'customer' or 'admin' as needed
    businessName: 'Dev Business'
  }
};
```

### Customizing the Mock User

You can customize the mock user by editing the `mockUser` object in the same file. This allows you to test different user types and scenarios:

- Change `userType` to test different user roles ('merchant', 'customer', 'admin')
- Modify other properties to test specific user attributes

### Implementation Details

The authentication bypass works by modifying three key files:

1. **hooks.server.js**: Bypasses server-side authentication checks and provides the mock user
2. **auth.js store**: Returns the mock user during authentication initialization
3. **+page.js**: Skips authentication-based redirects

### When to Use

Use authentication bypass when:
- Developing UI components that require an authenticated user
- Working on protected pages without having to sign in repeatedly
- Building features that depend on user data being available
- Testing different user types without creating multiple accounts

### When to Disable

Disable authentication bypass when:
- Testing actual authentication flows
- Verifying authorization logic works correctly
- Preparing for production deployment

---

# Enhanced Mock Authentication Solution for Local Development

## Overview

The Super Deals application includes a sophisticated mock authentication system that simulates AWS Cognito authentication flows for local development. This system allows developers to test authentication-related features without requiring real AWS Cognito credentials, speeding up development and testing workflows.

## How It Works

The mock authentication system is implemented in `src/lib/utils/mockAuth.js` and provides a drop-in replacement for AWS Amplify authentication methods. It simulates the entire authentication flow, including:

- User registration (sign-up)
- Email verification with confirmation codes
- User sign-in with username/password
- Token generation and validation
- User session management
- Sign-out functionality

All user data is stored in the browser's localStorage, making it persistent across page reloads but isolated to your local environment.

## Key Features

1. **API Compatibility**: Implements the same interface as AWS Amplify Auth, allowing seamless switching between mock and real authentication.
2. **Persistent Storage**: Uses localStorage to maintain user accounts and sessions across browser refreshes.
3. **Complete Auth Flow**: Simulates the entire authentication process, including confirmation codes and JWT tokens.
4. **User Types**: Supports different user types (merchant/customer) with appropriate attributes.
5. **Developer UI**: Includes a convenient DevAuthPanel component for quick authentication actions during development.

## Setup and Configuration

### 1. Environment Configuration

To enable the mock authentication system, you need to set the appropriate environment variables in your `.env.local` file:

```
# Authentication settings
VITE_USE_MOCK_AUTH=true
```

When `VITE_USE_MOCK_AUTH` is set to `true` and the application is running in development mode, the mock authentication system will be used instead of real AWS Cognito.

### 2. Switching Between Mock and Real Authentication

The authentication provider (`src/lib/utils/authProvider.js`) automatically selects the appropriate authentication implementation based on your environment settings:

- In development mode with `VITE_USE_MOCK_AUTH=true`: Uses the mock authentication system
- Otherwise: Uses real AWS Cognito authentication

To use real AWS Cognito authentication, update your `.env.local` file with:

```
# Use real AWS Cognito authentication
VITE_USE_MOCK_AUTH=false

# AWS Cognito credentials
VITE_COGNITO_USER_POOL_ID=your-user-pool-id
VITE_COGNITO_USER_POOL_CLIENT_ID=your-client-id
VITE_COGNITO_IDENTITY_POOL_ID=your-identity-pool-id
```

### 3. Development Authentication Panel

When running in development mode with mock authentication enabled, a convenient authentication panel appears in the bottom-right corner of the application. This panel allows you to:

- Sign up new users
- Confirm user registration
- Sign in with existing accounts
- View current user details
- Sign out

The panel is automatically included in development mode through the `DevAuthPanel.svelte` component.

## Using the Mock Authentication System

### Creating a New User

1. Click the authentication panel icon in the bottom-right corner
2. Select the "Sign Up" tab
3. Enter an email address and password
4. Select a user type (merchant or customer)
5. For merchants, enter a business name
6. Click "Sign Up"

After signing up, you'll be prompted to enter a confirmation code. In mock mode, any 6-digit code (e.g., "123456") will work.

### Signing In

1. Click the authentication panel icon
2. Select the "Sign In" tab
3. Enter the email and password used during sign-up
4. Click "Sign In"

### Viewing User Details

Once signed in, the authentication panel will display the current user's details, including:
- Email address
- User type (merchant or customer)
- Business name (for merchants)
- User ID

### Signing Out

Click the "Sign Out" button in the authentication panel to end the current session.

## Implementation Details

### Storage Structure

The mock authentication system uses three localStorage keys:

- `mock_auth_users`: Stores all registered users
- `mock_auth_pending_confirmations`: Stores users awaiting confirmation
- `mock_auth_current_user`: Stores the currently authenticated user

### JWT Token Simulation

The system generates mock JWT tokens that mimic the structure of real Cognito tokens, including:

- Header, payload, and signature sections
- User attributes in the token payload
- Expiration and issuance timestamps
- User groups and permissions

### Type Definitions

The mock authentication system uses JSDoc comments for type annotations, ensuring proper type checking and code completion in IDEs that support TypeScript.

## Testing with Real Authentication

To test with real AWS Cognito authentication:

1. Update your `.env.local` file to set `VITE_USE_MOCK_AUTH=false`
2. Add your AWS Cognito credentials to the `.env.local` file
3. Restart the development server

The application will automatically switch to using real AWS Cognito authentication, and the development panel will be hidden.

## Troubleshooting

### Reset Mock Authentication Data

If you encounter issues with the mock authentication system, you can reset all data by clearing localStorage:

```javascript
// In browser console
localStorage.removeItem('mock_auth_users');
localStorage.removeItem('mock_auth_pending_confirmations');
localStorage.removeItem('mock_auth_current_user');
```

### Common Issues

- **"User already exists" error**: A user with the same email address is already registered. Try a different email or clear localStorage.
- **Sign-in fails**: Ensure you're using the correct email and password combination.
- **Confirmation code rejected**: Make sure you're entering a 6-digit code (any 6 digits will work in mock mode).

## Security Considerations

The mock authentication system is designed for development purposes only and should never be used in production environments. It does not provide any real security and stores sensitive information (like passwords) in plaintext in localStorage.

Components in the UI Kit ($lib/components) may have different variations e.g. default button, outline button, etc. To choose a particular variation, pass in the variation's class names via the "class" prop. Class names should be passed in a string, with each class name separated by a space character. Note: Do not include the customary "." (dot) class selector at the start of the class name.

Components may have different variations, or types. These types are created using CSS classes within the style block of the component. To be able to select a type of a component, the component exports a "type" prop. Pass the name of CSS class, for the type of component desired, through this prop.
