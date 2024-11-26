const { Construct } = require("constructs");
const { CreateConstruct } = require("./create/construct");

class DealsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      // auth,
      storage,
      db,
      http,
      merchant,
    } = props;


    const deals = merchant.addResource("deals");

    new CreateConstruct(this, "CreateConstruct", {
      // auth,
      storage,
      db,
      http,
      deals,
    });

    // new DeleteEndpointConstruct(this, "DeleteDealEndpointConstruct", {
    //   lambda,
    //   deals,
    // });
  }
}

module.exports = { DealsConstruct };