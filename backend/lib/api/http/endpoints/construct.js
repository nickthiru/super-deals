const { Construct } = require("constructs");
const { DealsConstruct } = require("./deals/construct");

class EndpointsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      lambda,
      http,
    } = props;

    new DealsConstruct(this, "DealsConstruct", {
      lambda,
      http,
    });
  }
}

module.exports = { EndpointsConstruct };