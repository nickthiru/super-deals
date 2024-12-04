const { Stack } = require('aws-cdk-lib');
const { DbStack } = require('./db/stack');
const { StorageStack } = require('./storage/stack');
// const { LambdaStack } = require('./lambda/stack');
const { ApiStack } = require('./api/stack');
const { AuthStack } = require('./auth/stack');
const { PolicyStack } = require('./policy/stack');

class BackendStack extends Stack {
  /**
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // Staged Resources
    const stages = ['dev', 'preprod'];

    const storageStacks = {};
    const dbStacks = {};
    const authStacks = {};

    stages.forEach(stage => {
      dbStacks[stage] = new DbStack(this, `DbStack-${stage}`, { stage });

      storageStacks[stage] = new StorageStack(this, `StorageStack-${stage}`, { stage });

      authStacks[stage] = new AuthStack(this, `AuthStack-${stage}`, { stage });
    });

    // const lambda = new LambdaStack(this, "LambdaStack", {
    // });

    const api = new ApiStack(this, "ApiStack", {
      stages,
      auth: authStacks,
      storage: storageStacks,
      db: dbStacks,
    });

    // Note that the Amazon Verified Permissions may not be included in the free-tier AWS account
    new PolicyStack(this, "PolicyStack", {
      auth: authStacks,
      api,
    });
  }
}

module.exports = { BackendStack }
