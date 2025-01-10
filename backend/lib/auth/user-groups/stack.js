const { Stack } = require("aws-cdk-lib");

const { CfnUserPoolGroup } = require("aws-cdk-lib/aws-cognito");

class UserGroupsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      userPool,
    } = props;

    new CfnUserPoolGroup(this, "CustomersGroup", {
      userPoolId: userPool.pool.userPoolId,
      groupName: "Customers",
    });

    new CfnUserPoolGroup(this, "MerchantsGroup", {
      userPoolId: userPool.pool.userPoolId,
      groupName: "Merchants",
    });

    new CfnUserPoolGroup(this, "AdminsGroup", {
      userPoolId: userPool.pool.userPoolId,
      groupName: "Admins",
    });
  }
}

module.exports = UserGroupsStack;
