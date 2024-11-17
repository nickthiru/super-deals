const { Stack, RemovalPolicy } = require("aws-cdk-lib");
const { TableV2, AttributeType, BillingMode } = require("aws-cdk-lib/aws-dynamodb");
const { Bucket } = require("aws-cdk-lib/aws-s3");

class StorageStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'StorageStack'");


    this.s3Bucket = new Bucket(this, "S3Bucket", {
      //
    });
  };
}

module.exports = { StorageStack };