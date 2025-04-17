/**
 * Cognito Custom Message Lambda Trigger
 *
 * This Lambda function customizes the email verification message based on user type.
 * It's triggered when Cognito sends verification emails, forgot password emails, etc.
 * It uses SES templates for email content instead of hardcoding HTML.
 *
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-message.html
 */

const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");

// Initialize the SES client
const sesClient = new SESv2Client({ region: "us-east-1" });

/**
 * Sends an email using an SES template
 * @param {string} toAddress - Recipient email address
 * @param {string} templateName - Name of the SES template to use
 * @param {Object} templateData - Data to be used in the template
 * @returns {Promise<Object>} - SES response
 */
async function sendTemplatedEmail(toAddress, templateName, templateData) {
  const params = {
    Content: {
      Template: {
        TemplateName: templateName,
        TemplateData: JSON.stringify(templateData),
      },
    },
    Destination: {
      ToAddresses: [toAddress],
    },
    FromEmailAddress: process.env.FROM_EMAIL || "no-reply@superdeals.com",
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

exports.handler = async (event) => {
  console.log("Custom Message event:", JSON.stringify(event, null, 2));

  // Get the verification code from the event
  const { codeParameter } = event.request;

  // Get the user attributes
  const userAttributes = event.request.userAttributes || {};
  const username = userAttributes.userName || userAttributes.email || '';
  const email = userAttributes.email || '';

  // Determine user type (merchant or customer)
  const userGroup = userAttributes["custom:userGroup"] || "";
  const businessName = userAttributes["custom:businessName"] || "";
  const isMerchant = userGroup === "Merchant" || businessName;

  // Get the app URL from environment variables
  const appUrl = process.env.APP_URL || "https://dbcxhkl1jwg4u.cloudfront.net";

  // Get the trigger source to determine what type of message we're sending
  const { triggerSource } = event;

  // Common template data
  const templateData = {
    code: codeParameter,
    username: encodeURIComponent(username),
    appUrl,
    year: new Date().getFullYear(),
    businessName: businessName || "Merchant"
  };

  // Customize the message based on the trigger source and user type
  if (
    triggerSource === "CustomMessage_SignUp" ||
    triggerSource === "CustomMessage_ResendCode"
  ) {
    // This is a sign-up or resend verification code email
    if (isMerchant) {
      // Set response for Cognito (required even though we're sending via SES)
      event.response.emailSubject = "Verify your Super Deals Merchant Account";
      
      // Attempt to send via SES template
      try {
        await sendTemplatedEmail(
          email,
          process.env.MERCHANT_SIGNUP_TEMPLATE || "MerchantSignUpVerification",
          templateData
        );
        
        // Set a minimal message for Cognito's records
        event.response.emailMessage = `Your verification code is: ${codeParameter}`;
      } catch (error) {
        console.error("Failed to send templated email, falling back to default:", error);
        // Let Cognito send the default message by not setting emailMessage
      }
    } else {
      // Customer verification email
      event.response.emailSubject = "Verify your Super Deals Account";
      
      // Attempt to send via SES template
      try {
        await sendTemplatedEmail(
          email,
          process.env.CUSTOMER_SIGNUP_TEMPLATE || "CustomerSignUpVerification",
          templateData
        );
        
        // Set a minimal message for Cognito's records
        event.response.emailMessage = `Your verification code is: ${codeParameter}`;
      } catch (error) {
        console.error("Failed to send templated email, falling back to default:", error);
        // Let Cognito send the default message by not setting emailMessage
      }
    }
  } else if (triggerSource === "CustomMessage_ForgotPassword") {
    // This is a forgot password email
    if (isMerchant) {
      // Merchant forgot password email
      event.response.emailSubject = "Reset Your Super Deals Merchant Password";
      
      // Attempt to send via SES template
      try {
        await sendTemplatedEmail(
          email,
          process.env.MERCHANT_PASSWORD_RESET_TEMPLATE || "MerchantPasswordReset",
          templateData
        );
        
        // Set a minimal message for Cognito's records
        event.response.emailMessage = `Your password reset code is: ${codeParameter}`;
      } catch (error) {
        console.error("Failed to send templated email, falling back to default:", error);
        // Let Cognito send the default message by not setting emailMessage
      }
    } else {
      // Customer forgot password email
      event.response.emailSubject = "Reset Your Super Deals Password";
      
      // Attempt to send via SES template
      try {
        await sendTemplatedEmail(
          email,
          process.env.CUSTOMER_PASSWORD_RESET_TEMPLATE || "CustomerPasswordReset",
          templateData
        );
        
        // Set a minimal message for Cognito's records
        event.response.emailMessage = `Your password reset code is: ${codeParameter}`;
      } catch (error) {
        console.error("Failed to send templated email, falling back to default:", error);
        // Let Cognito send the default message by not setting emailMessage
      }
    }
  }

  // Return the updated event
  return event;
};
