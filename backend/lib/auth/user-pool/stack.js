const { Stack, CfnOutput, RemovalPolicy, Duration } = require("aws-cdk-lib");
const {
  UserPool,
  VerificationEmailStyle,
  AccountRecovery,
  StringAttribute,
  OAuthScope,
  UserPoolDomain,
  UserPoolOperation,
} = require("aws-cdk-lib/aws-cognito");

const ResourceServersStack = require("./resource-servers/stack");
const SendCustomSignUpMessageConstruct = require("../../services/accounts/send-custom-sign-up-message/construct");

class UserPoolStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { envName, email } = props;

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
        emailSubject: "Super Deals: Email Verification",
        emailBody:
          "Thanks for signing up to our awesome app! Your verification code is {####}. This code is valid for 24 hours.",
        emailStyle: VerificationEmailStyle.CODE,
      },
      // Lambda triggers will be added after the pool is created
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      standardAttributes: {
        email: {
          required: true,
          mutable: false,
        },
      },
      customAttributes: {
        // Only keep essential attributes in Cognito
        // Store the rest in DynamoDB
        userType: new StringAttribute({ mutable: false }),
      },
      removalPolicy: RemovalPolicy.RETAIN, // Default to RETAIN for safety
    });

    // Create Cognito domain
    this.domain = new UserPoolDomain(this, "UserPoolDomain", {
      userPool: this.pool,
      cognitoDomain: {
        domainPrefix: `super-deals-${envName}`,
      },
    });

    // Create the custom message Lambda function now that we have the UserPool
    const customMessageLambda = new SendCustomSignUpMessageConstruct(
      this,
      "CustomMessageLambda",
      {
        appUrl: process.env.SITE_URL || "https://dbcxhkl1jwg4u.cloudfront.net",
        email,
        userPool: this.pool,
      }
    );

    // Add the Lambda trigger to the UserPool
    this.pool.addTrigger(UserPoolOperation.CUSTOM_MESSAGE, customMessageLambda.lambda);

    // Create app client with OAuth scopes
    this.poolClient = this.pool.addClient(`UserPoolClient`, {
      // generateSecret: true,
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

    // Remove or comment out the IdentityPoolId output since it doesn't exist yet
    // We'll need to implement the identity pool before using this
    /*
    new CfnOutput(this, `IdentityPoolId`, {
      value: this.resourceServers.identityPool.identityPoolId,
      description: "Cognito identity pool ID",
      exportName: `IdentityPoolId`,
    });
    */
  }
}

module.exports = UserPoolStack;
