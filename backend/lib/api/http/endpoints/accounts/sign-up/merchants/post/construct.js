const { Construct } = require("constructs");
const { LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");
const {
  Model,
  RequestValidator,
  GatewayResponse,
  ResponseType,
} = require("aws-cdk-lib/aws-apigateway");

const schema = require("./schema.js");

class PostConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { http, services, merchantsResource } = props;

    // Create model for request validation
    const model = new Model(this, `Model`, {
      restApi: http.restApi,
      contentType: "application/json",
      description: "Accounts_SignUp",
      schema,
    });

    // Create request validator
    const requestValidator = new RequestValidator(this, `RequestValidator`, {
      restApi: http.restApi,
      validateRequestBody: true,
      validateRequestParameters: false,
    });

    // Add custom gateway response for validation errors
    new GatewayResponse(this, "ValidationErrorResponse", {
      restApi: http.restApi,
      type: ResponseType.BAD_REQUEST_BODY,
      statusCode: "400",
      responseHeaders: {
        "Access-Control-Allow-Origin": "'*'",
        "Access-Control-Allow-Headers": "'*'",
      },
      templates: {
        "application/json": `{
          "error": "Validation error",
          "message": $context.error.messageString,
          "details": $context.error.validationErrorString,
          "stage": "$context.stage",
          "resourcePath": "$context.resourcePath"
        }`,
      },
    });

    // Add POST method with Lambda integration and request validation
    merchantsResource.addMethod(
      "POST",
      new LambdaIntegration(services.accounts.signUp.lambda),
      {
        operationName: "Accounts_SignUp",
        requestValidator,
        requestModels: {
          "application/json": model,
        },
      }
    );
  }
}

module.exports = PostConstruct;
