const { Stack, CfnOutput } = require("aws-cdk-lib");
const { CfnIdentityPool } = require("aws-cdk-lib/aws-cognito");

class IdentityPoolStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      userPool,
    } = props;

    this.pool = new CfnIdentityPool(this, `IdentityPool`, {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [{
        clientId: userPool.poolClient.userPoolClientId,
        providerName: userPool.pool.userPoolProviderName,
      }],
    });

    /*** Outputs ***/

    // For web client Auth service
    new CfnOutput(this, `IdentityPoolId`, {
      value: this.pool.ref,
      description: "Identity Pool ID",
      exportName: `IdentityPoolId`
    });
  }
}

module.exports = IdentityPoolStack;