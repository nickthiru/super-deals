const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminAddUserToGroupCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

/** @typedef {import('#types/deal-entity').DealEntity} DealItem */

const AccountsService = require("#src/services/accounts/_index.js");
const ApiService = require("#src/services/api/_index.js");
const PubSubService = require("#src/services/pub-sub/_index.js");

const cognitoClient = new CognitoIdentityProviderClient();

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const data = JSON.parse(event.body);

  const userPoolId = process.env.USER_POOL_ID;
  const userPoolClientId = process.env.USER_POOL_CLIENT_ID;

  try {
    performDynamicBusinessValidations(data);

    const { addressString, primaryContactString, productCategoriesString } =
      prepareAddressAndContactInformationForAttributes(data);

    const signUpResponse = await signUpUserWithCognito(
      data,
      addressString,
      primaryContactString,
      productCategoriesString
    );

    await addUserToGroup(data.email, userPoolId, "Merchant");

    await publishSignUpCompletedEvent();

    return prepareSuccessResponse(signUpResponse);
  } catch (error) {
    return prepareErrorResponse(error);
  }
};

/**
 * Validates a URL string
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

function performDynamicBusinessValidations(data) {
  const currentYear = new Date().getFullYear();

  // Validate year of registration is not in the future
  if (data.yearOfRegistration > currentYear) {
    throw new Error("Year of registration cannot be in the future");
  }

  // Validate year of registration is not too far in the past (arbitrary business rule)
  if (data.yearOfRegistration < 1900) {
    throw new Error("Year of registration is invalid");
  }

  // Validate website if provided
  if (data.website) {
    if (!isValidUrl(data.website)) {
      throw new Error("Website URL is invalid");
    }

    // Optional: Check for allowed domains if needed
    // const url = new URL(data.website);
    // const allowedDomains = ['example.com', 'business.com'];
    // if (!allowedDomains.some(domain => url.hostname.endsWith(domain))) {
    //   throw new Error("Website domain is not allowed");
    // }
  }
}

function prepareAddressAndContactInformationForAttributes(data) {
  const addressString = JSON.stringify({
    buildingNumber: data.address.buildingNumber,
    street: data.address.street,
    city: data.address.city,
    state: data.address.state,
    zip: data.address.zip,
    country: data.address.country,
  });

  const primaryContactString = JSON.stringify({
    name: data.primaryContact.name,
    email: data.primaryContact.email,
    phone: data.primaryContact.phone,
  });

  const productCategoriesString = JSON.stringify(data.productCategories);

  return {
    addressString,
    primaryContactString,
    productCategoriesString,
  };
}

async function signUpUserWithCognito(
  data,
  addressString,
  primaryContactString,
  productCategoriesString
) {
  const signUpResponse = await cognitoClient.send(
    new SignUpCommand({
      ClientId: userPoolClientId,
      Username: data.email,
      Password: data.password,
      UserAttributes: [
        { Name: "email", Value: data.email },
        { Name: "custom:businessName", Value: data.businessName },
        { Name: "custom:userGroup", Value: "Merchant" },
        { Name: "custom:registrationNumber", Value: data.registrationNumber },
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

async function addUserToGroup(username, userPoolId, userType) {
  await cognitoClient.send(
    new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: username,
      GroupName: userType,
    })
  );
}

async function publishSignUpCompletedEvent() {
  await PubSubService.publishToSns(snsClient, topicArn, topicName);
}

function prepareSuccessResponse() {
  const successResponse = ApiService.success(
    {
      message: "Merchant registered. Needs to submit OTP to complete sign-up",
      userConfirmed: signUpResponse.UserConfirmed,
      merchantId: signUpResponse.UserSub,
      codeDeliveryDetails: signUpResponse.CodeDeliveryDetails,
    },
    201
  );
  console.log(`Success Response: ${JSON.stringify(successResponse, null, 2)}`);

  return successResponse;
}

function prepareErrorResponse(error) {
  console.log(error);

  const errorResponse = ApiService.error(400, {
    error: error.message || "Failed to register user account",
  });

  return errorResponse;
}
