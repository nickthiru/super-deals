const { Stack, CfnOutput, RemovalPolicy, Duration } = require("aws-cdk-lib");
const { UserPool, VerificationEmailStyle, AccountRecovery, CfnUserPoolGroup, UserPoolOperation, StringAttribute } = require("aws-cdk-lib/aws-cognito");

class UserPoolStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const {
      stage,
    } = props;

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
        userGroup: new StringAttribute({ mutable: false }),
        merchantId: new StringAttribute({ mutable: false }),
      },
      removalPolicy: stage === "prod" ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });

    // const clientWriteAttributes = (new cognito.ClientAttributes())
    //   .withStandardAttributes({ fullname: true, email: true })
    //   .withCustomAttributes('favouritePizza', 'favouriteBeverage');

    // const clientReadAttributes = clientWriteAttributes
    //   .withStandardAttributes({ emailVerified: true })
    //   .withCustomAttributes('pointsEarned');

    this.poolClient = this.pool.addClient(`UserPoolClient`, {
      authFlows: { userPassword: true },
      accessTokenValidity: Duration.hours(8),
      // readAttributes: clientReadAttributes,
      // writeAttributes: clientWriteAttributes,
    });


    // // Create Lambda function for pre-sign-up logic
    // const preSignUpFunction = new LambdaConstruct(this, "PreSignUpFunction");

    // // Attach the Lambda function as a trigger to the User Pool
    // this.pool.addTrigger(UserPoolOperation.PRE_SIGN_UP, preSignUpFunction);


    /*** Outputs ***/

    // For web client Auth service
    new CfnOutput(this, `UserPoolId`, {
      value: this.pool.userPoolId,
      description: "Cognito user pool ID used by the web client's auth service",
      exportName: `UserPoolId`
    });

    new CfnOutput(this, `UserPoolClientId`, {
      value: this.poolClient.userPoolClientId,
      description: "Cognito user pool client ID used by the web client's auth service",
      exportName: `UserPoolClientId`
    });
  }
}

module.exports = UserPoolStack;