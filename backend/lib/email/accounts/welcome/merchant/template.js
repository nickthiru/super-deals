const htmlPart = `
  <mjml>
    <mj-head>
      <mj-title>Super Deals Merchant Verification</mj-title>
      <mj-font name="Arial" href="https://fonts.googleapis.com/css?family=Arial" />
      <mj-attributes>
        <mj-all font-family="Arial, sans-serif" />
        <mj-text font-size="16px" line-height="1.6" />
      </mj-attributes>
    </mj-head>
    <mj-body background-color="#f9f9f9">
      <!-- Header Section -->
      <mj-section background-color="#4F46E5" padding="20px">
        <mj-column>
          <mj-text color="#ffffff" font-size="24px" font-weight="bold" align="center">
            Super Deals Merchant Verification
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Content Section -->
      <mj-section background-color="#ffffff" padding="20px">
        <mj-column>
          <mj-text>
            Hello {{businessName}},
          </mj-text>
          <mj-text>
            Thank you for registering your business with Super Deals! To complete your merchant account setup, please verify your email address.
          </mj-text>
          <mj-text>
            Your verification code is:
          </mj-text>
          <mj-text font-size="24px" font-weight="bold" align="center" letter-spacing="5px" padding="15px 0">
            {{code}}
          </mj-text>
          <mj-text>
            This code is valid for 24 hours. Enter it on the verification page to activate your merchant account.
          </mj-text>
          <mj-button background-color="#4F46E5" color="white" href="{{appUrl}}/auth/confirm-sign-up?username={{username}}" border-radius="4px" font-weight="bold" inner-padding="15px 30px">
            Verify Email Address
          </mj-button>
          <mj-text>
            Once verified, you'll be able to create deals, manage your business profile, and start reaching new customers.
          </mj-text>
          <mj-text>
            If you didn't create this account, please ignore this email.
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
  templateName: "MerchantWelcome",
  subjectPart: "Welcome to Super Deals Merchant Account",
  textPart:
    "Thank you for registering your business with Super Deals! To complete your merchant account setup, please verify your email address using the verification code provided.",
  htmlPart: htmlPart,
  parsingOptions: {
    beautify: true,
  },
};

module.exports = template;
