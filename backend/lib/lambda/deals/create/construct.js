const { Construct } = require("constructs");

const { LambdaConstruct } = require("./lambda");

class CreateConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      storage,
      db,
      OasOpIdsToLambdaArns,
    } = props;

    const OasOpId = "CreateDeal";

    new LambdaConstruct(this, "LambdaConstruct", {
      storage,
      db,
      OasOpIdsToLambdaArns,
      OasOpId,
    });
  }
}

module.exports = { CreateConstruct };