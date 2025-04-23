const { SignUpCommand } = require("@aws-sdk/client-cognito-identity-provider");

/**
 * Sign up the user with Cognito
 * @param {*} cognitoClient // CognitoIdentityProviderClient
 * @param {string} userPoolClientId
 * @param {string} username
 * @param {string} password
 * @param {Object} userAttributes // User Attributes
 * @returns
 */
async function signUp(
  cognitoClient,
  userPoolClientId,
  username,
  password,
  userAttributes
) {
  const signUpResponse = await cognitoClient.send(
    new SignUpCommand({
      ClientId: userPoolClientId,
      Username: username,
      Password: password,
      UserAttributes: userAttributes,
    })
  );

  console.log("(+) signUpResponse: " + JSON.stringify(signUpResponse, null, 2));

  return signUpResponse;
}

module.exports = signUp;
