const { Stack } = require("aws-cdk-lib");
const { DbConstruct } = require("./construct");

class DbStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.dev = new DbConstruct(this, "DbConstruct-dev", {
      stage: "dev",
    });

    this.preprod = new DbConstruct(this, "DbConstruct-preprod", {
      stage: "preprod",
    });
  }
}

module.exports = { DbStack };