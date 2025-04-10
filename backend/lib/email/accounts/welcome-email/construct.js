const { Construct } = require("constructs");
const { MerchantConstruct } = require("./merchant/construct");
// const { CustomerConstruct } = require("./customer/construct");

class WelcomeEmailConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.merchant = new MerchantConstruct(this, "MerchantConstruct", {});

    // this.customer = new CustomerConstruct(this, "CustomerConstruct", {});
  }
}

module.exports = { WelcomeEmailConstruct };
