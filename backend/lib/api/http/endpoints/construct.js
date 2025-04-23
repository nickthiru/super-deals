const { Construct } = require("constructs");

const AccountsConstruct = require("./accounts/construct");

class EndpointsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { http, services } = props;

    new AccountsConstruct(this, "AccountsConstruct", {
      http,
      services,
    });
  }
}

module.exports = EndpointsConstruct;
