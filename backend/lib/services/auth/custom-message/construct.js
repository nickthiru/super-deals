/**
 * Custom Message Lambda Construct
 *
 * This construct creates a Lambda function that customizes Cognito email messages
 * based on user type (merchant vs customer).
 */

const { Construct } = require("constructs");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const { Runtime } = require("aws-cdk-lib/aws-lambda");
const path = require("path");

class CustomMessageConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    const { appUrl } = props || {};

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
      environment: {
        APP_URL: appUrl || "https://dbcxhkl1jwg4u.cloudfront.net",
      },
    });
  }
}

module.exports = CustomMessageConstruct;
