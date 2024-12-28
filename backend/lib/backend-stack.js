const { Stack } = require('aws-cdk-lib');

const DbStack = require('./db/stack');
const StorageStack = require('./storage/stack');
const AuthStack = require('./auth/stack');
const LambdaStack = require('./lambda/stack');
const ApiStack = require('./api/stack');
// const IamStack = require('./iam/stack');
// const PermissionsStack = require('./permissions/stack');

class BackendStack extends Stack {
  /**
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      stage,
    } = props;

    const db = new DbStack(this, "DbStack", {
      stage,
    });

    const storage = new StorageStack(this, "StorageStack", {
      stage,
    });

    const auth = new AuthStack(this, "AuthStack", {
      stage,
      storage,
    });

    const lambda = new LambdaStack(this, "LambdaStack", {
      auth,
      db,
    });

    const api = new ApiStack(this, "ApiStack", {
      auth,
      stage,
      lambda,
    });

    // const iam = new IamStack(this, "IamStack", {
    //   auth: authStacks,
    //   storage: storageStacks,
    // });

    // Note that Amazon Verified Permissions may not be included in the free-tier AWS account
    // new PermissionsStack(this, "PermissionsStack", {
    //   auth: authStacks,
    //   api,
    // });
  }
}

module.exports = BackendStack;
