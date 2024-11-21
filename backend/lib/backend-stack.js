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
    console.log("(+) Inside 'BackendStack'");

    // const auth = new AuthStack(this, "AuthStack");

    const db = new DbStack(this, "DbStack");

    const storage = new StorageStack(this, "StorageStack");




    // const stages = ['dev', 'preprod'];

    // const storageStacks = {};
    // const dbStacks = {};

    // stages.forEach(stage => {

    //   storageStacks[stage] = new StorageStack(this, `StorageStack-${stage}`, { stage });

    //   dbStacks[stage] = new DbStack(this, `DbStack-${stage}`, { stage });
    // });

    // storageStacks["dev"] = new StorageStack(this, `StorageStack-dev`, { stage: "dev" });

    // dbStacks["dev"] = new DbStack(this, `DbStack-dev`, { stage: "dev" });

    // storageStacks["preprod"] = new StorageStack(this, `StorageStack-preprod`, { stage: "preprod" });

    // dbStacks["preprod"] = new DbStack(this, `DbStack-preprod`, { stage: "preprod" });


    // LambdaStack is shared
    const lambda = new LambdaStack(this, "LambdaStack", {
      storage,
      db,
    });

    // ApiStack is shared
    const api = new ApiStack(this, "ApiStack", {
      // auth,
      lambda
    });
  }
}

module.exports = { BackendStack }
