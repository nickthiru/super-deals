const { Stack } = require("aws-cdk-lib");
const AccountsStack = require("./accounts/stack");
// const WelcomeConstruct = require("./accounts/welcome/construct");
// const PasswordResetConstruct = require("./accounts/password-reset/construct");

class EmailTemplatesStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.accounts = new AccountsStack(this, "AccountsStack", props);

    // this.accounts.welcome = new WelcomeConstruct(this, "WelcomeConstruct", {});

    // this.accounts.passwordReset = new PasswordResetConstruct(
    //   this,
    //   "PasswordResetConstruct",
    //   {}
    // );
  }
}

module.exports = EmailTemplatesStack;
