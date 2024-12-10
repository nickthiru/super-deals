const { Stack, RemovalPolicy } = require("aws-cdk-lib");
const { Bucket } = require("aws-cdk-lib/aws-s3");

class StorageStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.s3Bucket = new Bucket(this, "S3Bucket", {
      bucketName: "deals-bucket",
      removalPolicy: RemovalPolicy.DESTROY,
    });
  };
}

module.exports = { StorageStack };