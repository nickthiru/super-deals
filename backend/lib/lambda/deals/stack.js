const { Stack } = require("aws-cdk-lib");
const { CreateConstruct } = require("./create/construct");

class DealsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      storage,
      db,
      OasOpIdsToLambdaArns,
    } = props;

    new CreateConstruct(this, "CreateConstruct", {
      storage,
      db,
      OasOpIdsToLambdaArns,
    });

    // deals.delete = {};
    // new CreateConstruct(this, "CreateConstruct", {
    //   storage,
    //   db,
    //   delete: deals.delete,
    // });
  }
}

module.exports = { DealsStack };