const { Stack } = require("aws-cdk-lib");
const { LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");


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

    deals.addMethod("POST", new LambdaIntegration(addDealWorkflowConstruct.lambda), apiStack.http.optionsWithAuth);

  }
}

module.exports = { ApiEndpointsStack };