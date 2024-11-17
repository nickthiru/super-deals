const { Stack } = require("aws-cdk-lib");
const { DealsStack } = require("./deals/stack");

class LambdaStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'LambdaStack'");

    const {
      storage,
      db,
    } = props;

    this.deals = new DealsStack(this, "DealsStack", {
      storage,
      db,
    });
  };
}

module.exports = { LambdaStack };