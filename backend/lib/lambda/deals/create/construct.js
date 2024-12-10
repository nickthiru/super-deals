const { Construct } = require("constructs");

const { LambdaConstruct } = require("./lambda");

class CreateConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      storage,
      db,
      lambdaArns,
    } = props;

    new LambdaConstruct(this, "LambdaConstruct", {
      storage,
      db,
      lambdaArns,
    });
  }
}

module.exports = { CreateConstruct };