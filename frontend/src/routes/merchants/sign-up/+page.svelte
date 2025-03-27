<script>
  import { goto } from '$app/navigation';
  import { z } from 'zod';
  import Header from '$lib/components/shared/Header/Header.svelte';
  import SimpleFooter from '$lib/components/shared/layout/footer/SimpleFooter.svelte';
  import MerchantSignUpSection from '$lib/components/pages/merchants/sign-up/MerchantSignUpSection.svelte';
  import { registerMerchant } from '$lib/stores/merchantStore';
  
  // Using $state() instead of let for Svelte 5 reactivity
  let businessName = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  /** @type {string|null} */
  let error = $state(null);
  let isLoading = $state(false);

  // Validation schema
  const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters long');

  const signUpSchema = z.object({
    businessName: z.string()
      .min(1, 'Business Name is required')
      .max(255, 'Business Name must be 255 characters or less'),
    email: z.string()
      .email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: passwordSchema
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  });

  /**
   * Validate form data using Zod schema
   * @param {Object} data - Form data to validate
   * @returns {{ success: boolean, error?: string }} Validation result with success and optional error
   */
  function validateForm(data) {
    try {
      signUpSchema.parse(data);
      return { success: true };
    } catch (err) {
      if (err instanceof z.ZodError) {
        const firstError = err.errors[0];
        return {
          success: false,
          error: `${firstError.path.join('.')}: ${firstError.message}`
        };
      }
      return {
        success: false,
        error: 'Invalid form data'
      };
    }
  }

  /**
   * Handle merchant sign-up using our merchant service
   */
  async function handleSignUp() {
    error = null;
    isLoading = true;

    const validation = validateForm({
      businessName,
      email,
      password,
      confirmPassword
    });

    if (!validation.success) {
      error = validation.error || 'Validation failed';
      isLoading = false;
      return;
    }

    try {
      // Create merchant data object
      const merchantData = {
        businessName,
        email,
        password,
        registrationNumber: '', // Will be collected later
        yearOfRegistration: new Date().getFullYear(),
        businessType: 'General', // Default value
        phone: '', // Will be collected later
        address: '', // Will be collected later
        city: '', // Will be collected later
        state: '', // Will be collected later
        country: '', // Will be collected later
        postalCode: '' // Will be collected later
      };

      const result = await registerMerchant(merchantData);

      if (result.success) {
        // Store email for verification page
        localStorage.setItem('pendingConfirmation', email);
        localStorage.setItem('pendingUserType', 'merchant');
        
        // Navigate to confirmation page
        goto('/auth/confirm-sign-up');
      } else {
        error = result.error;
      }
    } catch (err) {
      console.error('Sign up error:', err);
      error = err instanceof Error ? err.message : 'Failed to sign up. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50">
    <Header />
    <main class="pt-24">
        <MerchantSignUpSection 
            bind:businessName
            bind:email
            bind:password
            bind:confirmPassword
            {error}
            {isLoading}
            on:submit={handleSignUp}
        />
    </main>
    <SimpleFooter />
</div>