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
const SendWelcomeEmailConstruct = require("../../services/accounts/send-welcome-email/construct");

class UserPoolStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { envName, email, monitor } = props;

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
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      standardAttributes: {
        email: {
          required: true,
          mutable: false,
        },
      },
      customAttributes: {
        userType: new StringAttribute({ mutable: false }),
      },
      removalPolicy: RemovalPolicy.RETAIN, // Default to RETAIN for safety
    });

    this.domain = new UserPoolDomain(this, "UserPoolDomain", {
      userPool: this.pool,
      cognitoDomain: {
        domainPrefix: `super-deals-${envName}`,
      },
    });

    const customMessageLambda = new SendCustomSignUpMessageConstruct(
      this,
      "CustomMessageLambda",
      {
        appUrl: process.env.SITE_URL || "https://dbcxhkl1jwg4u.cloudfront.net",
        email,
        userPool: this.pool,
      }
    );

    const welcomeEmailLambda = new SendWelcomeEmailConstruct(
      this,
      "WelcomeEmailLambda",
      {
        appUrl: process.env.SITE_URL || "https://dbcxhkl1jwg4u.cloudfront.net",
        email,
        userPool: this.pool,
        configurationSetName: monitor.ses.configurationSetName,
      }
    );

    this.pool.addTrigger(
      UserPoolOperation.CUSTOM_MESSAGE,
      customMessageLambda.lambda
    );

    this.pool.addTrigger(
      UserPoolOperation.POST_CONFIRMATION,
      welcomeEmailLambda.lambda
    );

    this.poolClient = this.pool.addClient(`UserPoolClient`, {
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

    this.resourceServers = new ResourceServersStack(
      this,
      "ResourceServersStack",
      {
        userPool: this.pool,
        envName,
      }
    );

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
  }
}

module.exports = UserPoolStack;
