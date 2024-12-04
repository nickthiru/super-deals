const { Construct } = require("constructs");
const { MerchantsConstruct } = require("./merchants/construct");

class EndpointsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
      storage,
      db,
      http,
    } = props;

    new MerchantsConstruct(this, "MerchantsConstruct", {
      auth,
      storage,
      db,
      http,
    });
  }
}

module.exports = { EndpointsConstruct };