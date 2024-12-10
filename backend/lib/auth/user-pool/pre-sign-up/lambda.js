// // Create Lambda function for pre-sign-up logic
const { Construct } = require("constructs");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const { Runtime } = require("aws-cdk-lib/aws-lambda");
// const { Duration } = require("aws-cdk-lib");
const { PolicyStatement, Effect } = require("aws-cdk-lib/aws-iam");
const path = require("path");


class LambdaConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    // const {
    //   policyStore,
    // } = props;

    // Define the Lambda function to create policies
    this.function = new NodejsFunction(this, "NodejsFunction", {
      bundling: {
        externalModules: ["@aws-sdk"],
        forceDockerBundling: true,
      },
      runtime: Runtime.NODEJS_20_X,
      // memorySize: 1024,
      // memorySize: 512,
      // timeout: Duration.minutes(1),
      entry: (path.join(__dirname, "./handler.js")),
      handler: "handler",
      depsLockFilePath: require.resolve("#package-lock"),
    });
  }
}

module.exports = { LambdaConstruct };