const {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const R = require("ramda");

/** @typedef {import('#types/deal-entity').DealEntity} DealItem */

const AccountsService = require("#src/services/accounts/_index.js");
const ApiService = require("#src/services/api/_index.js");

const cognitoClient = new CognitoIdentityProviderClient();

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const data = JSON.parse(event.body);

  const userPoolId = process.env.USER_POOL_ID;
  const userPoolClientId = process.env.USER_POOL_CLIENT_ID;

  try {
    performDynamicBusinessValidations(data);

    const userAttributes = prepareUserAttributes(data);

    const signUpResponse = await signUpUserWithCognito(
      cognitoClient,
      userPoolClientId,
      data.email,
      data.password,
      userAttributes
    );

    // Add user to the appropriate group based on userType
    await addUserToGroup(userPoolId, data.email, data.userType);

    return prepareSuccessResponse(signUpResponse, data.userType);
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

function prepareUserAttributes(data) {
  // Create user attributes based on user type
  const commonUserAttributes = [
    { Name: "email", Value: data.email },
    { Name: "custom:userGroup", Value: data.userType },
  ];

  // Add merchant-specific attributes if user type is Merchant
  if (data.userType === "merchant") {
    var completeUserAttributes = prepareMerchantAttributes(
      commonUserAttributes,
      data
    );
  }

  // Add customer-specific attributes if user type is Customer
  // This can be expanded as needed for different user types
  if (data.userType === "customer") {
    // Add customer-specific attributes here
    // Example: { Name: "custom:preferredCategories", Value: data.preferredCategories || "" }
    // var completeUserAttributes = prepareCustomerAttributes(userAttributes, data);
    // return updatedUserAttributes;
  }

  return completeUserAttributes;
}

function prepareMerchantAttributes(commonUserAttributes, data) {
  const copiedArray = R.clone(commonUserAttributes);

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

  copiedArray.push(
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
    { Name: "custom:productCategories", Value: productCategoriesString }
  );

  return copiedArray;
}

/**
 * Sign up a user with Cognito
 * @param {Object} data - User data from request
 * @param {string} addressString - Stringified address data
 * @param {string} primaryContactString - Stringified primary contact data
 * @param {string} productCategoriesString - Stringified product categories
 * @param {string} userType - Type of user (Merchant, Customer, etc.)
 * @returns {Object} - Cognito sign-up response
 */
async function signUpUserWithCognito(
  cognitoClient,
  userPoolClientId,
  username,
  password,
  userAttributes
) {
  const signUpResponse = await AccountsService.signUp(
    cognitoClient,
    username,
    password,
    userPoolClientId,
    userAttributes
  );

  return signUpResponse;
}

async function addUserToGroup(userPoolId, username, userType) {
  await cognitoClient.send(
    new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: username,
      GroupName: userType,
    })
  );
}

function prepareSuccessResponse() {
  const successResponse = ApiService.success(
    {
      message: "Merchant registered. Needs to submit OTP to complete sign-up",
      userConfirmed: signUpResponse.UserConfirmed,
      userType,
      userId,
      codeDeliveryDetails: signUpResponse.CodeDeliveryDetails,
    },
    201
  );

  // Add backward compatibility for merchant-specific clients
  if (userType === "Merchant") {
    responseData.merchantId = userId;
  }

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
