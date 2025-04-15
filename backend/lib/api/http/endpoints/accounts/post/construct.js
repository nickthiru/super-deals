const { Construct } = require("constructs");
const { LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");
const {
  Model,
  RequestValidator,
  GatewayResponse,
  ResponseType,
} = require("aws-cdk-lib/aws-apigateway");

const merchantSchema = require("./schemas/merchant.js");
// const customerSchema = require("./schemas/customer.js");

class PostConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { http, services, accountsResource } = props;

    // // Create models for request validation
    // const model = new Model(this, `Model`, {
    //   restApi: http.restApi,
    //   contentType: "application/json",
    //   description: "Accounts_SignUp",
    //   schema: merchantSchema,
    // });

    // // const customerModel = new Model(this, `CustomerModel`, {
    // //   restApi: http.restApi,
    // //   contentType: "application/json",
    // //   description: "Accounts_SignUp",
    // //   schema: customerSchema,
    // // });

    // // Create request validator
    // const requestValidator = new RequestValidator(this, `RequestValidator`, {
    //   restApi: http.restApi,
    //   validateRequestBody: true,
    //   validateRequestParameters: false,
    // });

    // // Add custom gateway response for validation errors
    // new GatewayResponse(this, "ValidationErrorResponse", {
    //   restApi: http.restApi,
    //   type: ResponseType.BAD_REQUEST_BODY,
    //   statusCode: "400",
    //   responseHeaders: {
    //     "Access-Control-Allow-Origin": "'*'",
    //     "Access-Control-Allow-Headers": "'*'",
    //   },
    //   templates: {
    //     "application/json": `{
    //       "error": "Validation error",
    //       "message": $context.error.messageString,
    //       "details": $context.error.validationErrorString,
    //       "stage": "$context.stage",
    //       "resourcePath": "$context.resourcePath"
    //     }`,
    //   },
    // });

    // // Add POST method with Lambda integration and request validation
    // accountsResource.addMethod(
    //   "POST",
    //   new LambdaIntegration(services.accounts.signUp.function),
    //   {
    //     operationName: "Accounts_SignUp",
    //     requestValidator,
    //     requestModels: {
    //       "application/json": model,
    //     },
    //   }
    // );

    this.createModelsForRequestValidation(http);
    this.createRequestValidator(http);
    this.addCustomGatewayResponseForValidationErrors(http);
    this.addPostMethodWithLambdaIntegrationAndRequestValidation(
      http,
      services,
      accountsResource
    );
  }

  createModelsForRequestValidation(http) {
    this.merchantModel = new Model(this, `MerchantModel`, {
      restApi: http.restApi,
      contentType: "application/json",
      description: "Accounts_SignUp",
      schema: merchantSchema,
    });

    // const customerModel = new Model(this, `CustomerModel`, {
    //   restApi: http.restApi,
    //   contentType: "application/json",
    //   description: "Accounts_SignUp",
    //   schema: customerSchema,
    // });
  }

  createRequestValidator(http) {
    this.requestValidator = new RequestValidator(this, `RequestValidator`, {
      restApi: http.restApi,
      validateRequestBody: true,
      validateRequestParameters: false,
    });
  }

  addCustomGatewayResponseForValidationErrors(http) {
    this.validationErrorResponse = new GatewayResponse(
      this,
      "ValidationErrorResponse",
      {
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
      }
    );
  }

  addPostMethodWithLambdaIntegrationAndRequestValidation(
    services,
    accountsResource
  ) {
    accountsResource.addMethod(
      "POST",
      new LambdaIntegration(services.accounts.signUp.function),
      {
        operationName: "Accounts_SignUp",
        requestValidator: this.requestValidator,
        requestModels: {
          "application/json": this.merchantModel,
          // "application/json": this.customerModel,
        },
      }
    );
  }
}

module.exports = PostConstruct;
