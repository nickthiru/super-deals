// const { Stack } = require("aws-cdk-lib");
const { Construct } = require("constructs");
const { DealsEndpointsConstruct } = require("./deals/construct");

class MerchantEndpointsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'MerchantEndpointsConstruct'");

    const {
      lambda,
      http,
    } = props;

    this.endpoints = new DealsEndpointsConstruct(this, "DealsEndpointsConstruct", {
      lambda,
      http,
    });
  }
}

module.exports = { MerchantEndpointsConstruct };