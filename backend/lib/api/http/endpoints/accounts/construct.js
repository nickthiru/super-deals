const { Construct } = require("constructs");

const SignUpConstruct = require("./sign-up/construct");
const ConfirmSignUpConstruct = require("./confirm-sign-up/construct");
const SignInConstruct = require("./sign-in/construct");

class AccountsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      http,
      lambda,
    } = props;

    const accountsResource = http.restApi.root.addResource("accounts", http.optionsWithCors);

    new SignUpConstruct(this, "SignUpConstruct", {
      http,
      lambda,
      accountsResource,
    });

    new ConfirmSignUpConstruct(this, "ConfirmSignUpConstruct", {
      http,
      lambda,
      accountsResource,
    });

    new SignInConstruct(this, "SignInConstruct", {
      http,
      lambda,
      accountsResource,
    });
  }
}

module.exports = AccountsConstruct;