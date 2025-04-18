const { SESClient } = require("@aws-sdk/client-ses");

const Email = require("#src/services/email/_index.js");

const sesConfig = {
  region: "us-east-1",
};

const sesClient = new SESClient(sesConfig);

exports.handler = async function sendWelcomeEmail(event, context) {
  console.log("Inside 'send-welcome-email' handler");
  console.log("event: \n" + JSON.stringify(event, null, 2));
  console.log("context: \n" + JSON.stringify(context, null, 2));

  const emailTemplateName = process.env.EMAIL_TEMPLATE_NAME;
  console.log("(+) emailTemplateName: " + emailTemplateName);

  try {
    // Process SQS messages
    for (const record of event.Records) {
      const messageBody = JSON.parse(record.body);
      const snsMessage = JSON.parse(messageBody.Message);
      
      console.log("Processing message:", JSON.stringify(snsMessage, null, 2));
      
      // Extract user data from the message
      const { email, businessName, userType } = snsMessage;
      
      if (!email) {
        console.log("(-) Missing email address in message");
        continue;
      }
      
      // Prepare template data
      const templateData = {
        businessName: businessName || "Merchant",
        loginUrl: "https://super-deals.com/accounts/sign-in",
        supportEmail: "support@super-deals.com",
        currentYear: new Date().getFullYear()
      };
      
      // Send the welcome email
      const emailService = new Email(sesClient);
      const result = await emailService.sendTemplatedEmail({
        templateName: emailTemplateName,
        destination: email,
        templateData: templateData
      });
      
      console.log("(+) Welcome email sent successfully:", result);
    }
    
    return { success: true };
  } catch (error) {
    console.log("(-) Error sending welcome email:", error);
    throw error;
  }
};
