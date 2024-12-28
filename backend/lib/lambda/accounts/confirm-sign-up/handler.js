const { CognitoIdentityProviderClient, ConfirmSignUpCommand } = require("@aws-sdk/client-cognito-identity-provider");

// Api object provides internal API-related helper functionality
// such as standardized success and error responses
const Api = require("#src/api/_index.js");

const cognitoClient = new CognitoIdentityProviderClient();

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // const stage = event.headers['X-Stage'] || 'dev';

  const data = JSON.parse(event.body);

  const userPoolClientId = process.env.USER_POOL_CLIENT_ID;

  try {
    const confirmSignUpResponse = await cognitoClient.send(new ConfirmSignUpCommand({
      ClientId: userPoolClientId,
      Username: data.username,
      ConfirmationCode: data.confirmationCode,
    }));
    console.log("(+) confirmSignUpResponse: " + JSON.stringify(confirmSignUpResponse, null, 2));

    /*
    A session identifier that you can use to immediately sign in the confirmed user. You can automatically sign users in with the one-time password that they provided in a successful ConfirmSignUp request. To do this, pass the Session parameter from this response in the Session parameter of an InitiateAuth or AdminInitiateAuth request.
    */
    // var sessionToken = confirmSignUpResponse.Session;

  } catch (error) {
    console.log(error);
  };

  // Return success response
  const successResponse = Api.success({
    message: "User has been successfully confirmed.",
    // sessionToken,
  });
  console.log(`Success Response: ${JSON.stringify(successResponse, null, 2)}`);

  return successResponse;
};
