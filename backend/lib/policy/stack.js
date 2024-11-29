const { Stack, CfnOutput } = require("aws-cdk-lib");
const { PolicyStore } = require("@cdklabs/cdk-verified-permissions");

const { LambdaConstruct } = require("./creation/lambda");

class PolicyStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { userPoolId, restApiId, stageName } = props;

    // Define the Policy Store integrated with Cognito User Pool and API Gateway
    this.policyStore = new PolicyStore(this, 'MyPolicyStore', {
      policyStoreName: 'MyPolicyStore',
      principalSources: [{
        cognitoUserPool: {
          userPoolId: userPoolId,
          groupAttribute: 'cognito:groups',
        }
      }],
      actionSources: [{
        apiGateway: {
          restApiId: restApiId,
          stageName: stageName
        }
      }]
    });

    // Define the Lambda function to create policies
    const policyCreationLambda = new LambdaConstruct(this, 'PolicyCreationLambda', {
      policyStore: this.policyStore,
    })

    // Create a custom resource to invoke the Lambda function for each policy
    const policies = ['merchant-policy.json', 'customer-policy.json', 'admin-policy.json'];

    policies.forEach(policyFile => {
      new CustomResource(this, `CreatePolicyCustomResource-${policyFile}`, {
        serviceToken: policyCreationLambda.function.functionArn,
        properties: {
          PolicyStoreId: this.policyStore.policyStoreId,
          PolicyFile: policyFile
        }
      });
    });

    // Outputs
    new CfnOutput(this, "PolicyStoreId", {
      value: this.policyStore.policyStoreId,
      description: "Policy Store ID",
      exportName: "PolicyStoreId"
    });
  }
}

module.exports = { PolicyStack };