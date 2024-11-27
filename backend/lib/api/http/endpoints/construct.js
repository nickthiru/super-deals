const { Construct } = require("constructs");
const { MerchantConstruct } = require("./merchant/construct");

class EndpointsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
      storage,
      db,
      http,
    } = props;

    new MerchantConstruct(this, "MerchantConstruct", {
      auth,
      storage,
      db,
      http,
    });
  }
}

module.exports = { EndpointsConstruct };