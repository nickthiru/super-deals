const { Construct } = require("constructs");
const { Topic } = require("aws-cdk-lib/aws-sns");
const { LogGroup } = require("aws-cdk-lib/aws-logs");
const {
  LogGroupSubscription,
  LogFormat,
} = require("@wheatstalk/cdk-sns-log-group-subscription");

class SignUpCompletedConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.topic = new Topic(this, "SignUpCompletedTopic", {
      topicName: "SignUpCompleted",
    });

    this.topic.addSubscription(
      new LogGroupSubscription({
        logGroup: new LogGroup(this, "SignUpCompletedTopicLogGroup"),
        logFormat: LogFormat.MESSAGE,
      })
    );
  }
}

module.exports = { SignUpCompletedConstruct };
