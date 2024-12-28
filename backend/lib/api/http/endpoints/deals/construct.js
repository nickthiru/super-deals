const { Construct } = require("constructs");

const CreateConstruct = require("./create/construct");

class DealsConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      lambda,
      http,
    } = props;


    const dealsResource = http.restApi.root.addResource("deals", http.optionsWithCors);

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