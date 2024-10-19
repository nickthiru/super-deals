const { Stack } = require('aws-cdk-lib');
const { DbStack } = require('./utils/db/stack');
const { ApiStack } = require('./utils/api/stack');
const { DealsServiceStack } = require('./domains/deals/stack');
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

    const storageStack = new StorageStack(this, "StorageStack");

    const dbStack = new DbStack(this, "DbStack");

    const apiStack = new ApiStack(this, "ApiStack");


    /*** Services ***/

    new DealsServiceStack(this, "DealsServiceStack", {
      storageStack,
      dbStack,
      apiStack,
    });


  }
}

module.exports = { BackendStack }
