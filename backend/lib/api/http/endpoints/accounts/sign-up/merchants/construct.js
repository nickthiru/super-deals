const { Construct } = require("constructs");

const PostConstruct = require("./post/construct");

class MerchantsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { http, services, signUpResource } = props;

    const merchantsResource = signUpResource.addResource(
      "merchants",
      http.optionsWithCors
    );

    new PostConstruct(this, "PostConstruct", {
      http,
      services,
      merchantsResource,
    });
  }
}

module.exports = MerchantsConstruct;
