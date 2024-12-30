const { CognitoIdentityProviderClient, InitiateAuthCommand } = require("@aws-sdk/client-cognito-identity-provider");

// Api object provides internal API-related helper functionality
// such as standardized success and error responses
const Api = require("#src/api/_index.js");

const cognitoClient = new CognitoIdentityProviderClient();

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // const stage = event.headers['X-Stage'] || 'dev';

  const data = JSON.parse(event.body);

  const userPoolClientId = process.env.USER_POOL_CLIENT_ID;
  const authFlow = process.env.AUTH_FLOW;

  try {
    const signInResponse = await cognitoClient.send(new InitiateAuthCommand({
      AuthFlow: authFlow,
      ClientId: userPoolClientId,
      AuthParameters: {
        USERNAME: data.email,
        PASSWORD: data.password
      }
    }));
    console.log("(+) signInResponse: " + JSON.stringify(signInResponse, null, 2));

    const { AccessToken, ExpiresIn, RefreshToken, IdToken } = signInResponse.AuthenticationResult;

    // Return success response
    const successResponse = Api.success({
      message: "User is signed in successfully.",
      accessToken: AccessToken,
      idToken: IdToken,
      refreshToken: RefreshToken,
      expiresIn: ExpiresIn,
    });
    console.log(`Success Response: ${JSON.stringify(successResponse, null, 2)}`);

    return successResponse;

  } catch (error) {
    console.error("Sign-in error:", error);

    return Api.error(error.message || "An error occurred during sign-in", error.$metadata?.httpStatusCode || 500);
  };
};
