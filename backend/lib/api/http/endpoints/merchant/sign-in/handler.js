const { CognitoIdentityProviderClient, InitiateAuthCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { schema } = require("./schema.js");

// Api object provides internal API-related helper functionality
// such as standardized success and error responses
const Api = require("#src/api/_index.js");

const cognitoClient = new CognitoIdentityProviderClient();


exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const stage = event.headers['X-Stage'] || 'dev';

  // Parse the environment variables containing stage-specific resource names
  const userPoolClientIds = JSON.parse(process.env.CONSUMER_USER_POOL_CLIENT_IDS);
  const userPoolClientId = userPoolClientIds[stage];

  const authFlow = process.env.AUTH_FLOW;

  // Parse and validate the form data using Api object
  let signInFormData;
  try {
    signInFormData = Api.parseAndValidateFormData(event, schema);
  } catch (error) {
    return Api.error(400, error.message);
  }

  // Proceed with the rest of the handler logic using signInFormData
  console.log("Validated form data:", signInFormData);

  let accessToken = "";
  let expiresIn = 0;

  try {
    const signInResponse = await cognitoClient.send(new InitiateAuthCommand({
      AuthFlow: authFlow,
      ClientId: userPoolClientId,
      AuthParameters: {
        USERNAME: signInFormData.emailAddress,
        PASSWORD: signInFormData.password
      }
    }));

    console.log("(+) signInResponse: " + JSON.stringify(signInResponse, null, 2));

    accessToken = signInResponse.AuthenticationResult.AccessToken;
    expiresIn = signInResponse.AuthenticationResult.ExpiresIn;

  } catch (error) {
    console.log(error);
  };

  // Return success response
  const successResponse = Api.success({
    message: "User is signed in successfully.",
    accessToken: accessToken,
    expiresIn: expiresIn
  });
  console.log(`Success Response: ${JSON.stringify(successResponse, null, 2)}`);

  return successResponse;
};
