const { Stack, RemovalPolicy, CfnOutput } = require("aws-cdk-lib");
const { Bucket } = require("aws-cdk-lib/aws-s3");


class StorageStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      stage,
    } = props;

    this.s3Bucket = new Bucket(this, "S3Bucket", {
      removalPolicy: stage === "prod" ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });

    new CfnOutput(this, "S3BucketName", {
      value: this.s3Bucket.bucketName,
      exportName: "S3BucketName",
      description: "Name of the S3 bucket",
    });
  }
}

module.exports = StorageStack;