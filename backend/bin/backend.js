#!/usr/bin/env node

const cdk = require('aws-cdk-lib');

const BackendStack = require('../lib/backend-stack');

const app = new cdk.App();

// Define AWS account environments
// For production, you would use a different AWS account
// Currently commented out as we don't have a prod account
const devEnv = { account: '222222222222', region: 'us-east-1' };  
// const prodEnv = { account: '111111111111', region: 'us-east-1' };  

// Deploy to development environment
new BackendStack(app, 'BackendStackDev', {
  env: devEnv,
  envName: 'dev', // Environment name for URL paths
});

// Uncomment when ready to deploy to production
// new BackendStack(app, 'BackendStackProd', {
//   env: prodEnv,
//   envName: 'prod', // Environment name for URL paths
// });
