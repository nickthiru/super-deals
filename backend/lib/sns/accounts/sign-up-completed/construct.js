const { Construct } = require("constructs");
const { Topic } = require("aws-cdk-lib/aws-sns");
const { LogGroup, RetentionDays } = require("aws-cdk-lib/aws-logs");
const { CfnOutput } = require("aws-cdk-lib");
const {
  SnsToCloudWatchLogsSubscription,
} = require("../../../shared/sns-log-subscription/construct");

class SignUpCompletedConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.topic = new Topic(this, "SignUpCompletedTopic", {
      topicName: "SignUpCompleted",
    });

    // Option 1: Create a log group separately and pass it
    const logGroup = new LogGroup(this, "SignUpCompletedTopicLogGroup", {
      retention: RetentionDays.ONE_MONTH,
    });

    this.topic.addSubscription(
      new SnsToCloudWatchLogsSubscription(this, "LogSubscription", {
        logGroup,
      })
    );

    // Option 2: Let the subscription create its own log group
    // this.topic.addSubscription(
    //   new SnsToCloudWatchLogsSubscription(this, "LogSubscription", {
    //     logGroupName: "/aws/sns/SignUpCompleted",
    //     retention: RetentionDays.ONE_MONTH
    //   })
    // );

    // Add CfnOutput for the topic ARN
    new CfnOutput(this, "SignUpCompletedTopicArn", {
      value: this.topic.topicArn,
      description: "ARN of the SNS topic for sign-up completed events",
      exportName: "SignUpCompletedTopicArn",
    });
  }
}

module.exports = SignUpCompletedConstruct;
