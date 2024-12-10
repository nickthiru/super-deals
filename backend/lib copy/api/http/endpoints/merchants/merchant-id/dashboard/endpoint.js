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


    const model = new Model(this, `Model`, {
      restApi: http.restApi,
      contentType: 'application/json',
      description: 'Validation model for create deals form',
      schema: jsonSchema
    });

    const requestValidator = new RequestValidator(this, `RequestValidator`, {
      restApi: http.restApi,
      validateRequestBody: true,
      validateRequestParameters: false
    });

    signUp.addMethod("POST", new LambdaIntegration(lambda.function), {
      requestValidator,
      requestModels: {
        'application/json': model
      }
    });
  }
}

module.exports = { EndpointConstruct };