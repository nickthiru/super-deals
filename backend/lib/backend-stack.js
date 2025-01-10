const { Stack } = require('aws-cdk-lib');

const DbStack = require('./db/stack');
const StorageStack = require('./storage/stack');
const AuthStack = require('./auth/stack');
const LambdaStack = require('./lambda/stack');
const ApiStack = require('./api/stack');
const PermissionsStack = require('./permissions/stack');
const IamStack = require('./iam/stack');

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
    });

    const iam = new IamStack(this, "IamStack", {
      auth,
    });

    const lambda = new LambdaStack(this, "LambdaStack", {
      auth,
      db,
    });

    const permissions = new PermissionsStack(this, "PermissionsStack", {
      iam,
      storage,
      dealsResourceServer: auth.userPool.dealsResourceServer.resourceServer,
    });

    new ApiStack(this, "ApiStack", {
      auth,
      stage,
      lambda,  // For HTTP API Lambda proxy integration
      permissions,
    });
  }
}

module.exports = BackendStack;
