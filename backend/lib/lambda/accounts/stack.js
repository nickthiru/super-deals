const { Stack } = require("aws-cdk-lib");

const SignUpConstruct = require("./sign-up/construct");
const ConfirmSignUpConstruct = require("./confirm-sign-up/construct");
const SignInConstruct = require("./sign-in/construct");

class AccountsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
    } = props;

    this.signUp = new SignUpConstruct(this, "SignUpConstruct", {
      auth,
    });

    this.confirmSignUp = new ConfirmSignUpConstruct(this, "ConfrimSignUpConstruct", {
      auth,
    });

    this.signIn = new SignInConstruct(this, "SignInConstruct", {
      auth,
    });
  }
}

module.exports = AccountsStack;