/**
 * Cognito Post Confirmation Lambda Trigger
 *
 * This Lambda function is triggered after a user confirms their account (verifies their email).
 * For merchant accounts, it sends a welcome email with document verification instructions.
 *
 * The function must return the event object to allow the confirmation flow to continue.
 *
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-post-confirmation.html
 */

const { SESClient } = require("@aws-sdk/client-ses");

// Import the email service module
const EmailService = require("#src/services/email/_index.js");

// Configure SES client
const sesClient = new SESClient({ region: "us-east-1" });

exports.handler = async (event) => {
  console.log("Post Confirmation event:", JSON.stringify(event, null, 2));

  // Only process post confirmation events for sign-up
  if (event.triggerSource !== "PostConfirmation_ConfirmSignUp") {
    console.log(
      `Not processing event from trigger source: ${event.triggerSource}`
    );
    return event;
  }

  try {
    // Get the user attributes
    const userAttributes = event.request.userAttributes || {};
    const email = userAttributes.email;
    const userType = userAttributes["custom:userType"] || "";
    const name = userAttributes.name || "";
    const businessName =
      userType === "merchant" ? name || "Merchant" : name || "Customer";

    console.log(`Processing welcome email for user type: ${userType}`);

    // Skip if user type is not recognized
    if (userType !== "merchant" && userType !== "customer") {
      console.log(`Skipping welcome email for unknown user type: ${userType}`);
      return event;
    }

    console.log(`Sending welcome email to ${userType}: ${email}`);

    // Get the email template name based on user type
    let emailTemplateName;
    if (userType === "merchant") {
      emailTemplateName =
        process.env.MERCHANT_EMAIL_TEMPLATE_NAME ||
        process.env.EMAIL_TEMPLATE_NAME;
      console.log("Using merchant email template:", emailTemplateName);
    } else {
      emailTemplateName = process.env.CUSTOMER_EMAIL_TEMPLATE_NAME;
      console.log("Using customer email template:", emailTemplateName);
    }

    if (!emailTemplateName) {
      console.error(`No email template found for user type: ${userType}`);
      return event;
    }

    // Get the configuration set name from environment variables
    const configurationSetName = process.env.CONFIGURATION_SET_NAME;
    if (configurationSetName) {
      console.log("Using configuration set:", configurationSetName);
    }

    // Prepare template data based on user type
    const siteUrl = process.env.SITE_URL || "https://super-deals.com";
    const loginUrl = `${siteUrl}/accounts/sign-in`;
    const supportEmail = "support@super-deals.com";
    const currentYear = new Date().getFullYear();

    let templateData;
    if (userType === "merchant") {
      templateData = {
        businessName: businessName,
        loginUrl: loginUrl,
        supportEmail: supportEmail,
        currentYear: currentYear,
        year: currentYear, // Alternative variable name used in some templates
      };
    } else {
      // Customer template data
      templateData = {
        customerName: businessName, // Using the name as customerName for customers
        loginUrl: loginUrl,
        supportEmail: supportEmail,
        currentYear: currentYear,
        year: currentYear,
        dealsUrl: `${siteUrl}/deals`,
      };
    }

    console.log("Template data:", JSON.stringify(templateData, null, 2));

    // Send the welcome email using the email service
    const sourceEmail = process.env.SOURCE_EMAIL || "superdeals616@gmail.com";

    // Create tags for CloudWatch event destination
    // These tags must match the dimension configuration in the SES monitoring construct
    const emailTags = [
      {
        Name: "ses-event-type", // Must match the dimension name in CloudWatch destination
        Value: "welcome-email",
      },
    ];

    const result = await EmailService.sendEmail(
      sesClient,
      emailTemplateName,
      email,
      templateData,
      sourceEmail,
      configurationSetName,
      emailTags // Pass the tags for CloudWatch event logging
    );

    console.log("Welcome email sent successfully:", result);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Don't throw the error, as we don't want to block the user confirmation
    // Just log it and continue the flow
  }

  // Return the event object to continue the user confirmation flow
  return event;
};
