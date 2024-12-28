const { Construct } = require("constructs");
const { LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");
const { Model, RequestValidator } = require("aws-cdk-lib/aws-apigateway");

const schema = require("./schema.js");

class ConfirmSignUpConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      http,
      lambda,
      accountsResource,
    } = props;

    const confirmSignUpResource = accountsResource.addResource("confirm-sign-up");

    const model = new Model(this, `Model`, {
      restApi: http.restApi,
      contentType: 'application/json',
      description: 'Validation model for confirm sign up form',
      schema,
    });

    const requestValidator = new RequestValidator(this, `RequestValidator`, {
      restApi: http.restApi,
      validateRequestBody: true,
      validateRequestParameters: false
    });

    confirmSignUpResource.addMethod("POST", new LambdaIntegration(lambda.accounts.confirmSignUp.function), {
      operationName: "ConfirmSignUp",
      requestValidator,
      requestModels: {
        'application/json': model
      },
    });
  }
}

module.exports = ConfirmSignUpConstruct;