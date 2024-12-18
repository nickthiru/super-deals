const { Construct } = require("constructs");

const { LambdaConstruct } = require("./lambda");
const { EndpointConstruct } = require("./endpoint");

class SignUpConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
      http,
      merchantsResource,
    } = props;


    const signUpResource = merchantsResource.addResource("sign-up");

    const lambda = new LambdaConstruct(this, "LambdaConstruct", {
      auth,
    });

    new EndpointConstruct(this, "EndpointConstruct", {
      http,
      signUpResource,
      lambda,
    });
  }
}

module.exports = { SignUpConstruct };