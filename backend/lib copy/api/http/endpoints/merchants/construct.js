const { Construct } = require("constructs");

const { MerchantIdConstruct } = require("./merchant-id/construct");
const { SignInConstruct } = require("./sign-in/construct");
const { SignUpConstruct } = require("./sign-up/construct");

class MerchantsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
      storage,
      db,
      http,
    } = props;


    const merchantsResource = http.restApi.root.addResource("merchants", http.optionsWithCors);

    new MerchantIdConstruct(this, "MerchantIdConstruct", {
      storage,
      db,
      http,
      merchantsResource,
    });

    new SignInConstruct(this, "SignInConstruct", {
      auth,
      http,
      merchantsResource,
    });

    new SignUpConstruct(this, "SignUpConstruct", {
      auth,
      http,
      merchantsResource,
    });
  }
}

module.exports = { MerchantsConstruct };