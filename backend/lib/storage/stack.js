const { Stack, RemovalPolicy } = require("aws-cdk-lib");
const { Bucket } = require("aws-cdk-lib/aws-s3");
const { StorageConstruct } = require("./construct");

class StorageStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'StorageStack'");

    this.dev = new StorageConstruct(this, "StorageConstruct-dev", {
      stage: "dev",
    });

    this.preprod = new StorageConstruct(this, "StorageConstruct-preprod", {
      stage: "preprod",
    });
  };
}

module.exports = { StorageStack };