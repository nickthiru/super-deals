const { Construct } = require("constructs");
const { LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");

class SendWelcomeEmailConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { http, services, accountsResource } = props;

    const sendWelcomeEmailResource = accountsResource.addResource(
      "send-welcome-email",
      http.optionsWithCors
    );

    sendWelcomeEmailResource.addMethod(
      "POST",
      new LambdaIntegration(services.accounts.sendWelcomeEmail.lambda),
      {
        operationName: "SendWelcomeEmail",
      }
    );
  }
}

module.exports = SendWelcomeEmailConstruct;
