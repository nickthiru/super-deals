const { Stack } = require("aws-cdk-lib");

const { UserPoolStack } = require("./user-pool/stack");
const { IdentityPoolStack } = require("./identity-pool/stack");

class AuthStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.userPool = new UserPoolStack(this, "UserPoolStack");

    this.identityPool = new IdentityPoolStack(this, "IdentityPoolStack", {
      userPool: this.userPool,
    });
  }
}

module.exports = { AuthStack };