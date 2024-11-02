const { Stack, CfnOutput } = require("aws-cdk-lib");
const { RestApi, Deployment, Stage, Cors, CognitoUserPoolsAuthorizer, AuthorizationType, Model, RequestValidator } = require("aws-cdk-lib/aws-apigateway");
const { jsonSchema } = require("#schemas/deal.schema.js");
const { DealsValidationStack } = require("./validations/deals/stack");
// const { AccountApiEndpointsStack } = require("./api-endpoints/account-endpoints-stack");
// const { DeviceApiEndpointsStack } = require("./api-endpoints/device-endpoints-stack");


class HttpStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'HttpStack'");

    // const {
    // } = props;


    /*** API ***/

    this.restApi = new RestApi(this, "RestApi", {
      binaryMediaTypes: [
        "multipart/form-data",
      ]
    });

    // const authorizer = new CognitoUserPoolsAuthorizer(this, "CognitoUserPoolsAuthorizer", {
    //   cognitoUserPools: [authStack.consumerUserPool],
    //   identitySource: "method.request.header.Authorization",
    // });
    // authorizer._attachToApi(restApi);

    // Create shared resources
    this.dealModel = new Model(this, 'DealModel', {
      restApi: this.restApi,
      contentType: 'application/json',
      description: 'Validation model for deals',
      schema: jsonSchema
    });

    this.dealRequestValidator = new RequestValidator(this, 'DealRequestValidator', {
      restApi: this.restApi,
      validateRequestBody: true,
      validateRequestParameters: false
    });

    // this.dealsValidationStack = new DealsValidationStack(this, "DealsValidationStack", {
    //   restApi: this.restApi,
    // });

    // Attach this to each root-level Resource
    this.optionsWithCors = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS
      }
    };

    // For any Resource that requires authenticated access, attach this to each Method endpoint. 
    // this.optionsWithAuth = {
    //   authorizationType: AuthorizationType.COGNITO,
    //   authorizer: {
    //     authorizerId: authorizer.authorizerId,
    //   },
    // };

    // const deployment = new Deployment(this, "Deployment", {
    //   api: restApi,
    // });


    // Stages

    // const devStage = new Stage(this, "dev", {
    //   deployment: deployment,
    //   stageName: "dev",
    // });


    /*** Outputs ***/

    // new CfnOutput(this, "", {
    //   value: ``,
    //   description: " dev stage URL",
    //   exportName: ""
    // });
  }
}

module.exports = { HttpStack };