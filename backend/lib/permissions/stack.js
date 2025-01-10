/* Original AVP implementation
const { Stack, CfnOutput } = require("aws-cdk-lib");
const { PolicyStore, IdentitySource, ValidationSettingsMode } = require("@cdklabs/cdk-verified-permissions");
const path = require("path");

class PermissionsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
      api,
    } = props;

    const validationSettingsStrict = {
      mode: ValidationSettingsMode.STRICT,
    };

    const cedarJsonSchema = PolicyStore.schemaFromRestApi(
      api.http.restApi,
      "UserGroup",
    );
    const cedarSchema = {
      cedarJson: JSON.stringify(cedarJsonSchema),
    };

    // Define the Policy Store integrated with Cognito User Pool and API Gateway
    const policyStore = new PolicyStore(this, 'MyPolicyStore', {
      schema: cedarSchema,
      validationSettings: validationSettingsStrict,
      description: "Policy store with schema generated from RestApi construct",
    });

    new IdentitySource(this, 'IdentitySource', {
      configuration: {
        cognitoUserPoolConfiguration: {
          userPool: auth.dev.userPool.pool,
          groupConfiguration: {
            groupEntityType: "UserGroup",
          },
        },
      },
      principalEntityType: "UserGroup",
      policyStore,
    });

    policyStore.addPoliciesFromPath(path.join(__dirname, "./policies"));
  }
}
*/

// Current implementation
const { Stack } = require("aws-cdk-lib");
const { PolicyStatement, Effect } = require("aws-cdk-lib/aws-iam");
const OAuthPermissionsConstruct = require("./oauth-permissions/construct");

/**
 * @typedef {Object} PermissionsStackProps
 * @property {import('../iam/roles/stack').RolesStack} iam - IAM roles stack
 * @property {import('../storage/stack').StorageStack} storage - Storage stack
 * @property {import('aws-cdk-lib/aws-cognito').IUserPoolResourceServer} dealsResourceServer - Deals Resource Server
 */

/**
 * Stack for managing identity-based permissions
 * Handles attaching policies to roles for accessing various resources
 */
class PermissionsStack extends Stack {
  /** @type {OAuthPermissionsConstruct} */
  oauth;

  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      iam,
      storage,
      dealsResourceServer,
    } = props;

    // OAuth permissions integrated with existing UserPool
    this.oauth = new OAuthPermissionsConstruct(this, 'OAuthPermissions', {
      dealsResourceServer,
    });

    // Create S3 access policy for merchants
    const merchantS3Policy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        's3:PutObject',
      ],
      resources: [
        `${storage.s3Bucket.bucketArn}/merchants/*`
      ],
    });

    // Attach the policy only to the merchant role
    iam.roles.merchant.addToPolicy(merchantS3Policy);

    // Future permissions can be added here
    // For example:
    // - DynamoDB permissions
    // - SES permissions for email sending
    // - SNS permissions for notifications
    // etc.
  }
}

module.exports = PermissionsStack;