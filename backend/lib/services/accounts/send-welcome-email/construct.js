const { Construct } = require("constructs");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const { Runtime } = require("aws-cdk-lib/aws-lambda");
const {
  PolicyStatement,
  Effect,
  ServicePrincipal,
} = require("aws-cdk-lib/aws-iam");
const { Duration } = require("aws-cdk-lib");
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

    // Destructure props, including the new configurationSetName
    const { email, userPool, appUrl, configurationSetName } = props;

    // Get template names for both user types
    const merchantEmailTemplateName =
      email.accounts.welcome.merchant.templateName;
    const customerEmailTemplateName =
      email.accounts.welcome.customer?.templateName || "CustomerWelcome";

    // Define the Lambda function for post confirmation handling
    this.lambda = new NodejsFunction(this, "Lambda", {
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "./handler.js"),
      handler: "handler",
      depsLockFilePath: require.resolve("#package-lock"),
      timeout: Duration.seconds(30),
      memorySize: 256,
      environment: {
        // Include both template names for different user types
        MERCHANT_EMAIL_TEMPLATE_NAME: merchantEmailTemplateName,
        CUSTOMER_EMAIL_TEMPLATE_NAME: customerEmailTemplateName,
        EMAIL_TEMPLATE_NAME: merchantEmailTemplateName, // For backward compatibility
        SOURCE_EMAIL: process.env.FROM_EMAIL || "superdeals616@gmail.com",
        SITE_URL: appUrl || "https://super-deals.com",
        // Conditionally add CONFIGURATION_SET_NAME only if it's provided
        ...(configurationSetName && {
          CONFIGURATION_SET_NAME: configurationSetName,
        }),
      },
    });

    // Add permissions for sending emails via SES
    this.lambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "ses:SendEmail",
          "ses:SendTemplatedEmail",
          "ses:SendRawEmail",
        ],
        resources: ["*"], // Consider restricting if possible
      })
    );

    // Add specific permissions for both email templates
    this.lambda.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [
          // `arn:aws:ses:us-east-1:346761569124:template/${merchantEmailTemplateName}`,
          // `arn:aws:ses:us-east-1:346761569124:template/${customerEmailTemplateName}`,
          "arn:aws:ses:us-east-1:346761569124:template/*",
        ],
        actions: ["ses:GetTemplate"],
      })
    );

    // Grant the Lambda permission to be invoked by Cognito
    if (userPool) {
      this.lambda.addPermission("CognitoInvocation", {
        principal: new ServicePrincipal("cognito-idp.amazonaws.com"),
        action: "lambda:InvokeFunction",
        sourceArn: userPool.userPoolArn,
      });
    }
  }
}

module.exports = SendWelcomeEmailConstruct;
