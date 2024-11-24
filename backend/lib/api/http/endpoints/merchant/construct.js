const { Construct } = require("constructs");
const { DealsConstruct } = require("./deals/construct");

class MerchantConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      lambda,
      http,
    } = props;


    const merchant = http.restApi.root.addResource("merchant", http.optionsWithCors);

    new DealsConstruct(this, "DealsConstruct", {
      lambda,
      http,
      merchant,
    });
  }
}

module.exports = { MerchantConstruct };