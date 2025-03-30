const { Stack } = require("aws-cdk-lib");

const DealsStack = require("./merchants/deals/stack");
const AccountStack = require("./merchants/account/stack");

class MerchantsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { auth, db } = props;

    this.deals = new DealsStack(this, "DealsStack", {
      db,
    });

    this.account = new AccountStack(this, "AccountsStack", {
      auth,
    });
  }
}

module.exports = MerchantsStack;
