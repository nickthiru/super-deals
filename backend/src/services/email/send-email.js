const { SendTemplatedEmailCommand, GetTemplateCommand } = require("@aws-sdk/client-ses");

module.exports = async function sendEmail(
  sesClient,
  emailTemplateName,
  emailAddress,
  data,
  sourceEmail,
  configurationSetName = null,
  tags = []
) {
  console.log("(+) Inside 'sendEmail()'");
  console.log("(+) emailTemplateName: " + emailTemplateName);
  console.log("(+) emailAddress: " + emailAddress);
  console.log("(+) data: " + JSON.stringify(data, null, 2));
  if (configurationSetName) {
    console.log("(+) Using configuration set: " + configurationSetName);
  }

  // Verify the template exists and log its structure
  try {
    const templateResponse = await sesClient.send(
      new GetTemplateCommand({ TemplateName: emailTemplateName })
    );
    console.log("(+) Template found:", JSON.stringify(templateResponse.Template, null, 2));
  } catch (error) {
    console.error("(!) Error getting template:", error.message);
    // Continue with sending attempt even if template check fails
  }

  try {
    const params = {
      Source: sourceEmail,
      Destination: {
        ToAddresses: [emailAddress],
      },
      Template: emailTemplateName,
      TemplateData: JSON.stringify(data),
    };

    if (configurationSetName) {
      params.ConfigurationSetName = configurationSetName;

      // Add message tags if provided
      // These are required for CloudWatch event destinations with message tag dimension sources
      if (tags && tags.length > 0) {
        params.Tags = tags;
      } else {
        params.Tags = [
          {
            Name: "ses-event-type",
            Value: "welcome-email",
          },
        ];
      }
    }

    // Log the full parameters being sent to SES
    console.log("(+) SendTemplatedEmailCommand params:", JSON.stringify(params, null, 2));

    const response = await sesClient.send(
      new SendTemplatedEmailCommand(params)
    );

    console.log(
      "(+) SendEmailCommand response: " + JSON.stringify(response, null, 2)
    );

    return response;
  } catch (error) {
    console.error("Error in sendEmail:", error);
    throw error;
  }
};
