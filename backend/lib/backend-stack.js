const { Stack } = require('aws-cdk-lib');
const { DbStack } = require('./db/stack');
const { StorageStack } = require('./storage/stack');
const { LambdaStack } = require('./lambda/stack');
const { ApiStack } = require('./api/stack');

class BackendStack extends Stack {
  /**
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // // const auth = new AuthStack(this, "AuthStack");

    // Staged Resources
    const stages = ['dev', 'preprod'];

    const storageStacks = {};
    const dbStacks = {};

    stages.forEach(stage => {

      dbStacks[stage] = new DbStack(this, `DbStack-${stage}`, { stage });

      storageStacks[stage] = new StorageStack(this, `StorageStack-${stage}`, { stage });
    });


    // LambdaStack is shared
    const lambda = new LambdaStack(this, "LambdaStack", {
      storage: storageStacks,
      db: dbStacks,
    });

    // ApiStack is shared
    new ApiStack(this, "ApiStack", {
      // auth,
      lambda
    });
  }
}

module.exports = { BackendStack }
