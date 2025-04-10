const { Construct } = require("constructs");

const AccountsConstruct = require("./accounts/construct");

class EndpointsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { http, lambda } = props;

    new AccountsConstruct(this, "AccountsConstruct", {
      http,
      lambda,
    });
  }
}

module.exports = EndpointsConstruct;
