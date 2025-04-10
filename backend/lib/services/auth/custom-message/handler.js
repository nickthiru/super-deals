/**
 * Cognito Custom Message Lambda Trigger
 *
 * This Lambda function customizes the email verification message based on user type.
 * It's triggered when Cognito sends verification emails, forgot password emails, etc.
 *
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-lambda-custom-message.html
 */

exports.handler = async (event) => {
  console.log("Custom Message event:", JSON.stringify(event, null, 2));

  // Get the verification code from the event
  const { codeParameter } = event.request;

  // Get the user attributes
  const userAttributes = event.request.userAttributes || {};
  const username = userAttributes.userName || userAttributes.email || '';

  // Determine user type (merchant or customer)
  const userGroup = userAttributes["custom:userGroup"] || "";
  const businessName = userAttributes["custom:businessName"] || "";
  const isMerchant = userGroup === "Merchant" || businessName;

  // Get the client app metadata
  // const clientMetadata = event.callerContext.clientMetadata || {};
  // const appUrl = clientMetadata.appUrl || process.env.APP_URL;
  const appUrl = process.env.APP_URL;

  // Get the trigger source to determine what type of message we're sending
  const { triggerSource } = event;

  // Customize the message based on the trigger source and user type
  if (
    triggerSource === "CustomMessage_SignUp" ||
    triggerSource === "CustomMessage_ResendCode"
  ) {
    // This is a sign-up or resend verification code email
    if (isMerchant) {
      // Merchant verification email
      event.response.emailSubject = "Verify your Super Deals Merchant Account";
      event.response.emailMessage = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .button { display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
            .verification-code { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; letter-spacing: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Super Deals Merchant Verification</h1>
            </div>
            <div class="content">
              <p>Hello ${businessName || "Merchant"},</p>
              <p>Thank you for registering your business with Super Deals! To complete your merchant account setup, please verify your email address.</p>
              <p>Your verification code is:</p>
              <div class="verification-code">${codeParameter}</div>
              <p>This code is valid for 24 hours. Enter it on the verification page to activate your merchant account.</p>
              <p style="text-align: center; margin-top: 20px;">
                <a href="${appUrl}/auth/confirm-sign-up?username=${username}" class="button" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Verify Email Address</a>
              </p>
              <p>Once verified, you'll be able to create deals, manage your business profile, and start reaching new customers.</p>
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Super Deals. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      // Customer verification email
      event.response.emailSubject = "Verify your Super Deals Account";
      event.response.emailMessage = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #3B82F6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .button { display: inline-block; background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
            .verification-code { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; letter-spacing: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Super Deals!</h1>
            </div>
            <div class="content">
              <p>Hello there,</p>
              <p>Thank you for signing up with Super Deals! To complete your registration, please verify your email address.</p>
              <p>Your verification code is:</p>
              <div class="verification-code">${codeParameter}</div>
              <p>This code is valid for 24 hours. Enter it on the verification page to activate your account.</p>
              <p style="text-align: center; margin-top: 20px;">
                <a href="${appUrl}/auth/confirm-sign-up?username=${username}" class="button" style="display: inline-block; background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Verify Email Address</a>
              </p>
              <p>Once verified, you'll have access to exclusive deals from our merchant partners.</p>
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Super Deals. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }
  } else if (triggerSource === "CustomMessage_ForgotPassword") {
    // This is a forgot password email
    if (isMerchant) {
      // Merchant forgot password email
      event.response.emailSubject = "Reset Your Super Deals Merchant Password";
      event.response.emailMessage = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .verification-code { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; letter-spacing: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Super Deals Merchant Password Reset</h1>
            </div>
            <div class="content">
              <p>Hello ${businessName || "Merchant"},</p>
              <p>We received a request to reset your Super Deals merchant account password.</p>
              <p>Your password reset code is:</p>
              <div class="verification-code">${codeParameter}</div>
              <p>This code is valid for 24 hours. Enter it on the password reset page to create a new password.</p>
              <p>If you didn't request a password reset, please ignore this email or contact support.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Super Deals. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      // Customer forgot password email
      event.response.emailSubject = "Reset Your Super Deals Password";
      event.response.emailMessage = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #3B82F6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .verification-code { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; letter-spacing: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Super Deals Password Reset</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your Super Deals account password.</p>
              <p>Your password reset code is:</p>
              <div class="verification-code">${codeParameter}</div>
              <p>This code is valid for 24 hours. Enter it on the password reset page to create a new password.</p>
              <p>If you didn't request a password reset, please ignore this email or contact support.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Super Deals. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }
  }

  // Return the updated event
  return event;
};
