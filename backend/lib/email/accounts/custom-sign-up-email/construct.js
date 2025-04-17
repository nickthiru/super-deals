const { Construct } = require("constructs");
const { MerchantConstruct } = require("./merchant/construct");
const { CustomerSignUpConstruct } = require("./customer/construct");

class CustomSignUpEmailConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.merchant = new MerchantConstruct(this, "MerchantConstruct", {});
    this.customer = new CustomerSignUpConstruct(this, "CustomerConstruct", {});
  }
}

module.exports = { CustomSignUpEmailConstruct };
