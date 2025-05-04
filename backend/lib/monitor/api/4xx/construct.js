const { Construct } = require("constructs");
const { Duration } = require("aws-cdk-lib");
const { Alarm, Metric, Unit } = require("aws-cdk-lib/aws-cloudwatch");
const { SnsAction } = require("aws-cdk-lib/aws-cloudwatch-actions");
const { Runtime } = require("aws-cdk-lib/aws-lambda");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const { Topic } = require("aws-cdk-lib/aws-sns");
const { LambdaSubscription } = require("aws-cdk-lib/aws-sns-subscriptions");
const { join } = require("path");

class Alarm4xxConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { envName } = props;

    const lambda = new NodejsFunction(this, "Lambda", {
      bundling: {
        forceDockerBundling: true,
      },
      runtime: Runtime.NODEJS_20_X,
      entry: join(__dirname, "./handler.js"),
      handler: "handler",
      depsLockFilePath: require.resolve("#package-lock"),
    });

    const topic = new Topic(this, "Topic", {
      displayName: "AlarmTopic",
      topicName: "AlarmTopic",
    });

    topic.addSubscription(new LambdaSubscription(lambda));

    const alarm4xx = new Alarm(this, "4xxAlarm", {
      metric: new Metric({
        metricName: "4XXError",
        namespace: "AWS/ApiGateway",
        period: Duration.minutes(1),
        statistic: "Sum",
        unit: Unit.COUNT,
        dimensionsMap: {
          ApiName: envName,
        },
      }),
      evaluationPeriods: 1,
      threshold: 5,
      alarmName: `${envName}SuperDealsApi4xxAlarm`,
    });

    const topicAction = new SnsAction(topic);

    alarm4xx.addAlarmAction(topicAction);

    alarm4xx.addOkAction(topicAction);
  }
}

module.exports = Alarm4xxConstruct;
