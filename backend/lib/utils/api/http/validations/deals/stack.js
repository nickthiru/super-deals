const { Stack, CfnOutput } = require("aws-cdk-lib");
const { Model, RequestValidator } = require("aws-cdk-lib/aws-apigateway");
const { jsonSchema } = require("#schemas/deal.schema.js");


class DealsValidationStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'DealsValidationStack'");

    const {
      restApi,
    } = props;

    this.model = new Model(this, 'DealModel', {
      restApi: restApi,
      contentType: 'application/json',
      description: 'Validation model for deals',
      schema: jsonSchema
    });

    this.requestValidator = new RequestValidator(this, 'DealRequestValidator', {
      restApi: restApi,
      validateRequestBody: true,
      validateRequestParameters: false
    });
  }
}

module.exports = { DealsValidationStack };