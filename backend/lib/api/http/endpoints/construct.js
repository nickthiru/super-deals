const { Construct } = require("constructs");

// const AccountsConstruct = require("./accounts/construct");
const DealsConstruct = require("./deals/construct");

class EndpointsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      http,
      lambda,
    } = props;

    // new AccountsConstruct(this, "AccountsConstruct", {
    //   http,
    //   lambda,
    // });

    new DealsConstruct(this, "DealsConstruct", {
      http,
      lambda,
    });
  }
}

module.exports = EndpointsConstruct;