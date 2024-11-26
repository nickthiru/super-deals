const { Construct } = require("constructs");
const { MerchantConstruct } = require("./merchant/construct");

class EndpointsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      lambda,
      http,
    } = props;

    new MerchantConstruct(this, "MerchantConstruct", {
      lambda,
      http,
    });
  }
}

module.exports = { EndpointsConstruct };