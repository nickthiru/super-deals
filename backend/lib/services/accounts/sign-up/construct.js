const { Construct } = require("constructs");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const { Runtime } = require("aws-cdk-lib/aws-lambda");
// const { Duration } = require("aws-cdk-lib");
const { PolicyStatement, Effect } = require("aws-cdk-lib/aws-iam");
const path = require("path");

class SignUpConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    const { auth } = props;

    this.lambda = new NodejsFunction(this, "NodejsFunction", {
      name: "Accounts_SignUp",
      bundling: {
        externalModules: ["@aws-sdk"],
        forceDockerBundling: true,
      },
      runtime: Runtime.NODEJS_20_X,
      // memorySize: 1024,
      // memorySize: 512,
      // timeout: Duration.minutes(1),
      entry: path.join(__dirname, "./handler.js"),
      handler: "handler",
      depsLockFilePath: require.resolve("#package-lock"),
      environment: {
        USER_POOL_ID: auth.userPool.pool.userPoolId,
        USER_POOL_CLIENT_ID: auth.userPool.poolClient.userPoolClientId,
      },
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["cognito-idp:SignUp"],
          resources: "*",
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["cognito-idp:AdminAddUserToGroup"],
          resources: [auth.userPool.pool.userPoolArn],
        }),
      ],
    });
  }
}

module.exports = SignUpConstruct;
