const { Stack } = require("aws-cdk-lib");
const SignUpConstruct = require("./sign-up/construct");

class AccountsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { auth, db } = props;

    this.signUp = new SignUpConstruct(this, "SignUpConstruct", {
      auth,
      db,
    });
  }
}

module.exports = AccountsStack;
