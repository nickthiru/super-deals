const { Construct } = require("constructs");
const { DealsConstruct } = require("./deals/construct");
const { SignInConstruct } = require("./sign-in/construct");
const { SignUpConstruct } = require("./sign-up/construct");
// const { DashboardEndpointConstruct } = require("./dashboard/endpoint");

class MerchantIdConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
      storage,
      db,
      http,
      merchantResource,
    } = props;

    const merchantIdResource = merchantResource.addResource("{merchantId}");

    new DealsConstruct(this, "DealsConstruct", {
      storage,
      db,
      http,
      merchantIdResource,
    });

    new SignInConstruct(this, "SignInConstruct", {
      auth,
      http,
      merchantIdResource,
    });

    new SignUpConstruct(this, "SignUpConstruct", {
      auth,
      http,
      merchantIdResource,
    });

    // new DashboardEndpointConstruct(this, "DashboardEndpointConstruct", {
    //   http,
    //   merchantIdResource,
    // });
  }
}

module.exports = { MerchantIdConstruct };