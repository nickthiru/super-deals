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
  
  // Extract values from outputs.json
  const userPoolId = outputsData.BackendStackDevAuthStackUserPoolStackD90C0FF4?.UserPoolId;
  const userPoolClientId = outputsData.BackendStackDevAuthStackUserPoolStackD90C0FF4?.UserPoolClientId;
  const identityPoolId = outputsData.BackendStackDevAuthStackIdentityPoolStack0DECD2C0?.IdentityPoolId;
  const apiUrl = outputsData.BackendStackDevApiStackHttpStackB0C9C4D3?.RestApiUrldev;
  const s3BucketName = outputsData.BackendStackDevStorageStackC0FC6599?.S3BucketName;
  
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
    envContent = envContent.replace(/^VITE_USER_POOL_CLIENT_ID=.*$/m, `VITE_USER_POOL_CLIENT_ID=${userPoolClientId}`);
  }
  
  if (identityPoolId) {
    envContent = envContent.replace(/^VITE_IDENTITY_POOL_ID=.*$/m, `VITE_IDENTITY_POOL_ID=${identityPoolId}`);
  }
  
  if (apiUrl) {
    envContent = envContent.replace(/^VITE_API_URL=.*$/m, `VITE_API_URL=${apiUrl}`);
  }
  
  // Preserve the SITE_URL if it exists, otherwise use a default local URL
  if (!envContent.match(/^VITE_SITE_URL=.*$/m) || envContent.match(/^VITE_SITE_URL=\s*$/m)) {
    // Only replace if empty or not set
    envContent = envContent.replace(/^VITE_SITE_URL=.*$/m, `VITE_SITE_URL=http://localhost:5173`);
  }
  
  // Write updated content to .env.local
  console.log('Writing updated values to .env.local...');
  fs.writeFileSync(ENV_LOCAL_PATH, envContent);
  
  console.log('Environment variables successfully updated!');
} catch (error) {
  console.error('Error updating environment variables:', error);
  process.exit(1);
}
