const { Construct } = require("constructs");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const { Runtime } = require("aws-cdk-lib/aws-lambda");
const { LambdaSubscription } = require("aws-cdk-lib/aws-sns-subscriptions");
const { LogGroup, RetentionDays } = require("aws-cdk-lib/aws-logs");
const path = require("path");

/**
 * A construct that creates an SNS subscription that logs messages to CloudWatch Logs
 */
class SnsLogSubscription extends Construct {
  /**
   * @param {Construct} scope - The parent construct
   * @param {string} id - The construct ID
   * @param {Object} props - Construct properties
   * @param {string} [props.logGroupName] - Optional name for the log group
   * @param {RetentionDays} [props.retention=RetentionDays.ONE_MONTH] - Log retention period
   */
  constructor(scope, id, props = {}) {
    super(scope, id);

    const { logGroupName, retention = RetentionDays.ONE_MONTH } = props;

    // Create a log group
    this.logGroup = new LogGroup(this, "LogGroup", {
      logGroupName,
      retention,
    });

    // Create the Lambda function that will process SNS messages
    this.lambda = new NodejsFunction(this, "Function", {
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "handler.js"),
      handler: "handler",
      bundling: {
        externalModules: ["@aws-sdk"],
      },
      environment: {
        LOG_GROUP_NAME: this.logGroup.logGroupName,
      },
    });

    // Grant permissions for the Lambda to write to the log group
    this.logGroup.grantWrite(this.lambda);

    // Create the subscription
    this.subscription = new LambdaSubscription(this.lambda);
  }
}

/**
 * A utility class that creates an SNS subscription for logging to CloudWatch
 */
class SnsToCloudWatchLogsSubscription extends LambdaSubscription {
  /**
   * Creates a subscription that logs SNS messages to CloudWatch Logs
   *
   * @param {Construct} scope - The parent construct
   * @param {string} id - The construct ID
   * @param {Object} props - Construct properties
   * @param {LogGroup} [props.logGroup] - Optional existing log group to use
   * @param {string} [props.logGroupName] - Optional name for a new log group
   * @param {RetentionDays} [props.retention] - Log retention period for new log group
   */
  constructor(scope, id, props = {}) {
    const { logGroup, logGroupName, retention } = props;

    // If a log group is provided, use it; otherwise create a new SnsLogSubscription
    if (logGroup) {
      // Create a Lambda function for the provided log group
      const lambda = new NodejsFunction(scope, `${id}Function`, {
        runtime: Runtime.NODEJS_20_X,
        entry: path.join(__dirname, "handler.js"),
        handler: "handler",
        bundling: {
          externalModules: ["@aws-sdk"],
        },
        environment: {
          LOG_GROUP_NAME: logGroup.logGroupName,
        },
      });

      // Grant permissions
      logGroup.grantWrite(lambda);

      // Call parent constructor with the Lambda
      super(lambda);
    } else {
      // Create a full SnsLogSubscription construct
      const logSubscription = new SnsLogSubscription(scope, id, {
        logGroupName,
        retention,
      });

      // Call parent constructor with the Lambda from the subscription
      super(logSubscription.lambda);
    }
  }
}

module.exports = {
  SnsLogSubscription,
  SnsToCloudWatchLogsSubscription,
};
