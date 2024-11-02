const { Stack } = require('aws-cdk-lib');
const { DbStack } = require('./utils/db/stack');
const { ApiStack } = require('./utils/api/stack');
const { DealServiceStack } = require('./domains/deal/stack');
const { StorageStack } = require('./utils/storage/stack');

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

    const storage = new StorageStack(this, "StorageStack");

    const db = new DbStack(this, "DbStack");

    const api = new ApiStack(this, "ApiStack");


    /*** Services ***/

    new DealServiceStack(this, "DealServiceStack", {
      storage,
      db,
      api,
    });
  }
}

module.exports = { BackendStack }
