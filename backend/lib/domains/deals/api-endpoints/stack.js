const { Stack } = require("aws-cdk-lib");
const { LambdaIntegration, Model, RequestValidator } = require("aws-cdk-lib/aws-apigateway");
const { jsonSchema } = require("#schemas/deal.schema.js");


class ApiEndpointsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'deals/api-endpoints/stack'");

    const {
      apiStack,
      addDealWorkflowConstruct,
    } = props;


    // /merchant
    const merchant = apiStack.http.restApi.root.addResource("merchant", apiStack.http.optionsWithCors);

    // /merchant/deals
    const deals = merchant.addResource("deals");

    const dealModel = new Model(this, 'DealModel', {
      restApi: apiStack.http.restApi,
      contentType: 'application/json',
      description: 'Validation model for deals',
      schema: jsonSchema
    });

    const dealRequestValidator = new RequestValidator(this, 'DealRequestValidator', {
      restApi: apiStack.http.restApi,
      validateRequestBody: true,
      validateRequestParameters: false
    });

    deals.addMethod("POST", new LambdaIntegration(addDealWorkflowConstruct.lambda), {
      requestValidator: dealRequestValidator,
      requestModels: {
        'application/json': dealModel
      }
    });

  }
}

module.exports = { ApiEndpointsStack };