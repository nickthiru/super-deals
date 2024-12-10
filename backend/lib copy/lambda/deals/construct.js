const { Construct } = require("constructs");
const { CreateConstruct } = require("./create/construct");

class DealsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      storage,
      db,
      http,
      merchantIdResource,
    } = props;


    const dealsResource = merchantIdResource.addResource("deals");

    new CreateConstruct(this, "CreateConstruct", {
      storage,
      db,
      http,
      dealsResource,
    });

    // new DeleteEndpointConstruct(this, "DeleteDealEndpointConstruct", {
    //   lambda,
    //   dealsResource,
    // });
  }
}

module.exports = { DealsConstruct };