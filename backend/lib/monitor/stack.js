const { Stack } = require("aws-cdk-lib");
const ApiMonitoringConstruct = require("./api/construct");
const SesMonitoringConstruct = require("./ses/construct");

class MonitorStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { envName } = props;

    this.ses = new SesMonitoringConstruct(this, "SesMonitoringConstruct");

    // this.sesConfigurationSetName = sesMonitoring.configurationSetName;

    new ApiMonitoringConstruct(this, "ApiMonitoringConstruct", { envName });
  }
}

module.exports = MonitorStack;
