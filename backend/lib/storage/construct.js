const { Construct } = require("constructs");
const { RemovalPolicy } = require("aws-cdk-lib");
const { Bucket } = require("aws-cdk-lib/aws-s3");

class StorageConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'StorageConstruct'");


    const { stage } = props;

    this.s3Bucket = new Bucket(this, `S3Bucket-${stage}`, {
      bucketName: `deals-bucket-${stage}`,
      removalPolicy: stage === 'prod' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });
  };
}

module.exports = { StorageConstruct };