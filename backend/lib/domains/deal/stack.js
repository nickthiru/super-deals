const { Stack } = require("aws-cdk-lib");
const { ApiEndpointsStack } = require("./api-endpoints/stack");
const { AddDealWorkflowContruct } = require("./workflows/add-deal/construct");


class DealServiceStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'DealsServiceStack'");

    const {
      storage,
      db,
      api,
    } = props;


    /*** Workflows ***/

    const addDealWorkflow = new AddDealWorkflowContruct(this, "AddDealWorkflowContruct", {
      storage,
      db,
    });



    /*** API Endpoints */

    new ApiEndpointsStack(this, "ApiEndpointsStack", {
      api,
      addDealWorkflow,
    });
  }
}

module.exports = { DealServiceStack };