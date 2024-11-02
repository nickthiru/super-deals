const { Stack } = require("aws-cdk-lib");
const { Model, RequestValidator } = require("aws-cdk-lib/aws-apigateway");
const { jsonSchema } = require("#schemas/deal.schema.js");

class SharedResourcesStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'SharedResourcesStack'");

    const { apiStack } = props;

    this.dealModel = new Model(this, 'DealModel', {
      restApi: apiStack.http.restApi,
      contentType: 'application/json',
      description: 'Validation model for deals',
      schema: jsonSchema
    });

    this.dealRequestValidator = new RequestValidator(this, 'DealRequestValidator', {
      restApi: apiStack.http.restApi,
      validateRequestBody: true,
      validateRequestParameters: false
    });
  }
}

module.exports = { SharedResourcesStack };