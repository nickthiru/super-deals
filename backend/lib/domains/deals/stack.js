const { Stack } = require("aws-cdk-lib");
const { ApiEndpointsStack } = require("./api-endpoints/stack");
const { AddDealWorkflowContruct } = require("./workflows/add-deal/construct");


class DealsServiceStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'DealsServiceStack'");

    const {
      storageStack,
      dbStack,
      apiStack,
      // sharedResourcesStack
    } = props;


    /*** Workflows ***/

    const addDealWorkflowConstruct = new AddDealWorkflowContruct(this, "AddDealWorkflowContruct", {
      storageStack,
      dbStack,
    });



    /*** API Endpoints */

    new ApiEndpointsStack(this, "ApiEndpointsStack", {
      apiStack,
      // sharedResourcesStack,
      addDealWorkflowConstruct,
    });
  }
}

module.exports = { DealsServiceStack };