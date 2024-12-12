const { Construct } = require("constructs");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const { Runtime } = require("aws-cdk-lib/aws-lambda");
// const { Duration } = require("aws-cdk-lib");
const { PolicyStatement, Effect } = require("aws-cdk-lib/aws-iam");
const path = require("path");


class LambdaConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    const {
      storage,
      db,
      OasOpIdsToLambdaArns,
      OasOpId,
    } = props;

    const fn = new NodejsFunction(this, "NodejsFunction", {
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
      environment: {
        DDB_TABLE_NAME: db.table.tableName,
        S3_BUCKET_NAME: storage.s3Bucket.bucketName,
      },
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          resources: [`${storage.s3Bucket.bucketArn}/*`],
          actions: ["s3:PutObject"],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          resources: [db.table.tableArn],
          actions: ["dynamodb:PutItem"],
        }),
      ]
    });

    OasOpIdsToLambdaArns.set(OasOpId, fn.functionArn);
  }
}

module.exports = { LambdaConstruct };