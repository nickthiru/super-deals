const htmlPart = `
  <mjml>
    <mj-head>
      <mj-title>Super Deals Password Reset</mj-title>
      <mj-font name="Arial" href="https://fonts.googleapis.com/css?family=Arial" />
      <mj-attributes>
        <mj-all font-family="Arial, sans-serif" />
        <mj-text font-size="16px" line-height="1.6" />
      </mj-attributes>
    </mj-head>
    <mj-body background-color="#f9f9f9">
      <!-- Header Section -->
      <mj-section background-color="#3B82F6" padding="20px">
        <mj-column>
          <mj-text color="#ffffff" font-size="24px" font-weight="bold" align="center">
            Super Deals Password Reset
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Content Section -->
      <mj-section background-color="#ffffff" padding="20px">
        <mj-column>
          <mj-text>
            Hello,
          </mj-text>
          <mj-text>
            We received a request to reset your Super Deals account password.
          </mj-text>
          <mj-text>
            Your password reset code is:
          </mj-text>
          <mj-text font-size="24px" font-weight="bold" align="center" letter-spacing="5px" padding="15px 0">
            {{code}}
          </mj-text>
          <mj-text>
            This code is valid for 24 hours. Enter it on the password reset page to create a new password.
          </mj-text>
          <mj-text>
            If you didn't request a password reset, please ignore this email or contact support.
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Footer Section -->
      <mj-section background-color="#f9f9f9" padding="20px">
        <mj-column>
          <mj-text font-size="12px" color="#666" align="center">
            &copy; {{year}} Super Deals. All rights reserved.
          </mj-text>
          <mj-text font-size="12px" color="#666" align="center">
            This is an automated message, please do not reply.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
`;

const template = {
  templateName: "CustomerPasswordReset",
  subjectPart: "Reset Your Super Deals Password",
  textPart: "We received a request to reset your Super Deals account password. Please use the verification code provided to create a new password.",
  htmlPart: htmlPart,
  parsingOptions: {
    beautify: true,
  },
};

module.exports = template;
