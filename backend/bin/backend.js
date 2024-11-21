#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { BackendStack } = require('../lib/backend-stack');

const app = new cdk.App();

new BackendStack(app, 'BackendStack', {});
