/**
 * Script to update environment variables from backend outputs.json
 *
 * This script reads the CDK outputs.json file and updates the .env.local file
 * with the latest values for AWS resources.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths configuration
const OUTPUTS_PATH = path.resolve(__dirname, '../../backend/outputs.json');
const ENV_TEMPLATE_PATH = path.resolve(__dirname, '../.env.example');
const ENV_LOCAL_PATH = path.resolve(__dirname, '../.env.local');

// Read the outputs.json file
try {
	console.log('Reading outputs.json file...');
	const outputsData = JSON.parse(fs.readFileSync(OUTPUTS_PATH, 'utf8'));

	// Helper function to find values in outputs.json regardless of exact key names
	function findValueInOutputs(partialStackName, propertyName) {
		// Find stack by partial name match
		const stackKey = Object.keys(outputsData).find((key) => key.includes(partialStackName));
		if (!stackKey || !outputsData[stackKey]) return null;

		// Find property directly
		if (outputsData[stackKey][propertyName]) {
			return outputsData[stackKey][propertyName];
		}

		// Search for property with partial name match
		const propKey = Object.keys(outputsData[stackKey]).find((key) => key.includes(propertyName));
		return propKey ? outputsData[stackKey][propKey] : null;
	}

	// Extract values from outputs.json using the more resilient approach
	const userPoolId = findValueInOutputs('AuthStackUserPoolStack', 'UserPoolId');
	const userPoolClientId = findValueInOutputs('AuthStackUserPoolStack', 'UserPoolClientId');
	const identityPoolId = findValueInOutputs('AuthStackIdentityPoolStack', 'IdentityPoolId');
	const apiUrl = findValueInOutputs('ApiStackHttpStack', 'RestApiUrldev');
	const s3BucketName = findValueInOutputs('StorageStack', 'S3BucketName');

// SNS/topic ARN extraction removed as it is no longer needed.

	console.log('Extracted values from outputs.json:');
	console.log(`- User Pool ID: ${userPoolId}`);
	console.log(`- User Pool Client ID: ${userPoolClientId}`);
	console.log(`- Identity Pool ID: ${identityPoolId}`);
	console.log(`- API URL: ${apiUrl}`);
	console.log(`- S3 Bucket Name: ${s3BucketName}`);


	// Read existing .env.local file or create from template
	let envContent;
	if (fs.existsSync(ENV_LOCAL_PATH)) {
		console.log('Reading existing .env.local file...');
		envContent = fs.readFileSync(ENV_LOCAL_PATH, 'utf8');
	} else if (fs.existsSync(ENV_TEMPLATE_PATH)) {
		console.log('.env.local not found, using .env.example as template...');
		envContent = fs.readFileSync(ENV_TEMPLATE_PATH, 'utf8');
	} else {
		console.log('No template found, creating basic .env.local structure...');
		envContent = `# API Configuration
      VITE_USE_MOCK_API=false
      VITE_API_BASE_URL=
      VITE_MOCK_DELAY=0
      VITE_SIMULATE_FAILURES=false
      VITE_FAILURE_PROBABILITY=0

      # Backend API URL
      VITE_API_URL=

      # Cognito User Pool Information
      VITE_USER_POOL_ID=
      VITE_USER_POOL_CLIENT_ID=
      VITE_IDENTITY_POOL_ID=

      # Amplify Hosting URL (for email verification links)
      VITE_SITE_URL=
    `;
	}

	// Update values in the .env.local content
	if (userPoolId) {
		envContent = envContent.replace(/^VITE_USER_POOL_ID=.*$/m, `VITE_USER_POOL_ID=${userPoolId}`);
	}

	if (userPoolClientId) {
		envContent = envContent.replace(
			/^VITE_USER_POOL_CLIENT_ID=.*$/m,
			`VITE_USER_POOL_CLIENT_ID=${userPoolClientId}`
		);
	}

	if (identityPoolId) {
		envContent = envContent.replace(
			/^VITE_IDENTITY_POOL_ID=.*$/m,
			`VITE_IDENTITY_POOL_ID=${identityPoolId}`
		);
	}

	if (apiUrl) {
		envContent = envContent.replace(/^VITE_API_URL=.*$/m, `VITE_API_URL=${apiUrl}`);
	}

	// Preserve the SITE_URL if it exists, otherwise use a default local URL
	if (!envContent.match(/^VITE_SITE_URL=.*$/m) || envContent.match(/^VITE_SITE_URL=\s*$/m)) {
		// Only replace if empty or not set
		envContent = envContent.replace(/^VITE_SITE_URL=.*$/m, `VITE_SITE_URL=http://localhost:5173`);
	}

// SNS/topic ARN environment variable logic removed as it is no longer needed.

	// Write updated content to .env.local
	console.log('Writing updated values to .env.local...');
	fs.writeFileSync(ENV_LOCAL_PATH, envContent);

	console.log('Environment variables successfully updated!');
} catch (error) {
	console.error('Error updating environment variables:', error);
	process.exit(1);
}
