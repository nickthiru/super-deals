const { Stack } = require('aws-cdk-lib');
const { DbStack } = require('./db/stack');
const { StorageStack } = require('./storage/stack');
const { LambdaStack } = require('./lambda/stack');
const { ApiStack } = require('./api/stack');
const { AuthStack } = require('./auth/stack');
const { AvpStack } = require('./avp/stack');
const { IamStack } = require('./iam/stack');

class BackendStack extends Stack {
  /**
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const db = new DbStack(this, "DbStack");

    const storage = new StorageStack(this, "StorageStack");

    const auth = new AuthStack(this, "AuthStack");

    const iam = new IamStack(this, "IamStack", {
      auth,
    });

    /*
    An object to store all the lambda function ARNs mapped to the operation IDs in the resource methods of the OAS. There used to reference the aws_proxy Lambda functions in the uri parameter of the x-amazon-apigateway-integration property.
    */
    const OasOpIdsToLambdaArns = new Map();

    const lambda = new LambdaStack(this, "LambdaStack", {
      // auth,
      storage,
      db,
      OasOpIdsToLambdaArns,
    });

    const api = new ApiStack(this, "ApiStack", {
      OasOpIdsToLambdaArns,
    });

    // Note that Amazon Verified Permissions may not be included in the free-tier AWS account
    // new AvpStack(this, "PolicyStack", {
    //   auth,
    //   api,
    // });
  }
}

module.exports = { BackendStack }
