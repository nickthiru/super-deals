const { Stack } = require("aws-cdk-lib");
const AccountsStack = require("./accounts/stack");

class ServicesStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { envName, auth, db, sns, email } = props;

    this.accounts = new AccountsStack(this, "AccountsStack", {
      auth,
      db,
      sns,
      email,
    });
  }
}

module.exports = ServicesStack;
