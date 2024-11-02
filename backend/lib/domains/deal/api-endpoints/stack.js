const { Stack } = require("aws-cdk-lib");
const { LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");


class ApiEndpointsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'deals/api-endpoints/stack'");

    const {
      api,
      addDealWorkflow,
    } = props;


    // /merchant
    const merchant = api.http.restApi.root.addResource("merchant", api.http.optionsWithCors);

    // /merchant/deals
    const deals = merchant.addResource("deals");

    deals.addMethod("POST", new LambdaIntegration(addDealWorkflow.lambda), {
      requestValidator: api.http.validations.deal.requestValidator,
      requestModels: {
        'application/json': api.http.validations.deal.model
      }
    });
  }
}

module.exports = { ApiEndpointsStack };