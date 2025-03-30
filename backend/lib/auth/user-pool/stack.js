const { Stack, CfnOutput, RemovalPolicy, Duration } = require("aws-cdk-lib");
const {
  UserPool,
  VerificationEmailStyle,
  AccountRecovery,
  StringAttribute,
  OAuthScope,
  UserPoolDomain,
} = require("aws-cdk-lib/aws-cognito");

const ResourceServersStack = require("./resource-servers/stack");
const CustomMessageConstruct = require("../../lambda/auth/custom-message/construct");

class UserPoolStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { envName } = props;

    // Create the custom message Lambda function
    const customMessageLambda = new CustomMessageConstruct(
      this,
      "CustomMessageLambda",
      {
        appUrl: process.env.SITE_URL || "https://dbcxhkl1jwg4u.cloudfront.net",
      }
    );

    this.pool = new UserPool(this, `UserPool`, {
      selfSignUpEnabled: true,
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      keepOriginal: {
        email: true,
      },
      signInCaseSensitive: false,
      userVerification: {
        emailSubject: "Verify you email",
        emailBody:
          "Thanks for signing up to our awesome app! Your verification code is {####}. This code is valid for 24 hours.",
        emailStyle: VerificationEmailStyle.CODE,
      },
      lambdaTriggers: {
        customMessage: customMessageLambda.function,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      standardAttributes: {
        email: {
          required: true,
          mutable: false,
        },
      },
      customAttributes: {
        businessName: new StringAttribute({ mutable: true }),
        userGroup: new StringAttribute({ mutable: false }),
      },
      removalPolicy: RemovalPolicy.RETAIN, // Default to RETAIN for safety
    });

    // Grant the custom message Lambda permission to be invoked by Cognito
    this.pool.addTrigger(
      "CustomMessage",
      customMessageLambda.function
    );

    // Create Cognito domain
    this.domain = new UserPoolDomain(this, "UserPoolDomain", {
      userPool: this.pool,
      cognitoDomain: {
        domainPrefix: `super-deals-${envName}`,
      },
    });

    // Create app client with OAuth scopes
    this.poolClient = this.pool.addClient(`UserPoolClient`, {
      generateSecret: true,
      authFlows: {
        userPassword: true,
        adminUserPassword: true,
      },
      accessTokenValidity: Duration.hours(8),
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [OAuthScope.OPENID, OAuthScope.EMAIL, OAuthScope.PROFILE],
        callbackUrls: ["http://localhost:5173"],
      },
      preventUserExistenceErrors: true,
    });

    /*** Resource Servers ***/
    this.resourceServers = new ResourceServersStack(
      this,
      "ResourceServersStack",
      {
        userPool: this.pool,
        envName,
      }
    );

    /*** Outputs ***/
    new CfnOutput(this, `UserPoolId`, {
      value: this.pool.userPoolId,
      description: "Cognito user pool ID used by the web client's auth service",
      exportName: `UserPoolId`,
    });

    new CfnOutput(this, `UserPoolClientId`, {
      value: this.poolClient.userPoolClientId,
      description:
        "Cognito user pool client ID used by the web client's auth service",
      exportName: `UserPoolClientId`,
    });

    new CfnOutput(this, `UserPoolDomainName`, {
      value: this.domain.domainName,
      description: "Cognito domain for OAuth flows",
      exportName: `UserPoolDomainName`,
    });

    new CfnOutput(this, `IdentityPoolId`, {
      value: this.resourceServers.identityPool.identityPoolId,
      description: "Cognito identity pool ID",
      exportName: `IdentityPoolId`,
    });
  }
}

module.exports = UserPoolStack;
