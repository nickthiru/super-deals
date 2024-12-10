const { Stack } = require("aws-cdk-lib");
const { RolesStack } = require("./roles/stack");


class IamStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
    } = props;

    new RolesStack(this, "RolesStack", {
      auth,
    });
  }
}

module.exports = { IamStack };