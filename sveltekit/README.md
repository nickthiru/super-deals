# Super Deals SvelteKit Frontend

Frontend application for Super Deals, built with SvelteKit and Svelte 5 runes.

## Features

- Merchant authentication and account management
- Deals creation and management
- Integration with AWS services (Cognito, API Gateway, S3)
- Responsive design with Tailwind CSS

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
