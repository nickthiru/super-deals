const { Construct } = require("constructs");

const SignUpConstruct = require("./sign-up/construct");

class AccountConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { http, lambda, merchantsResource } = props;

    // Create the accounts resource but don't add auth endpoints
    // since they're now handled by Cognito/Amplify directly
    const accountResource = merchantsResource.addResource(
      "account",
      http.optionsWithCors
    );

    new SignUpConstruct(this, "SignUpConstruct", {
      lambda,
      http,
      accountResource,
    });

    // Add any non-auth related account endpoints here
    // For example: profile updates, account settings, etc.
  }
}

module.exports = AccountConstruct;
