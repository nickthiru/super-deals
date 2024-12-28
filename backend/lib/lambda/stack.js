const { Stack } = require("aws-cdk-lib");

const DealsStack = require("./deals/stack");
const AccountsStack = require("./accounts/stack");

class LambdaStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
      db,
    } = props;

    this.deals = new DealsStack(this, "DealsStack", {
      db,
    });

    this.accounts = new AccountsStack(this, "AccountsStack", {
      auth,
    });
  };
}

module.exports = LambdaStack;