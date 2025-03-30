const { Stack } = require("aws-cdk-lib");

const MerchantsStack = require("./merchants/stack");

class LambdaStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { auth, db } = props;

    this.merchants = new MerchantsStack(this, "MerchantsStack", {
      auth,
      db,
    });
  }
}

module.exports = LambdaStack;
