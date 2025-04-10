# Super Deals SvelteKit Frontend

Frontend application for Super Deals, built with SvelteKit and Svelte 5 runes.

## Features

- Merchant authentication and account management
- Deals creation and management
- Integration with AWS services (Cognito, API Gateway, S3)
- Responsive design with Tailwind CSS

## AWS Amplify Integration Guidelines

### Authentication Workflows

This application uses AWS Amplify for authentication. Here are the guidelines for implementing authentication workflows:

#### Direct Amplify APIs vs. Custom Lambda Functions

1. **Standard Auth Operations**: For standard authentication operations (sign-in, verification, password reset), use Amplify APIs directly from `+page.server.js` files:

   ```javascript
   // Example: Using Amplify directly for standard auth operations in +page.server.js
   import { signIn, confirmSignUp, resetPassword } from 'aws-amplify/auth';
   
   export const actions = {
     default: async ({ request }) => {
       const formData = await request.formData();
       const { email, password } = Object.fromEntries(formData);
       
       try {
         const signInResult = await signIn({ username: email, password });
         // Handle result...
       } catch (error) {
         // Handle error...
       }
     }
   };
   ```

2. **Custom Auth Logic**: For operations requiring custom logic (adding users to groups, custom verification), use Lambda functions through API Gateway:

   ```javascript
   // Example: Using custom Lambda for complex auth operations
   export const actions = {
     default: async ({ request, fetch }) => {
       const formData = await request.formData();
       const userData = Object.fromEntries(formData);
       
       try {
         const response = await fetch('/api/accounts/sign-up', {
           method: 'POST',
           body: JSON.stringify(userData),
           headers: { 'Content-Type': 'application/json' }
         });
         // Handle response...
       } catch (error) {
         // Handle error...
       }
     }
   };
   ```

3. **Server vs. Client**: Auth operations should generally be performed server-side in `+page.server.js` files rather than client-side in `+page.svelte` files for better security.

### User Type Handling

When working with different user types (merchants, customers, admins):

1. Pass the user type as a separate parameter rather than embedding it in the user data
2. Use route paths to determine user type where possible (e.g., `/merchants/sign-up` vs `/customers/sign-up`)
3. Store user type in cookies during multi-step processes like verification

## Development

Once you've cloned the project and installed dependencies with `npm install`, start a development server:

```bash
# Automatically updates environment variables from backend/outputs.json
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Environment Configuration

This project uses an automated script to configure environment variables from the backend CDK outputs:

```bash
# Update environment variables from backend/outputs.json
npm run update-env
```

The script reads AWS resource information (User Pool, API Gateway URL, etc.) from the CDK outputs file and updates your `.env.local` file automatically. This script runs automatically when you start development or build the application.

For more details, see the [deployment documentation](../docs/deployment/sveltekit-amplify-hosting.md).

## Building

To create a production version of your app:

```bash
# Automatically updates environment variables before building
npm run build
```

You can preview the production build with `npm run preview`.

## Deployment

This application is configured for deployment with AWS Amplify Hosting. For detailed deployment instructions, see the [deployment documentation](../docs/deployment/sveltekit-amplify-hosting.md).

## Technologies

- [SvelteKit](https://kit.svelte.dev/) - Application framework
- [Svelte 5](https://svelte.dev/) with runes for reactivity
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [AWS Amplify](https://aws.amazon.com/amplify/) - Authentication and hosting
