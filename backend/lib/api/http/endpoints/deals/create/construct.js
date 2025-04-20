const { Construct } = require("constructs");
const { LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");
const { Model, RequestValidator } = require("aws-cdk-lib/aws-apigateway");

const schema = require("./schema.js");

class CreateConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { lambda, http, dealsResource } = props;

    const model = new Model(this, `Model`, {
      restApi: http.restApi,
      contentType: "application/json",
      description: "Validation model for create deals form",
      schema,
    });

    const requestValidator = new RequestValidator(this, `RequestValidator`, {
      restApi: http.restApi,
      validateRequestBody: true,
      validateRequestParameters: false,
    });

    dealsResource.addMethod(
      "POST",
      new LambdaIntegration(lambda.merchants.deals.create.lambda),
      {
        operationName: "CreateDeal",
        requestValidator,
        requestModels: {
          "application/json": model,
        },
        ...http.optionsWithAuth.writeDealsAuth, // Use write scope for deal creation
      }
    );
  }
}

module.exports = CreateConstruct;
