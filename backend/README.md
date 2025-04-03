# Welcome to your CDK JavaScript project

This is a blank project for CDK development with JavaScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app. The build step is not required when using JavaScript.

## Useful commands

* `npm run test`         perform the jest unit tests
* `npm run test:api`     run API tests against deployed endpoints
* `npx cdk deploy`       deploy this stack to your default AWS account/region
* `npx cdk diff`         compare deployed stack with current state
* `npx cdk synth`        emits the synthesized CloudFormation template

## API Testing

The project includes a comprehensive API testing framework using Supertest and Jest. This allows testing API Gateway endpoints directly.

### Running API Tests

```bash
# Run all API tests (automatically updates config from outputs.json)
npm run test:api

# Run a specific test file
npx jest tests/api/merchants/accounts/sign-up/successful.test.js
```

### Test Structure

API tests are organized to mirror the API structure:

```
tests/
├── api/                          # All API tests
│   ├── config.js                 # API testing configuration
│   ├── merchants/                # Tests for merchant endpoints
│   │   ├── accounts/             # Tests for merchant account endpoints
│   │   │   ├── sign-up/          # Tests for sign-up endpoint
│   │   │   │   ├── fixtures.js   # Test data for sign-up tests
│   │   │   │   └── successful.test.js  # Happy path tests
```

For detailed documentation on API testing, see [API Testing Guide](../docs/testing/api-testing-guide.md).
