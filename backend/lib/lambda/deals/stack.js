const { Stack } = require("aws-cdk-lib");
const { CreateContruct } = require("./create/construct");

class DealsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      storage,
      db,
    } = props;


    this.create = new CreateContruct(this, "CreateContruct", {
      storage,
      db,
    });
  }
}

module.exports = { DealsStack };