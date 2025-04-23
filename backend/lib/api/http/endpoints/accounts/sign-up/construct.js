const { Construct } = require("constructs");

const MerchantsConstruct = require("./merchants/construct");

class SignUpConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { http, services, accountsResource } = props;

    const signUpResource = accountsResource.addResource(
      "sign-up",
      http.optionsWithCors
    );

    new MerchantsConstruct(this, "MerchantsConstruct", {
      http,
      services,
      signUpResource,
    });
  }
}

module.exports = SignUpConstruct;
