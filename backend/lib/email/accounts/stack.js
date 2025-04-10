const { Stack } = require("aws-cdk-lib");
const { WelcomeEmailConstruct } = require("./welcome-email/merchant/construct");

class AccountsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.welcomeEmail = new WelcomeEmailConstruct(
      this,
      "WelcomeEmailConstruct",
      {}
    );
  }
}

module.exports = { AccountsStack };
