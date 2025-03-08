<script>
  import { signUp } from 'aws-amplify/auth';
  import { goto } from '$app/navigation';
  import { z } from 'zod';
  import Header from '$lib/components/shared/Header/Header.svelte';
  import SimpleFooter from '$lib/components/shared/layout/footer/SimpleFooter.svelte';
  import MerchantSignUpSection from '$lib/components/pages/merchants/sign-up/MerchantSignUpSection.svelte';
  
  let businessName = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  /** @type {string|null} */
  let error = null;
  let isLoading = false;

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
   * Handle merchant sign-up using Amplify
   */
  async function handleSignUp() {
    error = null;
    isLoading = true;

    // Validate form data
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
      const { userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            'custom:businessName': businessName,
            'custom:userType': 'merchant'
          }
        }
      });

      // Store email for confirmation
      localStorage.setItem('pendingConfirmation', email);
      
      // Redirect to confirmation page
      goto('/merchants/confirm-sign-up');
    } catch (err) {
      console.error('Sign up error:', err);
      /** @type {string} */
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up. Please try again.';
      error = errorMessage;
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