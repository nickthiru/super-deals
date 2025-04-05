import { zfd } from 'zod-form-data';
import { z } from 'zod';

/**
 * Step 1: Account Information schema
 * Validates business name, email, password, and password confirmation
 */
export const step1Schema = zfd.formData({
  businessName: zfd.text(
    z.string()
      .min(1, 'Business name is required')
      .max(255, 'Business name must be 255 characters or less')
  ),
  email: zfd.text(
    z.string()
      .min(1, 'Email is required')
      .email('Invalid email address')
  ),
  password: zfd.text(
    z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
  ),
  confirmPassword: zfd.text(
    z.string()
      .min(1, 'Please confirm your password')
  ),
  currentStep: zfd.text()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword']
});

/**
 * Step 2: Business Information schema
 * Validates registration number, year of registration, business type, and optional website
 */
export const step2Schema = zfd.formData({
  registrationNumber: zfd.text(
    z.string()
      .min(1, 'Registration number is required')
  ),
  yearOfRegistration: zfd.text(
    z.string()
      .min(1, 'Year of registration is required')
  ),
  businessType: zfd.text(
    z.string()
      .min(1, 'Business type is required')
  ),
  website: zfd.text(
    z.string()
      .optional()
      .transform(val => val || undefined)
  ),
  currentStep: zfd.text()
});

/**
 * Step 3: Contact Information schema
 * Validates contact details, address, primary contact, product categories, and terms acceptance
 */
export const step3Schema = zfd.formData({
  // Contact information
  phone: zfd.text(
    z.string()
      .min(1, 'Phone is required')
  ),
  
  // Address
  buildingNumber: zfd.text(
    z.string()
      .min(1, 'Building number is required')
  ),
  street: zfd.text(
    z.string()
      .min(1, 'Street is required')
  ),
  city: zfd.text(
    z.string()
      .min(1, 'City is required')
  ),
  state: zfd.text(
    z.string()
      .min(1, 'State is required')
  ),
  zip: zfd.text(
    z.string()
      .min(1, 'ZIP code is required')
  ),
  country: zfd.text(
    z.string()
      .min(1, 'Country is required')
  ),
  
  // Primary contact
  primaryContactName: zfd.text(
    z.string()
      .min(1, 'Primary contact name is required')
  ),
  primaryContactEmail: zfd.text(
    z.string()
      .min(1, 'Primary contact email is required')
      .email('Invalid primary contact email')
  ),
  primaryContactPhone: zfd.text(
    z.string()
      .min(1, 'Primary contact phone is required')
  ),
  
  // Product categories - parse JSON string into array
  productCategories: zfd.text()
    .transform(val => {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // Return empty array if parsing fails
        return [];
      }
    })
    .refine(val => val.length > 0, {
      message: 'At least one product category is required'
    }),
  
  // Terms and conditions
  acceptTerms: zfd.checkbox({ trueValue: 'on' })
    .refine(val => val === true, {
      message: 'You must accept the terms and conditions'
    }),
    
  currentStep: zfd.text()
});
