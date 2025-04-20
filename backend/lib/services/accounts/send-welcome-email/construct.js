const { Construct } = require("constructs");
const { Queue } = require("aws-cdk-lib/aws-sqs");
const { Duration } = require("aws-cdk-lib");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const { Runtime } = require("aws-cdk-lib/aws-lambda");
const { PolicyStatement, Effect } = require("aws-cdk-lib/aws-iam");
const { SnsToSqs } = require("@aws-solutions-constructs/aws-sns-sqs");
const { SqsToLambda } = require("@aws-solutions-constructs/aws-sqs-lambda");
const path = require("path");

class SendWelcomeEmailConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { sns, email } = props;

    const triggerEvent = sns.accounts.signUpCompleted.topic;

    const emailTemplateName = email.accounts.welcome.merchant.templateName;

    const queue = new Queue(this, "Queue");

    const lambda = new NodejsFunction(this, "Lambda", {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, "./handler.js"),
      handler: "handler",
      depsLockFilePath: require.resolve("#package-lock"),
      environment: {
        EMAIL_TEMPLATE_NAME: emailTemplateName,
      },
    });

    lambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [
          "arn:aws:ses:us-east-1:346761569124:identity/*", //https://docs.aws.amazon.com/ses/latest/APIReference-V2/API_IdentityInfo.html
          `arn:aws:ses:us-east-1:346761569124:template/${emailTemplateName}`,
        ],
        actions: ["ses:SendTemplatedEmail"],
      })
    );

    new SnsToSqs(this, "SendWelcomeEmailSnsToSqs", {
      existingTopicObj: triggerEvent,
      existingQueueObj: queue,
    });

    new SqsToLambda(this, "SendWelcomeEmailSqsToLambda", {
      existingQueueObj: queue,
      existingLambdaObj: lambda,
    });
  }
}

module.exports = SendWelcomeEmailConstruct;
