const { Stack } = require("aws-cdk-lib");

const CreateConstruct = require("./create/construct");

class DealsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      db,
    } = props;

    this.create = new CreateConstruct(this, "CreateConstruct", {
      db,
    });
  }
}

module.exports = DealsStack;