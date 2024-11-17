const { Construct } = require("constructs");
// const { CfnOutput } = require("aws-cdk-lib");
const { RestApi, Deployment, Stage, Cors, CognitoUserPoolsAuthorizer, AuthorizationType } = require("aws-cdk-lib/aws-apigateway");


class MerchantHttpConstruct extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);
    console.log("(+) Inside 'MerchantHttpConstruct'");

    const {
      // auth,
      lambda
    } = props;

    /*** API ***/

    this.restApi = new RestApi(this, "RestApi", {
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
      deployment: deployment,
      stageName: "dev",
    });


    /*** Outputs ***/

    // new CfnOutput(this, "", {
    //   value: ``,
    //   description: " dev stage URL",
    //   exportName: ""
    // });
  }
}

module.exports = { MerchantHttpConstruct };