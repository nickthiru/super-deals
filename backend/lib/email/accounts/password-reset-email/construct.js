const { Construct } = require("constructs");
const { MerchantPasswordResetConstruct } = require("./merchant/construct");
const { CustomerPasswordResetConstruct } = require("./customer/construct");

class PasswordResetEmailConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.merchant = new MerchantPasswordResetConstruct(this, "MerchantConstruct", {});
    this.customer = new CustomerPasswordResetConstruct(this, "CustomerConstruct", {});
  }
}

module.exports = { PasswordResetEmailConstruct };
