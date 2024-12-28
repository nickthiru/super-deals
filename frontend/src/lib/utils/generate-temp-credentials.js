import { CognitoIdentityClient, GetCredentialsForIdentityCommand } from '@aws-sdk/client-cognito-identity';

export default async function generateTempCredentials() {
  const client = new CognitoIdentityClient();

  const jwtToken = localStorage.getItem("jwt_token");
  const cognitoIdentityPoolId = localStorage.getItem('cognito_identity_pool');

  const credentials = client.send(new GetCredentialsForIdentityCommand({
    IdentityId: cognitoIdentityPoolId,
    Logins: {
      [cognitoIdentityPoolId]: jwtToken,
    }
  }));

  return credentials;
}