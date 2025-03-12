const { Stack } = require("aws-cdk-lib");

const UserPoolStack = require("./user-pool/stack");
const IdentityPoolStack = require("./identity-pool/stack");
const UserGroupsStack = require("./user-groups/stack");

class AuthStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { envName } = props;

    this.userPool = new UserPoolStack(this, `UserPoolStack`, {
      envName,
    });

    this.identityPool = new IdentityPoolStack(this, `IdentityPoolStack`, {
      userPool: this.userPool,
    });

    new UserGroupsStack(this, `UserGroupsStack`, {
      userPool: this.userPool,
    });
  }
}

module.exports = AuthStack;
