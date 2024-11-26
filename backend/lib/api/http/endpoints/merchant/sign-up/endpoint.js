const { Construct } = require("constructs");
const { LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");
const { Model, RequestValidator } = require("aws-cdk-lib/aws-apigateway");

const { jsonSchema } = require("./schema.js");

class EndpointConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      http,
      signUp,
      lambda,
    } = props;


    const createModel = new Model(this, `CreateModel`, {
      restApi: http.restApi,
      contentType: 'application/json',
      description: 'Validation model for create deals form',
      schema: jsonSchema
    });

    const createRequestValidator = new RequestValidator(this, `CreateRequestValidator`, {
      restApi: http.restApi,
      validateRequestBody: true,
      validateRequestParameters: false
    });

    signUp.addMethod("POST", new LambdaIntegration(lambda.function), {
      requestValidator: createRequestValidator,
      requestModels: {
        'application/json': createModel
      }
    });
  }
}

module.exports = { EndpointConstruct };