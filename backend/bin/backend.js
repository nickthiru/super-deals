#!/usr/bin/env node

const cdk = require('aws-cdk-lib');

const BackendStack = require('../lib/backend-stack');

const app = new cdk.App();

const stages = ['dev'];

stages.forEach(stage => {
  new BackendStack(app, `BackendStack-${stage}`, {
    stage,
  });
});
