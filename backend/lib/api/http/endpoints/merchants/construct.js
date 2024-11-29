const { Construct } = require("constructs");

const { MerchantIdConstruct } = require("./merchant-id/construct");

class MerchantConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
      storage,
      db,
      http,
    } = props;


    const merchantResource = http.restApi.root.addResource("merchant", http.optionsWithCors);

    new MerchantIdConstruct(this, "MerchantIdConstruct", {
      auth,
      storage,
      db,
      http,
      merchantResource,
    });
  }
}

module.exports = { MerchantConstruct };