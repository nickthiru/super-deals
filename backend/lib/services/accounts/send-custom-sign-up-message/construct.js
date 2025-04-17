/**
 * Custom Message Lambda Construct
 *
 * This construct creates a Lambda function that customizes Cognito email messages
 * based on user type (merchant vs customer). It is triggered by Cognito
 * during sign-up and password reset processes. It is set on the lambdaTriggers
 * property of the UserPool construct's props.
 */

const { Construct } = require("constructs");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const { Runtime } = require("aws-cdk-lib/aws-lambda");
const path = require("path");
const { PolicyStatement, Effect } = require("aws-cdk-lib/aws-iam");

class SendCustomSignUpMessageConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    const { appUrl, email } = props;

    const emailTemplateName =
      email.accounts.customSignUpEmail.merchant.templateName;

    // Define the Lambda function for custom message handling
    this.function = new NodejsFunction(this, "NodejsFunction", {
      bundling: {
        externalModules: ["@aws-sdk"],
        forceDockerBundling: true,
      },
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "./handler.js"),
      handler: "handler",
      depsLockFilePath: require.resolve("#package-lock"),
      environment: {
        APP_URL: appUrl || "https://dbcxhkl1jwg4u.cloudfront.net",
        EMAIL_TEMPLATE_NAME: emailTemplateName,
      },
    }).addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [
          "arn:aws:ses:us-east-1:346761569124:identity/*", //https://docs.aws.amazon.com/ses/latest/APIReference-V2/API_IdentityInfo.html
          `arn:aws:ses:us-east-1:346761569124:template/${emailTemplateName}`,
        ],
        actions: ["sesv2:SendEmail"],
      })
    );
  }
}

module.exports = SendCustomSignUpMessageConstruct;
