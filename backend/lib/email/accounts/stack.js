const { Stack } = require("aws-cdk-lib");
const PasswordResetConstruct = require("./password-reset/construct");
const WelcomeConstruct = require("./welcome/construct");

class AccountsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.welcome = new WelcomeConstruct(this, "WelcomeConstruct", {});

    this.passwordReset = new PasswordResetConstruct(
      this,
      "PasswordResetConstruct",
      {}
    );
  }
}

module.exports = AccountsStack;
