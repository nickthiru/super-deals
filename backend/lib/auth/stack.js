const { Stack, CfnOutput, Duration } = require("aws-cdk-lib");
const { UserPool, VerificationEmailStyle, AccountRecovery, CfnUserPoolGroup, UserPoolOperation } = require("aws-cdk-lib/aws-cognito");


class AuthStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { stage } = props;

    this.userPool = new UserPool(this, `UserPool-${stage}`, {
      userPoolName: `UserPool-${stage}`,
      selfSignUpEnabled: true,
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
      signInAliases: {
        email: true
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
        emailBody: "Thanks for signing up to our awesome app! Your verification code is {####}. This code is valid for 24 hours.",
        emailStyle: VerificationEmailStyle.CODE,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      standardAttributes: {
        email: {
          required: true,
          mutable: false,
        }
      },
      customAttributes: {
        businessName: new StringAttribute({ mutable: true }),
        userGroup: new StringAttribute({ mutable: true })
      }
    });

    // const clientWriteAttributes = (new cognito.ClientAttributes())
    //   .withStandardAttributes({ fullname: true, email: true })
    //   .withCustomAttributes('favouritePizza', 'favouriteBeverage');

    // const clientReadAttributes = clientWriteAttributes
    //   .withStandardAttributes({ emailVerified: true })
    //   .withCustomAttributes('pointsEarned');

    // Create user groups
    this.createUserGroup("ConsumerGroup", "Consumer");
    this.createUserGroup("MerchantGroup", "Merchant");
    this.createUserGroup("AdminGroup", "Admin");

    this.userPoolClient = this.userPool.addClient(`UserPoolClient-${stage}`, {
      authFlows: { userPassword: true },
      accessTokenValidity: Duration.hours(8),
      // readAttributes: clientReadAttributes,
      // writeAttributes: clientWriteAttributes,
    });


    // // Create Lambda function for pre-sign-up logic
    // this.preSignUpFunction = new NodeJsFunction(this, "PreSignUpFunction", {
    //   runtime: Runtime.NODEJS_14_X,
    //   handler: "index.handler",
    //   code: Code.fromAsset("lambda"),
    // });

    // // Attach the Lambda function as a trigger to the User Pool
    // this.userPool.addTrigger(UserPoolOperation.PRE_SIGN_UP, this.preSignUpFunction);


    /*** Outputs ***/

    // For web client Auth service
    new CfnOutput(this, `UserPoolId-${stage}`, {
      value: this.userPool.userPoolId,
      description: "Cognito user pool ID used by the web client's auth service",
      exportName: `UserPoolId${stage}`
    });

    new CfnOutput(this, `UserPoolClientId-${stage}`, {
      value: this.userPoolClient.userPoolClientId,
      description: "Cognito user pool client ID used by the web client's auth service",
      exportName: `UserPoolClientId${stage}`
    });
  }

  createUserGroup(id, groupName) {
    new CfnUserPoolGroup(this, id, {
      userPoolId: this.userPool.userPoolId,
      groupName: groupName,
    });
  }
}

module.exports = { AuthStack };