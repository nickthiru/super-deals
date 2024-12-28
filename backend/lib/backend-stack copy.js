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

    // Staged Resources
    const stages = ['dev'];
    const storageStacks = {};
    const dbStacks = {};
    const authStacks = {};

    stages.forEach(stage => {
      dbStacks[stage] = new DbStack(this, `DbStack-${stage}`, {
        stage,
      });

      storageStacks[stage] = new StorageStack(this, `StorageStack-${stage}`, {
        stage,
      });

      authStacks[stage] = new AuthStack(this, `AuthStack-${stage}`, {
        stage,
      });
    });

    const lambda = new LambdaStack(this, "LambdaStack", {
      auth: authStacks,
      db: dbStacks,
      stages,
    });

    const api = new ApiStack(this, "ApiStack", {
      auth: authStacks,
      stages,
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
