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
    const businessName = userAttributes.name || (userType === "merchant" ? "Merchant" : "Customer");

    // Only send welcome email for merchant accounts
    if (userType !== "merchant") {
      console.log(`Skipping welcome email for non-merchant user: ${userType}`);
      return event;
    }

    console.log(`Sending welcome email to merchant: ${email}`);

    // Get the email template name from environment variables
    const emailTemplateName = process.env.EMAIL_TEMPLATE_NAME;
    console.log("Using email template:", emailTemplateName);

    // Prepare template data
    const templateData = {
      businessName: businessName,
      loginUrl: `${process.env.SITE_URL || "https://super-deals.com"}/accounts/sign-in`,
      supportEmail: "support@super-deals.com",
      currentYear: new Date().getFullYear(),
    };

    // Send the welcome email using the email service
    const sourceEmail = process.env.SOURCE_EMAIL || "superdeals616@gmail.com";
    const result = await EmailService.sendEmail(
      sesClient,
      emailTemplateName,
      email,
      templateData,
      sourceEmail
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

