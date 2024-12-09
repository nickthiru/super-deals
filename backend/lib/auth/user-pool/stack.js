const { Stack, CfnOutput, Duration } = require("aws-cdk-lib");
const { UserPool, VerificationEmailStyle, AccountRecovery, CfnUserPoolGroup, UserPoolOperation, StringAttribute } = require("aws-cdk-lib/aws-cognito");
const { LambdaConstruct } = require("./pre-sign-up/lambda");


class UserPoolStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { stage } = props;

    this.pool = new UserPool(this, `UserPool-${stage}`, {
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

    this.poolClient = this.pool.addClient(`UserPoolClient-${stage}`, {
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
    new CfnOutput(this, `UserPoolId-${stage}`, {
      value: this.pool.userPoolId,
      description: "Cognito user pool ID used by the web client's auth service",
      exportName: `UserPoolId${stage}`
    });

    new CfnOutput(this, `UserPoolClientId-${stage}`, {
      value: this.poolClient.userPoolClientId,
      description: "Cognito user pool client ID used by the web client's auth service",
      exportName: `UserPoolClientId${stage}`
    });
  }

  createUserGroup(id, groupName) {
    new CfnUserPoolGroup(this, id, {
      userPoolId: this.pool.userPoolId,
      groupName: groupName,
    });
  }
}

module.exports = { UserPoolStack };