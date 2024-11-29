const { Construct } = require("constructs");

const { LambdaConstruct } = require("./lambda");
const { EndpointConstruct } = require("./endpoint");

class SignInConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
      http,
      merchantIdResource,
    } = props;


    const signInResource = merchantIdResource.addResource("sign-in");

    const lambda = new LambdaConstruct(this, "LambdaConstruct", {
      auth,
    });

    new EndpointConstruct(this, "EndpointConstruct", {
      http,
      signInResource,
      lambda,
    });
  }
}

module.exports = { SignInConstruct };