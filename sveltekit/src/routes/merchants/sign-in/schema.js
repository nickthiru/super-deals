import { zfd } from 'zod-form-data';
import { z } from 'zod';

/**
 * Sign-in schema
 * Validates email and password for merchant sign-in
 */
export const signInSchema = zfd.formData({
  email: zfd.text(
    z.string()
      .min(1, 'Email is required')
      .email('Invalid email address')
  ),
  password: zfd.text(
    z.string()
      .min(1, 'Password is required')
  ),
  rememberMe: zfd.checkbox({ trueValue: 'on' })
    .optional()
    .transform(val => val === true)
});
