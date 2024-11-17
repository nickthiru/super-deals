const { Stack } = require('aws-cdk-lib');
const { DbStack } = require('./db/stack');
const { ApiStack } = require('./api/stack');
const { StorageStack } = require('./storage/stack');
const { LambdaStack } = require('./lambda/stack');

// const { DealServiceStack } = require('./domains/deal/stack');


class BackendStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'BackendStack'");


    /*** Utilities ***/

    // const auth = new AuthStack(this, "AuthStack");

    const storage = new StorageStack(this, "StorageStack");

    const db = new DbStack(this, "DbStack");

    const lambda = new LambdaStack(this, "LambdaStack", {
      storage,
      db,
    });

    const api = new ApiStack(this, "ApiStack", {
      // auth,
      lambda
    });


    /*** Workflows ***/

    // new DealServiceStack(this, "DealServiceStack", {
    //   storage,
    //   db,
    //   api,
    // });
  }
}

module.exports = { BackendStack }
