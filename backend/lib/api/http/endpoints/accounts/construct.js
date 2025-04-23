const { Construct } = require("constructs");

const PostConstruct = require("./post/construct");
const SendWelcomeEmailConstruct = require("./send-welcome-email/construct");

class AccountsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { http, services } = props;

    const accountsResource = http.restApi.root.addResource(
      "accounts",
      http.optionsWithCors
    );

    // new SignUpConstruct(this, "SignUpConstruct", {
    //   http,
    //   services,
    //   accountsResource,
    // });

    new PostConstruct(this, "PostConstruct", {
      http,
      services,
      accountsResource,
    });

    // new SendWelcomeEmailConstruct(this, "SendWelcomeEmailConstruct", {
    //   http,
    //   services,
    //   accountsResource,
    // });
  }
}

module.exports = AccountsConstruct;
