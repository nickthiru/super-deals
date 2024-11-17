const { Construct } = require('constructs');
const { Model, RequestValidator } = require("aws-cdk-lib/aws-apigateway");
const { jsonSchema } = require("#schemas/create-deal-form.schema.js");

class DealValidations extends Construct {
  constructor(scope, id, props) {
    super(scope, id);
    console.log("(+) Inside 'DealValidations'");


    const { restApi } = props;

    this.model = new Model(this, 'CreateDealForm_Model', {
      restApi: restApi,
      contentType: 'application/json',
      description: 'Validation model for create deals form',
      schema: jsonSchema
    });

    this.requestValidator = new RequestValidator(this, 'CreateDealForm_RequestValidator', {
      restApi: restApi,
      validateRequestBody: true,
      validateRequestParameters: false
    });
  }
}

module.exports = { DealValidations };