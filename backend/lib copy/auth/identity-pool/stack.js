const { Stack, CfnOutput } = require("aws-cdk-lib");
const { CfnIdentityPool } = require("aws-cdk-lib/aws-cognito");


class IdentityPoolStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      stage,
      userPool,
      userPoolClient,
    } = props;

    this.pool = new CfnIdentityPool(this, `IdentityPool-${stage}`, {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [{
        clientId: userPoolClient.userPoolClientId,
        providerName: userPool.userPoolProviderName,
      }],
    });

    /*** Outputs ***/

    // For web client Auth service
    new CfnOutput(this, `IdentityPoolId-${stage}`, {
      value: this.pool.ref,
      description: "Identity Pool ID",
      exportName: `IdentityPoolId${stage}`
    });
  }
}

module.exports = { IdentityPoolStack };