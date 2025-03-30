const { Construct } = require("constructs");

class SignUpConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { http, lambda, merchantsResource } = props;

    // Create the accounts resource but don't add auth endpoints
    // since they're now handled by Cognito/Amplify directly
    const signupResource = merchantsResource.addResource(
      "signup",
      http.optionsWithCors
    );

    signupResource.addMethod(
      "POST",
      new LambdaIntegration(lambda.merchants.account.signUp.function)
    );
  }
}

module.exports = SignUpConstruct;
