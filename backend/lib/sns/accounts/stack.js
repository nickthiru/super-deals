const { Stack } = require("aws-cdk-lib");
const SignUpCompletedConstruct = require("./sign-up-completed/construct");

class AccountsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.signUpCompleted = new SignUpCompletedConstruct(this, "SignUpCompletedConstruct", {});
  }
}

module.exports = { AccountsStack };
