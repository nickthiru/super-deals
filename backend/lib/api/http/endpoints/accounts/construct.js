const { Construct } = require("constructs");

class AccountsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      http,
      lambda,
    } = props;

    // Create the accounts resource but don't add auth endpoints
    // since they're now handled by Cognito/Amplify directly
    const accountsResource = http.restApi.root.addResource("accounts", http.optionsWithCors);

    // Add any non-auth related account endpoints here
    // For example: profile updates, account settings, etc.
  }
}

module.exports = AccountsConstruct;