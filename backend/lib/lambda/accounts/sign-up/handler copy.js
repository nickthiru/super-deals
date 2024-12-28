const { CognitoIdentityProviderClient, SignUpCommand, AdminAddUserToGroupCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { v4: uuidv4 } = require('uuid'); // Import UUID library to generate merchantId

// Api object provides internal API-related helper functionality
// such as standardized success and error responses
const Api = require("#src/api/_index.js");

const cognitoClient = new CognitoIdentityProviderClient();

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const stage = event.headers['X-Stage'] || 'dev';

  const data = JSON.parse(event.body);

  // Parse the environment variables containing stage-specific resource names
  const userPoolIds = JSON.parse(process.env.USER_POOL_IDS);
  const userPoolClientIds = JSON.parse(process.env.USER_POOL_CLIENT_IDS);
  const userPoolId = userPoolIds[stage];
  const userPoolClientId = userPoolClientIds[stage];

  // Generate a unique merchantId
  const merchantId = uuidv4();

  try {
    const signUpResponse = await cognitoClient.send(new SignUpCommand({
      ClientId: userPoolClientId,
      Username: data.emailAddress,
      Password: data.password,
      UserAttributes: [
        { Name: "email", Value: data.email },
        { Name: 'custom:merchantId', Value: merchantId },
        { Name: "custom:businessName", Value: data.businessName },
        { Name: "custom:userGroup", Value: data.userGroup }
      ]
    }));
    console.log("(+) signUpResponse: " + JSON.stringify(signUpResponse, null, 2));

    await cognitoClient.send(new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: data.email,
      GroupName: 'Merchants'
    }));

  } catch (error) {
    console.log(error);
  };

  // Return success response
  const successResponse = Api.success({
    message: "User account registered. Needs confirmation via OTP.",
  });
  console.log(`Success Response: ${JSON.stringify(successResponse, null, 2)}`);

  return successResponse;
};
