const { Stack, CfnOutput, Fn } = require("aws-cdk-lib");
const { RestApi, Deployment, Stage, Cors, CognitoUserPoolsAuthorizer, AuthorizationType } = require("aws-cdk-lib/aws-apigateway");
const { EndpointsConstruct } = require("./endpoints/construct");


class HttpStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'HttpStack'");

    const {
      // auth,
      lambda,
    } = props;


    /*** HTTP API ***/

    this.restApi = new RestApi(this, "RestApi", {
      deploy: false,  // Disable automatic stage creation
      binaryMediaTypes: [
        "multipart/form-data",
      ]
    });

    // this.validations = new ValidationsStack(this, 'ValidationsStack', {
    //   restApi: this.restApi
    // });

    // const authorizer = new CognitoUserPoolsAuthorizer(this, "CognitoUserPoolsAuthorizer", {
    //   cognitoUserPools: [authStack.consumerUserPool],
    //   identitySource: "method.request.header.Authorization",
    // });
    // authorizer._attachToApi(restApi);

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

    const deployment = new Deployment(this, "Deployment", {
      api: this.restApi,
    });

    // Stages
    const devStage = new Stage(this, "dev", {
      deployment,
      stageName: "dev",
    });

    const preprodStage = new Stage(this, "preprod", {
      deployment,
      stageName: "preprod",
    });

    // Set the default deployment stage
    this.restApi.deploymentStage = devStage;


    /*** Outputs ***/

    // Manually construct the URLs
    const devStageUrl = Fn.join("", [
      `https://`,
      this.restApi.restApiId,
      `.execute-api.`,
      this.restApi.env.region,
      `.amazonaws.com/`,
      devStage.stageName,
      `/`
    ]);

    const preprodStageUrl = Fn.join("", [
      `https://`,
      this.restApi.restApiId,
      `.execute-api.`,
      this.restApi.env.region,
      `.amazonaws.com/`,
      preprodStage.stageName,
      `/`
    ]);

    new CfnOutput(this, 'DevStageUrl', {
      value: devStageUrl,
      description: "The URL of the dev stage of the HTTP API",
    });

    new CfnOutput(this, 'PreprodStageUrl', {
      value: preprodStageUrl,
      description: "The URL of the preprod stage of the HTTP API",
    });


    /*** Endpoints ***/


    new EndpointsConstruct(this, "EndpointsConstruct", {
      lambda,
      http,
    });
  }
}

module.exports = { HttpStack };