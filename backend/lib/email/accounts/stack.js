const { Stack } = require("aws-cdk-lib");
const {
  CustomSignUpEmailConstruct,
} = require("./custom-sign-up-email/construct");

class AccountsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.customSignUpEmail = new CustomSignUpEmailConstruct(
      this,
      "CustomSignUpEmailConstruct",
      {}
    );
  }
}

module.exports = { AccountsStack };
