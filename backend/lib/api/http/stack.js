const { Stack } = require("aws-cdk-lib");
const { RestApi, Cors, CognitoUserPoolsAuthorizer, AuthorizationType } = require("aws-cdk-lib/aws-apigateway");

const StageConstruct = require("./stage/construct");
const EndpointsConstruct = require("./endpoints/construct");

class HttpStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      stage,
      auth,
      lambda,
    } = props;


    /*** HTTP API ***/

    this.restApi = new RestApi(this, "RestApi", {
      deploy: false,  // Disable automatic stage creation i.e. prod
      // binaryMediaTypes: ["multipart/form-data"],
      cloudWatchRole: true,
    });

    // Stages
    new StageConstruct(this, `StageConstruct-${stage}`, {
      api: this.restApi,
      stageName: stage,
    });

    /*** Authorizer ***/

    const authorizer = new CognitoUserPoolsAuthorizer(this, "CognitoUserPoolsAuthorizer", {
      cognitoUserPools: [auth.userPool.pool],
      identitySource: "method.request.header.Authorization",
    });
    authorizer._attachToApi(this.restApi);

    // For any Resource that requires authenticated access, attach this to each Method endpoint. 
    const optionsWithAuth = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };


    /*** CORS ***/

    // Attach this to each root-level Resource
    const optionsWithCors = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS
      }
    };


    /*** Endpoints ***/

    new EndpointsConstruct(this, "EndpointsConstruct", {
      lambda,
      http: {
        restApi: this.restApi,
        optionsWithCors,
        optionsWithAuth,
      }
    });
  }
}

module.exports = HttpStack;