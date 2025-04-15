const { SESClient } = require("@aws-sdk/client-ses");

const Email = require("#src/services/email/_index.js");

const sesConfig = {
  region: "us-east-1",
};

const sesClient = new SESClient(sesConfig);

exports.handler = async function sendEmailAlertWorkflow(event, context) {
  console.log("Inside 'send-email-alert-workflow' handler");
  console.log("event: \n" + JSON.stringify(event, null, 2));
  console.log("context: \n" + JSON.stringify(context, null, 2));

  const emailTemplateName = process.env.EMAIL_TEMPLATE_NAME;
  console.log("(+) emailTemplateName: " + emailTemplateName);

  try {
  } catch (error) {
    console.log("(-) Error: " + error);
  }
};
