const { Stack } = require("aws-cdk-lib");
const {
  CustomSignUpEmailConstruct,
} = require("./custom-sign-up-email/construct");
const {
  PasswordResetEmailConstruct,
} = require("./password-reset-email/construct");

class AccountsStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.customSignUpEmail = new CustomSignUpEmailConstruct(
      this,
      "CustomSignUpEmailConstruct",
      {}
    );

    this.passwordResetEmail = new PasswordResetEmailConstruct(
      this,
      "PasswordResetEmailConstruct",
      {}
    );
  }
}

module.exports = { AccountsStack };
