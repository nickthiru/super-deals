import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { error } from '@sveltejs/kit';

export default async function generateTempCredentials(idToken, cognitoUserPoolId, cognitoIdentityPoolId) {
  console.log("Inside generateTempCredentials");

  const awsRegion = 'us-east-1'; // Preferably, this needs to be read from a config file

  const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${cognitoUserPoolId}`

  try {
    const client = new CognitoIdentityClient({
      region: awsRegion,
      credentials: fromCognitoIdentityPool({
        clientConfig: {
          region: awsRegion,
        },
        identityPoolId: cognitoIdentityPoolId,
        logins: {
          [cognitoIdentityPool]: idToken,
        },
      }),
    });

    const credentials = await client.config.credentials();
    console.log("credentials: " + JSON.stringify(credentials, null, 2));

    return credentials;

  } catch (err) {
    console.error("Error getting credentials:", err);
    throw error;
  }
}