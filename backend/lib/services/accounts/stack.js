const { Stack } = require("aws-cdk-lib");
const SignUpConstruct = require("./sign-up/construct");
const SendWelcomeEmailConstruct = require("./send-welcome-email/construct");

class AccountsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { auth, db, sns, email } = props;

    this.signUp = new SignUpConstruct(this, "SignUpConstruct", {
      auth,
    });

    this.sendWelcomeEmail = new SendWelcomeEmailConstruct(
      this,
      "SendWelcomeEmailConstruct",
      {
        sns,
        email,
      }
    );
  }
}

module.exports = AccountsStack;
