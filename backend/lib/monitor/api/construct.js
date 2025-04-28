const { Construct } = require("constructs");
const { Alarm4xxConstruct } = require("./4xx/construct");

class ApiConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { envName } = props;

    new Alarm4xxConstruct(this, "Alarm4xxConstruct", { envName });
  }
}

module.exports = ApiConstruct;
