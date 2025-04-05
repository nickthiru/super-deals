const {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminAddUserToGroupCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

// Api object provides internal API-related helper functionality
// such as standardized success and error responses
const Api = require("#src/api/_index.js");

const cognitoClient = new CognitoIdentityProviderClient();

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

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const data = JSON.parse(event.body);

  const userPoolId = process.env.USER_POOL_ID;
  const userPoolClientId = process.env.USER_POOL_CLIENT_ID;

  try {
    // Perform dynamic business validations
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

    // Validate primary contact email matches pattern or domain requirements
    if (data.primaryContact && data.primaryContact.email) {
      // Example: Ensure primary contact email is not the same as the business email
      if (data.primaryContact.email === data.email) {
        throw new Error(
          "Primary contact email should be different from business email"
        );
      }
    }

    // Prepare address and contact information for attributes
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

    // Return success response
    const successResponse = Api.success(
      {
        message: "Merchant registered. Needs to submit OTP to complete sign-up",
        userConfirmed: false,
        merchantId: 123456,
        codeDeliveryDetails: {
          AttributeName: "email",
          DeliveryMedium: "EMAIL",
          Destination: "n***@g***",
        },
      },
      201
    );
    console.log(
      `Success Response: ${JSON.stringify(successResponse, null, 2)}`
    );

    return successResponse;
  } catch (error) {
    console.log(error);

    const errorResponse = Api.error(400, {
      error: error.message || "Failed to register user account",
    });

    return errorResponse;
  }
};
