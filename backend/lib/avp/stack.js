const { Stack, CfnOutput } = require("aws-cdk-lib");
const { PolicyStore, IdentitySource, ValidationSettingsMode } = require("@cdklabs/cdk-verified-permissions");
const path = require("path");


// const { LambdaConstruct } = require("./create/lambda");

class AvpStack extends Stack {
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
          userPool: auth.userPool.pool,
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

module.exports = { AvpStack };