const { Stack } = require("aws-cdk-lib");

const DealsResourceServerConstruct = require("./deals/construct");

class ResourceServersStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { userPool, envName } = props;

    // Create Deals Resource Server
    this.deals = new DealsResourceServerConstruct(this, "DealsResourceServer", {
      userPool,
      envName
    });
  }
}

module.exports = ResourceServersStack;
