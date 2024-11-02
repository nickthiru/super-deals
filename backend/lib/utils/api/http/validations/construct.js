const { Construct } = require("constructs");
const { DealValidations } = require("./deal/construct");


class ValidationsStack extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'ValidationsStack'");

    const {
      restApi
    } = props;

    this.deal = new DealValidations(this, 'DealValidations', {
      restApi: restApi
    });

  }
}

module.exports = { ValidationsStack };