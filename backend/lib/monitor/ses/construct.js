const { Construct } = require("constructs");
const {
  CfnConfigurationSet,
  CfnConfigurationSetEventDestination,
} = require("aws-cdk-lib/aws-ses");
const { LogGroup, RetentionDays } = require("aws-cdk-lib/aws-logs");
const {
  PolicyStatement,
  Effect,
  ServicePrincipal,
} = require("aws-cdk-lib/aws-iam");

class SesMonitoringConstruct extends Construct {
  constructor(scope, id, props = {}) {
    super(scope, id, props);

    // Create a CloudWatch Log Group for SES events
    const logGroup = new LogGroup(this, "SesEventsLogGroup", {
      logGroupName: "/aws/ses/super-deals-events", // Log group name
      retention: RetentionDays.ONE_WEEK, // Adjust retention as needed
    });

    // Create a Configuration Set
    const configSetName = "super-deals-config-set";
    const configurationSet = new CfnConfigurationSet(this, "ConfigurationSet", {
      name: configSetName,
    });

    // Create an Event Destination for the Configuration Set
    const eventDestination = new CfnConfigurationSetEventDestination(
      this,
      "EventDestination",
      {
        configurationSetName: configSetName,
        eventDestination: {
          name: "CloudWatchDestination",
          enabled: true,
          matchingEventTypes: [
            "send",
            "reject",
            "bounce",
            "complaint",
            "delivery",
            "renderingFailure",
          ],
          cloudWatchDestination: {
            // This structure is needed even if empty for CloudWatch destinations
            dimensionConfigurations: [
              {
                // Add required dimension configurations
                defaultDimensionValue: "default",
                dimensionName: "ses-event-type",
                dimensionValueSource: "messageTag",
              },
            ],
          },
        },
      }
    );

    // Add dependency to ensure the Configuration Set is created before the Event Destination
    eventDestination.addDependency(configurationSet);

    // Grant SES permission to write to the CloudWatch Log Group
    logGroup.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [new ServicePrincipal("ses.amazonaws.com")],
        actions: ["logs:CreateLogStream", "logs:PutLogEvents"],
        resources: [logGroup.logGroupArn],
        // Add condition to ensure only this account/region can publish
        conditions: {
          StringEquals: {
            "aws:SourceAccount": scope.account,
          },
          ArnLike: {
            "aws:SourceArn": `arn:aws:ses:${scope.region}:${scope.account}:configuration-set/${configSetName}`,
          },
        },
      })
    );

    // Export the configuration set name for use by other constructs
    this.configurationSetName = configSetName;
  }
}

module.exports = SesMonitoringConstruct;
