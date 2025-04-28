const { Stack } = require("aws-cdk-lib");
const { ApiConstruct } = require("./api/construct");

class MonitorStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { envName } = props;

    new ApiConstruct(this, "ApiConstruct", { envName });
  }
}

module.exports = MonitorStack;
