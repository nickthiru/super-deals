const { Construct } = require("constructs");

const MerchantsConstruct = require("./merchants/construct");

class EndpointsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { http, lambda } = props;

    new MerchantsConstruct(this, "MerchantsConstruct", {
      http,
      lambda,
    });
  }
}

module.exports = EndpointsConstruct;
