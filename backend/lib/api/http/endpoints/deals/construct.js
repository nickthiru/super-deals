const { Construct } = require("constructs");
const { CreateConstruct } = require("./create/construct");

class DealsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      lambda,
      http,
    } = props;


    const deals = http.restApi.root.addResource("deals", http.optionsWithCors);

    new CreateConstruct(this, "CreateConstruct", {
      lambda,
      http,
      deals,
    });

    // new DeleteEndpointConstruct(this, "DeleteDealEndpointConstruct", {
    //   lambda,
    //   http,
    //   deals,
    // });
  }
}

module.exports = { DealsConstruct };