const { CognitoIdentityProviderClient, SignUpCommand, AdminAddUserToGroupCommand } = require("@aws-sdk/client-cognito-identity-provider");

// Api object provides internal API-related helper functionality
// such as standardized success and error responses
const Api = require("#src/api/_index.js");

const cognitoClient = new CognitoIdentityProviderClient();

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // const stage = event.headers['X-Stage'] || 'dev';

  const data = JSON.parse(event.body);

  const userPoolId = process.env.USER_POOL_ID;
  const userPoolClientId = process.env.USER_POOL_CLIENT_ID;

  try {
    const signUpResponse = await cognitoClient.send(new SignUpCommand({
      ClientId: userPoolClientId,
      Username: data.email,
      Password: data.password,
      UserAttributes: [
        { Name: "email", Value: data.email },
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


    // Return success response
    const successResponse = Api.success({
      username: data.email,
      message: "User account registered. Needs confirmation via OTP.",
    });
    console.log(`Success Response: ${JSON.stringify(successResponse, null, 2)}`);

    return successResponse;

  } catch (error) {
    console.log(error);

    const errorResponse = Api.error(400, error.message || "Failed to register user account");

    return errorResponse;
  }
};
