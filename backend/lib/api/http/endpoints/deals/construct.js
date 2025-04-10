const { Construct } = require("constructs");

const CreateConstruct = require("./create/construct");
// const DeleteConstruct = require("./delete/construct");

class DealsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { lambda, http, merchantsResource } = props;

    const dealsResource = merchantsResource.addResource(
      "deals",
      http.optionsWithCors
    );

    new CreateConstruct(this, "CreateConstruct", {
      lambda,
      http,
      dealsResource,
    });

    // new DeleteConstruct(this, "DeleteConstruct", {
    //   lambda,
    //   dealsResource,
    // });
  }
}

module.exports = DealsConstruct;
