const { Stack } = require("aws-cdk-lib");
const { RestApi, Cors, CognitoUserPoolsAuthorizer, AuthorizationType } = require("aws-cdk-lib/aws-apigateway");
const { StageConstruct } = require("./stage/construct");
const { EndpointsConstruct } = require("./endpoints/construct");


class HttpStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      auth,
      storage,
      db,
    } = props;


    /*** HTTP API ***/

    const restApi = new RestApi(this, "RestApi", {
      deploy: false,  // Disable automatic stage creation i.e. prod
      binaryMediaTypes: ["multipart/form-data"],
      cloudWatchRole: true,
    });

    // Stages
    const stages = ['dev', 'preprod'];

    stages.forEach(stage => {
      new StageConstruct(this, `StageConstruct-${stage}`, {
        api: restApi,
        stageName: stage,
      });
    });


    /*** Authorizer ***/

    // const authorizer = new CognitoUserPoolsAuthorizer(this, "CognitoUserPoolsAuthorizer", {
    //   cognitoUserPools: [auth.userPool],
    //   identitySource: "method.request.header.Authorization",
    // });
    // authorizer._attachToApi(restApi);

    // Attach this to each root-level Resource
    const optionsWithCors = {
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


    /*** Endpoints ***/

    new EndpointsConstruct(this, "EndpointsConstruct", {
      auth,
      storage,
      db,
      http: {
        restApi,
        optionsWithCors,
      }
    });
  }
}

module.exports = { HttpStack };