const { Construct } = require("constructs");
const { LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");
const { Model, RequestValidator } = require("aws-cdk-lib/aws-apigateway");

const schema = require("./schema.js");

class SignUpConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      http,
      lambda,
      accountsResource,
    } = props;

    const signUpResource = accountsResource.addResource("sign-up");

    const model = new Model(this, `Model`, {
      restApi: http.restApi,
      contentType: 'application/json',
      description: 'Validation model for sign up form',
      schema,
    });

    const requestValidator = new RequestValidator(this, `RequestValidator`, {
      restApi: http.restApi,
      validateRequestBody: true,
      validateRequestParameters: false
    });

    signUpResource.addMethod("POST", new LambdaIntegration(lambda.accounts.signUp.function), {
      operationName: "SignUp",
      requestValidator,
      requestModels: {
        'application/json': model
      },
    });
  }
}

module.exports = SignUpConstruct;