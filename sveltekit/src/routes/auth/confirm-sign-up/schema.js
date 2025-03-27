import { zfd } from 'zod-form-data';
import { z } from 'zod';

/**
 * Verification code schema
 * Validates the 6-digit verification code input
 */
export const verificationSchema = zfd.formData({
  // Email and user type fields
  email: zfd.text(
    z.string()
      .min(1, 'Email is required')
      .email('Invalid email address')
  ),
  userType: zfd.text(
    z.string()
      .default('merchant')
  ),
  
  // Individual verification code digits
  code1: zfd.text(
    z.string()
      .length(1, 'Required')
      .regex(/^\d$/, 'Must be a digit')
  ),
  code2: zfd.text(
    z.string()
      .length(1, 'Required')
      .regex(/^\d$/, 'Must be a digit')
  ),
  code3: zfd.text(
    z.string()
      .length(1, 'Required')
      .regex(/^\d$/, 'Must be a digit')
  ),
  code4: zfd.text(
    z.string()
      .length(1, 'Required')
      .regex(/^\d$/, 'Must be a digit')
  ),
  code5: zfd.text(
    z.string()
      .length(1, 'Required')
      .regex(/^\d$/, 'Must be a digit')
  ),
  code6: zfd.text(
    z.string()
      .length(1, 'Required')
      .regex(/^\d$/, 'Must be a digit')
  )
});

/**
 * Resend verification code schema
 * Validates the email for resending the verification code
 */
export const resendSchema = zfd.formData({
  email: zfd.text(
    z.string()
      .min(1, 'Email is required')
      .email('Invalid email address')
  ),
  userType: zfd.text(
    z.string()
      .default('merchant')
  )
});
