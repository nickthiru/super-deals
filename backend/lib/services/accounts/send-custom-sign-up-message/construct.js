/**
 * Custom Message Lambda Construct
 *
 * This construct creates a Lambda function that customizes Cognito email messages
 * based on user type (merchant vs customer). It is triggered by Cognito
 * during sign-up and password reset processes. It is set on the lambdaTriggers
 * property of the UserPool construct's props.
 *
 * The Lambda modifies the event.response properties to customize the email content
 * that Cognito sends to users.
 */

const { Construct } = require("constructs");
const { Duration } = require("aws-cdk-lib");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const { Runtime } = require("aws-cdk-lib/aws-lambda");
const path = require("path");
const { ServicePrincipal } = require("aws-cdk-lib/aws-iam");

class SendCustomSignUpMessageConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    const { appUrl, userPool } = props;

    // App URL for confirmation links
    const applicationUrl = appUrl || "https://dbcxhkl1jwg4u.cloudfront.net";

    // Define the Lambda function for custom message handling
    this.lambda = new NodejsFunction(this, "NodejsFunction", {
      bundling: {
        externalModules: ["@aws-sdk"],
        forceDockerBundling: true,
      },
      runtime: Runtime.NODEJS_20_X,
      entry: path.join(__dirname, "./handler.js"),
      handler: "handler",
      depsLockFilePath: require.resolve("#package-lock"),
      timeout: Duration.seconds(30), // Increase timeout to 30 seconds
      memorySize: 256, // Increase memory to 256 MB
      environment: {
        APP_URL: applicationUrl,
      },
    });

    // No additional permissions needed for the Lambda function
    // Cognito will handle sending the emails using its own service

    // Grant permissions for Cognito to invoke the Lambda function if userPool is provided
    if (userPool) {
      this.lambda.addPermission("InvokePermission", {
        principal: new ServicePrincipal("cognito-idp.amazonaws.com"),
        sourceArn: userPool.userPoolArn,
      });
    }
  }
}

module.exports = SendCustomSignUpMessageConstruct;
