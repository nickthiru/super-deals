const { Stack } = require("aws-cdk-lib");

const UserPoolStack = require("./user-pool/stack");
const IdentityPoolStack = require("./identity-pool/stack");
const RolesStack = require("./roles/stack");
const UserGroupsStack = require("./user-groups/stack");

class AuthStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      stage,
      storage,
    } = props;

    this.userPool = new UserPoolStack(this, `UserPoolStack`, {
      stage,
    });

    this.identityPool = new IdentityPoolStack(this, `IdentityPoolStack`, {
      userPool: this.userPool,
    });

    const roles = new RolesStack(this, `RolesStack`, {
      storage,
      userPool: this.userPool,
      identityPool: this.identityPool,
    });

    new UserGroupsStack(this, `UserGroupsStack`, {
      userPool: this.userPool,
      roles,
    });
  }
}

module.exports = AuthStack;
