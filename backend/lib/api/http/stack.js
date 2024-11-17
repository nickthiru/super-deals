const { Stack } = require("aws-cdk-lib");
const { MerchantHttpConstruct } = require("./merchant/construct");
// const { PublicHttpConstruct } = require("./public/construct");
const { MerchantEndpointsConstruct } = require("./merchant/endpoints/construct");

class HttpStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'HttpStack'");

    const {
      // auth,
      lambda,
    } = props;

    const merchantApi = new MerchantHttpConstruct(this, "MerchantHttpConstruct", {
      // auth,
      lambda,
    });

    new MerchantEndpointsConstruct(this, "MerchantEndpointsConstruct", {
      lambda,
      http: merchantApi,
    });

    // const publicApi = new PublicHttpConstruct(this, "PublicHttpConstruct", {
    //   // auth,
    //   lambda,
    // });

    // new PublicEndpointsStack(this, "PublicEndpointsStack", {
    //   lambda,
    //   http: publicApi.restApi,
    // });
  }
}

module.exports = { HttpStack };