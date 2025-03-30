const { Construct } = require("constructs");
const { LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");
const { Model, RequestValidator } = require("aws-cdk-lib/aws-apigateway");

const schema = require("./schema.js");

class SignUpConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { http, lambda, merchantsResource } = props;

    // Create the sign-up resource with CORS options
    const signupResource = merchantsResource.addResource(
      "signup",
      http.optionsWithCors
    );

    // Create model for request validation
    const model = new Model(this, `Model`, {
      restApi: http.restApi,
      contentType: "application/json",
      description: "Validation model for merchant sign-up form",
      schema,
    });

    // Create request validator
    const requestValidator = new RequestValidator(this, `RequestValidator`, {
      restApi: http.restApi,
      validateRequestBody: true,
      validateRequestParameters: false,
    });

    // Add POST method with Lambda integration and request validation
    signupResource.addMethod(
      "POST",
      new LambdaIntegration(lambda.merchants.account.signUp.function),
      {
        operationName: "SignUpMerchant",
        requestValidator,
        requestModels: {
          "application/json": model,
        },
      }
    );
  }
}

module.exports = SignUpConstruct;
