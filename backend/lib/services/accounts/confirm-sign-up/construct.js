const { Construct } = require("constructs");
const { PolicyStatement, Effect } = require("aws-cdk-lib/aws-iam");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const { Runtime } = require("aws-cdk-lib/aws-lambda");
// const { Duration } = require("aws-cdk-lib");
const path = require("path");

class ConfirmSignUpConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    const { auth } = props;

    this.lambda = new NodejsFunction(this, "NodejsFunction", {
      bundling: {
        externalModules: ["@aws-sdk"],
        forceDockerBundling: true,
      },
      runtime: Runtime.NODEJS_20_X,
      // memorySize: 1024,
      // memorySize: 512,
      // timeout: Duration.minutes(1),
      entry: path.join(
        __dirname,
        "../../../../../src/lambda/merchants/account/confirm-sign-up/handler.js"
      ),
      handler: "handler",
      depsLockFilePath: require.resolve("#package-lock"),
      environment: {
        USER_POOL_CLIENT_ID: auth.userPool.poolClient.userPoolClientId,
      },
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["cognito-idp:ConfirmSignUp"],
          resources: "*",
        }),
      ],
    });
  }
}

module.exports = ConfirmSignUpConstruct;
