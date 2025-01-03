import { CognitoIdentityClient, GetCredentialsForIdentityCommand } from '@aws-sdk/client-cognito-identity';

export default async function generateTempCredentials(token, cognitoIdentityPoolId) {
  const client = new CognitoIdentityClient();

  const credentials = client.send(new GetCredentialsForIdentityCommand({
    IdentityId: cognitoIdentityPoolId,
    Logins: {
      [cognitoIdentityPoolId]: token,
    }
  }));

  return credentials;
}