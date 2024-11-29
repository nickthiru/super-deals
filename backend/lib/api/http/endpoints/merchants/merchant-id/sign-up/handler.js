const { CognitoIdentityProviderClient, SignUpCommand, AdminAddUserToGroupCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { schema } = require("./schema.js");

// Api object provides internal API-related helper functionality
// such as standardized success and error responses
const Api = require("#src/api/_index.js");

const cognitoClient = new CognitoIdentityProviderClient();


exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const stage = event.headers['X-Stage'] || 'dev';

  // Parse the environment variables containing stage-specific resource names
  const userPoolIds = JSON.parse(process.env.USER_POOL_IDS);
  const userPoolId = userPoolIds[stage];

  const userPoolClientIds = JSON.parse(process.env.USER_POOL_CLIENT_IDS);
  const userPoolClientId = userPoolClientIds[stage];

  // Parse and validate the form data using Api object
  let signUpFormData;
  try {
    signUpFormData = Api.parseAndValidateFormData(event, schema);
  } catch (error) {
    return Api.error(400, error.message);
  }

  // Proceed with the rest of the handler logic using signUpFormData
  console.log("Validated form data:", signUpFormData);

  try {
    const signUpResponse = await cognitoClient.send(new SignUpCommand({
      ClientId: userPoolClientId,
      Username: signUpFormData.emailAddress,
      Password: signUpFormData.password,
      UserAttributes: [
        { Name: "email", Value: signUpFormData.email },
        { Name: "custom:businessName", Value: signUpFormData.businessName },
        { Name: "custom:userGroup", Value: signUpFormData.userGroup }
      ]
    }));
    console.log("(+) signUpResponse: " + JSON.stringify(signUpResponse, null, 2));

    await cognitoClient.send(new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: signUpFormData.email,
      GroupName: 'Merchant'
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
