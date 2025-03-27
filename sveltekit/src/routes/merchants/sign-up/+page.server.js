import { fail } from '@sveltejs/kit';
import { dev } from '$app/environment';
import * as merchantService from '$lib/services/api/merchantService';
import { step1Schema, step2Schema, step3Schema } from './schema.js';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const currentStep = parseInt(formData.get('currentStep')?.toString() || '1', 10);
    
    if (dev) {
      console.log(`Processing sign-up form - Step ${currentStep}`);
      console.log('Form data:', Object.fromEntries(formData.entries()));
    }
    
    // Step 1: Account Information
    if (currentStep === 1) {
      const result = step1Schema.safeParse(formData);
      
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return fail(400, { 
          success: false, 
          error: Object.values(errors)[0]?.[0] || 'Validation failed', 
          errors,
          step: 1 
        });
      }
      
      const { businessName, email, password } = result.data;
      
      // Store validated data in cookies for later steps
      cookies.set('signup_businessName', businessName, { path: '/', httpOnly: false, maxAge: 60 * 30 });
      cookies.set('signup_email', email, { path: '/', httpOnly: false, maxAge: 60 * 30 });
      cookies.set('signup_password', password, { path: '/', httpOnly: false, maxAge: 60 * 30 });
      
      return {
        success: true,
        step: 1
      };
    }
    
    // Step 2: Business Information
    else if (currentStep === 2) {
      const result = step2Schema.safeParse(formData);
      
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return fail(400, { 
          success: false, 
          error: Object.values(errors)[0]?.[0] || 'Validation failed',
          errors,
          step: 2 
        });
      }
      
      const { registrationNumber, yearOfRegistration, businessType, website } = result.data;
      
      // Store validated data in cookies for later steps
      cookies.set('signup_registrationNumber', registrationNumber, { path: '/', httpOnly: false, maxAge: 60 * 30 });
      cookies.set('signup_yearOfRegistration', yearOfRegistration, { path: '/', httpOnly: false, maxAge: 60 * 30 });
      cookies.set('signup_businessType', businessType || 'retail', { path: '/', httpOnly: false, maxAge: 60 * 30 });
      if (website) {
        cookies.set('signup_website', website, { path: '/', httpOnly: false, maxAge: 60 * 30 });
      }
      
      return {
        success: true,
        step: 2
      };
    }
    
    // Step 3: Contact Information and Final Submission
    else if (currentStep === 3) {
      // First try to get data from form submission (client-side multi-step form)
      let businessName = formData.get('businessName')?.toString() || '';
      let email = formData.get('email')?.toString() || '';
      let password = formData.get('password')?.toString() || '';
      let registrationNumber = formData.get('registrationNumber')?.toString() || '';
      let yearOfRegistration = formData.get('yearOfRegistration')?.toString() || '';
      let businessType = formData.get('businessType')?.toString() || 'retail';
      let website = formData.get('website')?.toString() || '';
      
      // If not available in form data, fall back to cookies (server-side multi-step form)
      if (!businessName) businessName = cookies.get('signup_businessName') || '';
      if (!email) email = cookies.get('signup_email') || '';
      if (!password) password = cookies.get('signup_password') || '';
      if (!registrationNumber) registrationNumber = cookies.get('signup_registrationNumber') || '';
      if (!yearOfRegistration) yearOfRegistration = cookies.get('signup_yearOfRegistration') || '';
      if (!businessType) businessType = cookies.get('signup_businessType') || 'retail';
      if (!website) website = cookies.get('signup_website') || '';
      
      // Validate required data
      if (!businessName || !email || !password || !registrationNumber || !yearOfRegistration) {
        return fail(400, { 
          success: false, 
          error: 'Missing required information from previous steps. Please start over.', 
          step: 1 
        });
      }
      
      const result = step3Schema.safeParse(formData);
      
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return fail(400, { 
          success: false, 
          error: Object.values(errors)[0]?.[0] || 'Validation failed',
          errors,
          step: 3 
        });
      }
      
      const {
        phone,
        buildingNumber,
        street,
        city,
        state,
        zip,
        country,
        primaryContactName,
        primaryContactEmail,
        primaryContactPhone,
        productCategories
      } = result.data;
      
      // Construct merchant data object
      const merchantData = {
        businessName,
        email,
        password,
        registrationNumber,
        yearOfRegistration: parseInt(yearOfRegistration || '0', 10),
        businessType,
        website: website || undefined,
        phone,
        address: {
          buildingNumber,
          street,
          city,
          state,
          zip,
          country
        },
        primaryContact: {
          name: primaryContactName,
          email: primaryContactEmail,
          phone: primaryContactPhone
        },
        productCategories
      };
      
      if (dev) {
        console.log('Submitting merchant data:', merchantData);
      }
      
      try {
        // Call merchant service to register the merchant
        const result = await merchantService.signUp(merchantData);
        
        if (dev) {
          console.log('Registration result:', result);
        }
        
        // Clear cookies
        cookies.delete('signup_businessName', { path: '/' });
        cookies.delete('signup_email', { path: '/' });
        cookies.delete('signup_password', { path: '/' });
        cookies.delete('signup_registrationNumber', { path: '/' });
        cookies.delete('signup_yearOfRegistration', { path: '/' });
        cookies.delete('signup_businessType', { path: '/' });
        cookies.delete('signup_website', { path: '/' });
        
        // Set cookie for confirmation page
        cookies.set('pendingConfirmation', email, { 
          path: '/', 
          httpOnly: false, // Allow client-side access
          maxAge: 60 * 30, // 30 minutes
          sameSite: 'lax' // Ensure cookie is sent with same-site navigations
        });
        cookies.set('pendingUserType', 'merchant', { 
          path: '/', 
          httpOnly: false, // Allow client-side access
          maxAge: 60 * 30, // 30 minutes
          sameSite: 'lax' // Ensure cookie is sent with same-site navigations
        });
        
        // Store in localStorage via client-side script
        if (dev) {
          // In development mode, we might want to show the verification code
          if (result && typeof result === 'object' && 'verificationCode' in result) {
            const verificationCode = String(result.verificationCode);
            cookies.set('devVerificationCode', verificationCode, { 
              path: '/', 
              httpOnly: false,
              maxAge: 60 * 30
            });
          }
        }
        
        // Return success with redirect info
        return {
          success: true,
          step: 3,
          completed: true,
          email: email,
          userType: 'merchant',
          redirect: '/auth/confirm-sign-up'
        };
      } catch (error) {
        if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
          // This is our redirect, pass it through
          throw error;
        }
        
        if (dev) {
          console.error('Registration error:', error);
        }
        
        // Handle API errors
        let errorMessage = 'Failed to register merchant. Please try again.';
        
        if (error && typeof error === 'object') {
          if ('code' in error && error.code === 'UsernameExistsException') {
            errorMessage = 'An account with this email already exists.';
          } else if ('message' in error && typeof error.message === 'string') {
            errorMessage = error.message;
          }
        }
        
        return fail(400, { 
          success: false, 
          error: errorMessage, 
          step: 3 
        });
      }
    }
    
    // Invalid step
    return fail(400, { 
      success: false, 
      error: 'Invalid form step', 
      step: 1 
    });
  }
};
