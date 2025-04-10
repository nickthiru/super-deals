const { Construct } = require("constructs");

const SignUpConstruct = require("./sign-up/construct");

class AccountsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { http, lambda } = props;

    const accountsResource = http.restApi.root.addResource(
      "accounts",
      http.optionsWithCors
    );

    new SignUpConstruct(this, "SignUpConstruct", {
      http,
      lambda,
      accountsResource,
    });
  }
}

module.exports = AccountsConstruct;
