const { Construct } = require("constructs");

const { LambdaConstruct } = require("./lambda");
const { EndpointConstruct } = require("./endpoint");

class CreateConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      storage,
      db,
      http,
      dealsResource,
    } = props;

    const lambda = new LambdaConstruct(this, "LambdaConstruct", {
      storage,
      db,
    });

    new EndpointConstruct(this, "EndpointConstruct", {
      lambda,
      http,
      dealsResource,
    });
  }
}

module.exports = { CreateConstruct };