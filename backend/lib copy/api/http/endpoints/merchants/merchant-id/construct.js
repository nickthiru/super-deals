const { Construct } = require("constructs");
const { DealsConstruct } = require("./deals/construct");
// const { DashboardEndpointConstruct } = require("./dashboard/endpoint");

class MerchantIdConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      storage,
      db,
      http,
      merchantsResource,
    } = props;

    const merchantIdResource = merchantsResource.addResource("{merchantId}");

    new DealsConstruct(this, "DealsConstruct", {
      storage,
      db,
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