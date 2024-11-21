const { Stack, CfnOutput, Fn } = require("aws-cdk-lib");
const { RestApi, Deployment, Stage, Cors, CognitoUserPoolsAuthorizer, AuthorizationType } = require("aws-cdk-lib/aws-apigateway");
const { EndpointsConstruct } = require("./endpoints/construct");


class HttpStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      // auth,
      lambda,
    } = props;


    /*** HTTP API ***/

    const restApi = new RestApi(this, "RestApi", {
      deploy: false,  // Disable automatic stage creation i.e. prod
      binaryMediaTypes: ["multipart/form-data"],
    });

    // Stages
    const stages = ['dev', 'preprod'];

    stages.forEach(stage => {
      const deployment = new Deployment(this, `Deployment-${stage}`, {
        api: restApi,
      });

      const apiStage = new Stage(this, `Stage-${stage}`, {
        deployment,
        stageName: stage,
      });

      // // Manually construct the URLs
      // const stageUrl = Fn.join("", [
      //   `https://`,
      //   restApi.restApiId,
      //   `.execute-api.`,
      //   restApi.env.region,
      //   `.amazonaws.com/`,
      //   devStage.stageName,
      //   `/`
      // ]);

      // // Output the stage-specific URL
      // new CfnOutput(this, 'DevStageUrl', {
      //   value: devStageUrl,
      //   description: "The URL of the dev stage of the HTTP API",
      // });

      // Output the stage-specific URL
      new CfnOutput(this, `RestApiEndpoint-${stage}`, {
        value: apiStage.urlForPath(),
        exportName: `RestApiEndpoint-${stage}`,
      });
    });

    // Set the default deployment stage
    restApi.deploymentStage = devStage;


    /*** Authorizer ***/

    // const authorizer = new CognitoUserPoolsAuthorizer(this, "CognitoUserPoolsAuthorizer", {
    //   cognitoUserPools: [authStack.consumerUserPool],
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


    /*** Outputs ***/

    // // Manually construct the URLs
    // const devStageUrl = Fn.join("", [
    //   `https://`,
    //   restApi.restApiId,
    //   `.execute-api.`,
    //   restApi.env.region,
    //   `.amazonaws.com/`,
    //   devStage.stageName,
    //   `/`
    // ]);

    // const preprodStageUrl = Fn.join("", [
    //   `https://`,
    //   restApi.restApiId,
    //   `.execute-api.`,
    //   restApi.env.region,
    //   `.amazonaws.com/`,
    //   preprodStage.stageName,
    //   `/`
    // ]);

    // new CfnOutput(this, 'DevStageUrl', {
    //   value: devStageUrl,
    //   description: "The URL of the dev stage of the HTTP API",
    // });

    // new CfnOutput(this, 'PreprodStageUrl', {
    //   value: preprodStageUrl,
    //   description: "The URL of the preprod stage of the HTTP API",
    // });


    /*** Endpoints ***/


    new EndpointsConstruct(this, "EndpointsConstruct", {
      lambda,
      http: {
        restApi,
        optionsWithCors
      }
    });
  }
}

module.exports = { HttpStack };