const { Construct } = require("constructs");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const { Runtime } = require("aws-cdk-lib/aws-lambda");
const { PolicyStatement, Effect } = require("aws-cdk-lib/aws-iam");
const { UserPoolOperation } = require("aws-cdk-lib/aws-cognito");
const { Duration } = require("aws-cdk-lib");
const { ServicePrincipal } = require("aws-cdk-lib/aws-iam");
const path = require("path");

/**
 * Construct for the Post Confirmation Lambda trigger
 * This Lambda is triggered after a user confirms their account (verifies their email)
 * and sends a welcome email using the specified email template.
 *
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-confirmation.html
 */
class SendWelcomeEmailConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    const { email, userPool, appUrl } = props;

    const emailTemplateName = email.accounts.welcome.merchant.templateName;

    // Define the Lambda function for post confirmation handling
    this.lambda = new NodejsFunction(this, "Lambda", {
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "./handler.js"),
      handler: "handler",
      depsLockFilePath: require.resolve("#package-lock"),
      timeout: Duration.seconds(30), // Increase timeout to 30 seconds
      memorySize: 256, // Increase memory to 256 MB
      environment: {
        EMAIL_TEMPLATE_NAME: emailTemplateName,
        SOURCE_EMAIL: process.env.FROM_EMAIL || "superdeals616@gmail.com",
        SITE_URL: appUrl || "https://super-deals.com",
      },
    });

    // Add permissions for sending emails via SES
    this.lambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ["*"],
        actions: [
          "ses:SendEmail",
          "ses:SendRawEmail",
          "ses:SendTemplatedEmail",
        ],
      })
    );

    // Add specific permissions for the email template
    this.lambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [
          `arn:aws:ses:us-east-1:346761569124:template/${emailTemplateName}`,
        ],
        actions: ["ses:GetTemplate"],
      })
    );

    // Grant permissions for Cognito to invoke the Lambda function if userPool is provided
    if (userPool) {
      // Add permission for Cognito to invoke this Lambda
      this.lambda.addPermission("InvokePermission", {
        principal: new ServicePrincipal("cognito-idp.amazonaws.com"),
        sourceArn: userPool.userPoolArn,
      });
    }
  }
}

module.exports = SendWelcomeEmailConstruct;
