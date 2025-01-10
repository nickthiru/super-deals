const { Stack } = require("aws-cdk-lib");
const { RestApi, EndpointType, Cors, CognitoUserPoolsAuthorizer, AuthorizationType, MethodLoggingLevel } = require("aws-cdk-lib/aws-apigateway");

const StageConstruct = require("./stage/construct");
const EndpointsConstruct = require("./endpoints/construct");
const AuthorizationConstruct = require("./authorization/construct");

/**
 * @typedef {Object} HttpStackProps
 * @property {string} stage - Stage name (e.g., 'dev', 'prod')
 * @property {import('../../auth/stack').AuthStack} auth - Auth stack
 * @property {import('../../lambda/stack').LambdaStack} lambda - Lambda stack
 * @property {import('../../permissions/stack').PermissionsStack} permissions - Permissions stack
 */

/**
 * Stack for managing HTTP API Gateway
 * Handles API endpoints, authorization, and stages
 */
class HttpStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      stage,
      auth,
      lambda,
      permissions,
    } = props;

    /*** HTTP API ***/

    this.restApi = new RestApi(this, "RestApi", {
      description: "API Gateway for the application",
      endpointTypes: [EndpointType.REGIONAL],
      deploy: false,  // Disable automatic stage creation i.e. prod
      // binaryMediaTypes: ["multipart/form-data"],
      cloudWatchRole: true,
    });

    // Stages
    new StageConstruct(this, `StageConstruct-${stage}`, {
      api: this.restApi,
      stageName: stage,
    });

    /*** Authorization ***/
    const authorization = new AuthorizationConstruct(this, 'Authorization', {
      restApi: this.restApi,
      auth,
      permissions,
    });

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
        optionsWithAuth: authorization.authOptions.deals,
      }
    });
  }
}

module.exports = HttpStack;