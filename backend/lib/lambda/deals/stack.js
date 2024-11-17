const { Stack } = require("aws-cdk-lib");
const { CreateDealContruct } = require("./create-deal/construct");

class DealsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'DealsStack'");

    const {
      storage,
      db,
    } = props;


    this.createDeal = new CreateDealContruct(this, "CreateDealContruct", {
      storage,
      db,
    });
  }
}

module.exports = { DealsStack };