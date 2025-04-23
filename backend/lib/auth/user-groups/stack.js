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
      groupName: "customer",
      description: "Group for customer users",
    });

    new CfnUserPoolGroup(this, "MerchantsGroup", {
      userPoolId: userPool.pool.userPoolId,
      groupName: "merchant",
      description: "Group for merchant users",
    });

    new CfnUserPoolGroup(this, "AdminsGroup", {
      userPoolId: userPool.pool.userPoolId,
      groupName: "admin",
      description: "Group for admin users",
    });
  }
}

module.exports = UserGroupsStack;
