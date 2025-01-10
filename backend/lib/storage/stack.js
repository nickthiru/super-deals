const { Stack, RemovalPolicy, CfnOutput } = require("aws-cdk-lib");
const { Bucket, HttpMethods, BucketEncryption, ObjectOwnership } = require("aws-cdk-lib/aws-s3");

class StorageStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      stage,
    } = props;

    // Define allowed origins based on the stage
    const allowedOrigins = stage === "prod"
      ? ['https://your-production-domain.com']
      : ['http://localhost:5173', 'http://localhost:3000']; // Add any other local development URLs

    this.s3Bucket = new Bucket(this, "S3Bucket", {
      removalPolicy: stage === "prod" ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: stage !== "prod", // Only enable for non-production stages
      cors: [
        {
          allowedMethods: [
            HttpMethods.GET,
            HttpMethods.HEAD,
            HttpMethods.PUT,
            HttpMethods.POST,
            HttpMethods.DELETE,
          ],
          allowedOrigins: allowedOrigins,
          allowedHeaders: ['*'],
          exposedHeaders: [
            'x-amz-server-side-encryption',
            'x-amz-request-id',
            'x-amz-id-2',
            'ETag',
          ],
          maxAge: 3000,
        },
      ],
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
      },
      versioned: true,
      encryption: BucketEncryption.S3_MANAGED,
    });

    // Output the bucket name
    new CfnOutput(this, "S3BucketName", {
      value: this.s3Bucket.bucketName,
      exportName: "S3BucketName",
      description: "Name of the S3 bucket",
    });

    // Output the bucket ARN
    new CfnOutput(this, "S3BucketArn", {
      value: this.s3Bucket.bucketArn,
      exportName: "S3BucketArn",
      description: "ARN of the S3 bucket",
    });
  }
}

module.exports = StorageStack;