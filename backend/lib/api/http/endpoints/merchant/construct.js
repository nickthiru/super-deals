const { Construct } = require("constructs");

const { SignUpConstruct } = require("./sign-up/construct");
const { DealsConstruct } = require("./deals/construct");

class MerchantConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
      storage,
      db,
      http,
    } = props;


    const merchant = http.restApi.root.addResource("merchant", http.optionsWithCors);


    new SignUpConstruct(this, "SignUpConstruct", {
      auth,
      http,
      merchant,
    });

    new DealsConstruct(this, "DealsConstruct", {
      // auth,
      storage,
      db,
      http,
      merchant,
    });
  }
}

module.exports = { MerchantConstruct };