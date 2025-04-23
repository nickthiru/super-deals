/**
 * Sign-in form validation schemas
 */

import { z } from 'zod';

/**
 * Schema for sign-in form validation
 */
export const signInSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters'),
  userType: z
    .string()
    .optional()
    .transform(val => val || 'merchant') // Default to merchant if not provided
});

/**
 * Schema for forgot password form validation
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address'),
  userType: z
    .string()
    .optional()
    .transform(val => val || 'merchant') // Default to merchant if not provided
});
