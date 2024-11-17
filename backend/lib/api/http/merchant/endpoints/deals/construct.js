// const { Stack } = require("aws-cdk-lib");
const { Construct } = require("constructs");
const { LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");
const { Model, RequestValidator } = require("aws-cdk-lib/aws-apigateway");
const { jsonSchema } = require("#schemas/deals/create-deal/schema.js");

class DealsEndpointsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'DealsEndpointsConstruct'");

    const {
      lambda,
      http,
    } = props;

    // /deals
    const deals = http.restApi.root.addResource("deals", http.optionsWithCors);

    // POST

    const createDeal_Model = new Model(this, 'CreateDeal_Model', {
      restApi: http.restApi,
      contentType: 'application/json',
      description: 'Validation model for create deals form',
      schema: jsonSchema
    });

    const createDeal_RequestValidator = new RequestValidator(this, 'CreateDeal_RequestValidator', {
      restApi: http.restApi,
      validateRequestBody: true,
      validateRequestParameters: false
    });

    deals.addMethod("POST", new LambdaIntegration(lambda.deals.createDeal.function), {
      requestValidator: createDeal_RequestValidator,
      requestModels: {
        'application/json': createDeal_Model
      }
    });
  }
}

module.exports = { DealsEndpointsConstruct };