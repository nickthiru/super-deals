const { Construct } = require("constructs");

// const AccountsConstruct = require("./accounts/construct");
// const DealsConstruct = require("./deals/construct");

class MerchantsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { http, lambda } = props;

    const merchantsResource = http.restApi.root.addResource(
      "merchants",
      http.optionsWithCors
    );

    new AccountsConstruct(this, "AccountsConstruct", {
      http,
      lambda,
      merchantsResource,
    });

    new DealsConstruct(this, "DealsConstruct", {
      http,
      lambda,
      merchantsResource,
    });
  }
}

module.exports = MerchantsConstruct;
