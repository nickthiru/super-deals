const { Construct } = require("constructs");

const SendWelcomeEmailConstruct = require("./send-welcome-email/construct");

class SendWelcomeEmailConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { services, accountsResource } = props;

    const sendWelcomeEmailResource = accountsResource.addResource(
      "send-welcome-email",
      http.optionsWithCors
    );

    sendWelcomeEmailResource.addMethod(
      "POST",
      new LambdaIntegration(services.accounts.sendWelcomeEmail.function),
      {
        operationName: "SendWelcomeEmail",
      }
    );
  }
}

module.exports = SendWelcomeEmailConstruct;
