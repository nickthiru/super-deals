const { Construct } = require("constructs");
const { Deployment, Stage, LogGroupLogDestination, AccessLogFormat } = require("aws-cdk-lib/aws-apigateway");
const { LogGroup } = require("aws-cdk-lib/aws-logs");
const { CfnOutput, } = require("aws-cdk-lib");


class StageConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    const { api, stageName } = props;

    const logGroup = new LogGroup(this, `LogGroup-${stageName}`, {
      logGroupName: `/aws/apigateway/${api.restApiId}/${stageName}`,
    });

    const deployment = new Deployment(this, `Deployment-${stageName}`, {
      api,
    });

    const stage = new Stage(this, `Stage-${stageName}`, {
      deployment,
      stageName,
      accessLogDestination: new LogGroupLogDestination(logGroup),
      accessLogFormat: AccessLogFormat.jsonWithStandardFields({
        caller: false,
        httpMethod: true,
        ip: true,
        protocol: true,
        requestTime: true,
        resourcePath: true,
        responseLength: true,
        status: true,
        user: true,
      }),
      // tracingEnabled: true, // Enable X-Ray Tracing if needed
      // methodSettings: [
      //   {
      //     loggingLevel: "INFO",
      //     dataTraceEnabled: true,
      //     metricsEnabled: true,
      //     resourcePath: "/*",
      //     httpMethod: "*",
      //   },
      // ],
    });

    // Set the default deployment stage
    if (stageName === 'dev') {
      api.deploymentStage = stage;
    }

    // Output the stage-specific URL with custom LogicalId (in outputs.json)
    new CfnOutput(this, `RestApiUrl-${stageName}`, {
      value: stage.urlForPath(),
      exportName: `RestApiUrl${stageName}`,
    })
      .overrideLogicalId(`RestApiUrl${stageName}`);
  }
}

module.exports = { StageConstruct };