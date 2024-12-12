const { Stack } = require("aws-cdk-lib");
const { DealsStack } = require("./deals/stack");

class LambdaStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      // auth,
      storage,
      db,
      OasOpIdsToLambdaArns,
    } = props;

    new DealsStack(this, "DealsStack", {
      // auth,
      storage,
      db,
      OasOpIdsToLambdaArns,
    });


  };
}

module.exports = { LambdaStack };