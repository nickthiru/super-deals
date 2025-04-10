const { Stack } = require("aws-cdk-lib");
const AccountsStack = require("./accounts/stack");

class SnsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.accounts = new AccountsStack(this, "AccountsStack", props);
  }
}

module.exports = { SnsStack };
