const { Stack, CfnOutput, Duration } = require("aws-cdk-lib");
const { UserPool, VerificationEmailStyle, AccountRecovery, CfnUserPoolGroup, UserPoolOperation, StringAttribute } = require("aws-cdk-lib/aws-cognito");
const { LambdaConstruct } = require("./pre-sign-up/lambda");

const { UserPoolStack } = require("./user-pool/stack");


class AuthStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { stage } = props;

    this.userPool = new UserPoolStack(this, `UserPoolStack-${stage}`, {
      stage,
    });

    this.identityPool = new IdentityPoolStack(this, `IdentityPoolStack-${stage}`, {
      stage,
      userPool: this.userPool.userPool,
      userPoolClient: this.userPool.userPoolClient,
    });
  }
}

module.exports = { AuthStack };