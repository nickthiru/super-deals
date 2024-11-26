const { Stack } = require('aws-cdk-lib');
const { DbStack } = require('./db/stack');
const { StorageStack } = require('./storage/stack');
const { LambdaStack } = require('./lambda/stack');
const { ApiStack } = require('./api/stack');
const { AuthStack } = require('./auth/stack');

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

    stages.forEach(stage => {

      dbStacks[stage] = new DbStack(this, `DbStack-${stage}`, { stage });

      storageStacks[stage] = new StorageStack(this, `StorageStack-${stage}`, { stage });
    });


    const auth = new AuthStack(this, "AuthStack");

    const lambda = new LambdaStack(this, "LambdaStack", {
      storage: storageStacks,
      db: dbStacks,
    });

    new ApiStack(this, "ApiStack", {
      // auth,
      lambda
    });
  }
}

module.exports = { BackendStack }
