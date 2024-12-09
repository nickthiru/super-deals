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
    } = props;

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
      environment: {
        // Pass the stage-specific table and bucket names as environment variables
        DDB_TABLE_NAMES: JSON.stringify({
          dev: db.dev.table.tableName,
          preprod: db.preprod.table.tableName,
        }),
        S3_BUCKET_NAMES: JSON.stringify({
          dev: storage.dev.s3Bucket.bucketName,
          preprod: storage.preprod.s3Bucket.bucketName,
        }),
      },
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          resources: [
            `${storage.dev.s3Bucket.bucketArn}/*`,
            `${storage.preprod.s3Bucket.bucketArn}/*`,
          ],
          actions: ["s3:PutObject"],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          resources: [
            db.dev.table.tableArn,
            db.preprod.table.tableArn,
          ],
          actions: ["dynamodb:PutItem"],
        }),
      ]
    });
  }
}

module.exports = { LambdaConstruct };