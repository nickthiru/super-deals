const { SignUpCommand } = require("@aws-sdk/client-cognito-identity-provider");

/**
 * Sign up the user with Cognito
 * @param {*} client // CognitoIdentityProviderClient
 * @param {*} props
 * @returns
 */
async function signUp(client, props) {
  const signUpResponse = await client.send(
    new SignUpCommand({
      ClientId: userPoolClientId,
      Username: props.email,
      Password: props.password,
      UserAttributes: [
        { Name: "email", Value: props.email },
        { Name: "custom:businessName", Value: props.businessName },
        { Name: "custom:userGroup", Value: "Merchant" },
        { Name: "custom:registrationNumber", Value: props.registrationNumber },
        {
          Name: "custom:yearOfRegistration",
          Value: data.yearOfRegistration.toString(),
        },
        { Name: "custom:website", Value: data.website || "" },
        { Name: "custom:address", Value: addressString },
        { Name: "custom:phone", Value: data.phone },
        { Name: "custom:primaryContact", Value: primaryContactString },
        { Name: "custom:productCategories", Value: productCategoriesString },
      ],
    })
  );

  console.log("(+) signUpResponse: " + JSON.stringify(signUpResponse, null, 2));

  return signUpResponse;
}

module.exports = signUp;
