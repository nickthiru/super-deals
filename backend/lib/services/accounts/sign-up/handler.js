const {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const R = require("ramda");

const AccountsService = require("#src/services/accounts/_index.js");
const ApiService = require("#src/services/api/_index.js");
const DbService = require("#src/services/db/_index.js");

const cognitoClient = new CognitoIdentityProviderClient();
const ddbClient = new DynamoDBClient();

/**
 * Handler for the user sign-up process
 * 
 * This handler manages the complete user registration flow:
 * 1. Normalizes and validates user input data
 * 2. Registers the user in Cognito with minimal attributes
 * 3. Adds the user to the appropriate user group
 * 4. Stores the complete user profile in DynamoDB
 * 5. Returns a formatted success response
 * 
 * @param {Object} event - API Gateway Lambda proxy event
 * @returns {Object} - API Gateway Lambda proxy response
 */
exports.handler = async (event) => {
  logEventReceived(event);

  const data = JSON.parse(event.body);

  const userPoolId = process.env.USER_POOL_ID;
  const userPoolClientId = process.env.USER_POOL_CLIENT_ID;
  const tableName = process.env.TABLE_NAME;

  try {
    // Normalize user data
    const normalizedData = normalizeUserData(data);

    // Validate the data before proceeding
    validateUserData(normalizedData);

    // Prepare user attributes for Cognito
    const userAttributes = prepareUserAttributesForCognito(normalizedData);

    // Register the user with Cognito
    const signUpResponse = await registerUserWithCognito(
      cognitoClient,
      userPoolClientId,
      normalizedData.email,
      normalizedData.password,
      userAttributes
    );

    // Add user to the appropriate group based on userType
    await addUserToGroup(userPoolId, normalizedData.email, normalizedData.userType);
    
    // Prepare user profile for DynamoDB
    const userId = extractUserIdFromSignUpResponse(signUpResponse);
    const userProfile = prepareUserProfileForDynamoDB(normalizedData, userId);
    
    // Save user profile to DynamoDB
    await saveUserProfileToDynamoDB(tableName, userProfile);

    // Prepare and return the success response
    return prepareSuccessResponse(signUpResponse, normalizedData.userType);
  } catch (error) {
    logError(error);
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

/**
 * Logs the received event
 * @param {Object} event - API Gateway Lambda proxy event
 */
function logEventReceived(event) {
  console.log("Received event:", JSON.stringify(event, null, 2));
}

/**
 * Logs an error that occurred during processing
 * @param {Error} error - The error that occurred
 */
function logError(error) {
  console.error("Error in sign-up handler:", error);
}

/**
 * Validates user data against business rules
 * @param {Object} data - Normalized user data
 * @throws {Error} - If validation fails
 */
function validateUserData(data) {
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

/**
 * Normalizes user data by standardizing formats and values
 * @param {Object} data - Raw user data from the request
 * @returns {Object} - Normalized user data
 */
function normalizeUserData(data) {
  const normalizedData = { ...data };
  
  // Ensure userType is lowercase for consistency
  normalizedData.userType = data.userType.toLowerCase();
  
  return normalizedData;
}

/**
 * Prepares user attributes for Cognito
 * @param {Object} data - Normalized user data
 * @returns {Array} - Array of user attributes for Cognito
 */
function prepareUserAttributesForCognito(data) {
  // Only include essential attributes needed for authentication
  return [
    { Name: "email", Value: data.email },
    { Name: "custom:userType", Value: data.userType }
  ];
}

/**
 * Extracts the user ID from the Cognito sign-up response
 * @param {Object} signUpResponse - Response from Cognito sign-up
 * @returns {string} - User ID
 */
function extractUserIdFromSignUpResponse(signUpResponse) {
  return signUpResponse.UserSub || signUpResponse.user?.username || "";
}

/**
 * Prepares user profile for DynamoDB
 * @param {Object} data - Normalized user data
 * @param {string} userId - Cognito user ID
 * @returns {Object} - User profile ready for DynamoDB
 */
function prepareUserProfileForDynamoDB(data, userId) {
  // Create a timestamp for created/updated fields
  const timestamp = new Date().toISOString();

  // Prepare the item using the single-table design pattern
  const userProfile = {
    // Primary key - using the same value for PK and SK as requested
    PK: `USER#${userId}`,
    SK: `USER#${userId}`,
    
    // Data fields
    userId,
    userType: data.userType,
    email: data.email,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  // Add merchant-specific fields if user is a merchant
  if (data.userType === 'merchant') {
    userProfile.businessName = data.businessName;
    userProfile.registrationNumber = data.registrationNumber;
    userProfile.yearOfRegistration = data.yearOfRegistration;
    userProfile.businessType = data.businessType;
    userProfile.website = data.website;
    userProfile.phone = data.phone;
    
    // Store complex objects directly in DynamoDB
    userProfile.address = data.address;
    userProfile.primaryContact = data.primaryContact;
    userProfile.productCategories = data.productCategories;
  }

  // Add GSI1 keys for querying users by type
  userProfile.GSI1PK = `USERTYPE#${data.userType}`;
  userProfile.GSI1SK = `USER#${userId}`;
  
  return userProfile;
}

/**
 * Saves user profile to DynamoDB
 * @param {string} tableName - The DynamoDB table name
 * @param {Object} userProfile - Prepared user profile
 * @returns {Object} - Result of the DynamoDB save operation
 */
async function saveUserProfileToDynamoDB(tableName, userProfile) {
  console.log("Saving user profile to DynamoDB:", {
    userId: userProfile.userId,
    userType: userProfile.userType,
    tableName
  });

  try {
    // Use the DbService to save the item
    const result = await DbService.item.saveItem(ddbClient, tableName, userProfile);
    console.log("User profile saved to DynamoDB:", result);
    return result;
  } catch (error) {
    console.error("Error saving user profile to DynamoDB:", error);
    throw error;
  }
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
async function registerUserWithCognito(
  cognitoClient,
  userPoolClientId,
  username,
  password,
  userAttributes
) {
  console.log("Signing up user with Cognito:", {
    email: username,
    userPoolClientId: userPoolClientId,
    attributesCount: userAttributes.length,
  });

  const signUpResponse = await AccountsService.signUp(
    cognitoClient,
    userPoolClientId,
    username,
    password,
    userAttributes
  );

  console.log(
    "Cognito sign-up response:",
    JSON.stringify(signUpResponse, null, 2)
  );

  return signUpResponse;
}

async function addUserToGroup(userPoolId, username, userType) {
  console.log(`Adding user ${username} to group ${userType}`);
  
  await cognitoClient.send(
    new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: username,
      GroupName: userType,
    })
  );
  
  console.log(`User ${username} successfully added to group ${userType}`);
}

function prepareSuccessResponse(signUpResponse, userType) {
  // Extract the user ID from the response
  const userId = signUpResponse.UserSub || signUpResponse.user?.username || "";

  // Prepare the response data
  const responseData = {
    message: "Merchant registered. Needs to submit OTP to complete sign-up",
    userConfirmed: signUpResponse.UserConfirmed || false,
    userType: userType,
    userId: userId,
  };

  // Add code delivery details if available
  if (signUpResponse.CodeDeliveryDetails) {
    responseData.codeDeliveryDetails = signUpResponse.CodeDeliveryDetails;
  }

  // Add backward compatibility for merchant-specific clients
  if (userType === "merchant") {
    responseData.merchantId = userId;
  }

  // Create the success response
  const successResponse = ApiService.success(responseData, 201);

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
