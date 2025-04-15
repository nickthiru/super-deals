const { Construct } = require("constructs");

const PostConstruct = require("./post/construct");

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
  }
}

module.exports = AccountsConstruct;
