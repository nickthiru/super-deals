const { Construct } = require("constructs");
const { LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");
const { Model, RequestValidator } = require("aws-cdk-lib/aws-apigateway");

const schema = require("./schema.js");

class SignInConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      http,
      accountsResource,
      lambda,
    } = props;

    const signInResource = accountsResource.addResource("sign-in");

    const model = new Model(this, `Model`, {
      restApi: http.restApi,
      contentType: 'application/json',
      description: 'Validation model for sign in form',
      schema,
    });

    const requestValidator = new RequestValidator(this, `RequestValidator`, {
      restApi: http.restApi,
      validateRequestBody: true,
      validateRequestParameters: false
    });

    signInResource.addMethod("POST", new LambdaIntegration(lambda.accounts.signIn.function), {
      operationName: "SignIn",
      requestValidator,
      requestModels: {
        'application/json': model
      },
    });
  }
}

module.exports = SignInConstruct;