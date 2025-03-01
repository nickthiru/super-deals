<script>
  import { signUp } from 'aws-amplify/auth';
  import { goto } from '$app/navigation';
  import { z } from 'zod';
  
  let businessName = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
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
   * @returns {Object} Validation result with success and optional error
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
   * @param {Event} event - Form submission event
   */
  async function handleSignUp(event) {
    event.preventDefault();
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
      error = validation.error;
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
      error = err.message || 'Failed to sign up. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<h1 id="sign-up-title">Merchant Sign-Up</h1>

<form on:submit={handleSignUp} aria-labelledby="sign-up-title">
  <label>
    Business Name
    <input 
      bind:value={businessName}
      type="text" 
      required 
      maxlength="255"
      disabled={isLoading}
    >
  </label>

  <label>
    Email
    <input 
      bind:value={email}
      type="email" 
      required
      disabled={isLoading}
    >
  </label>

  <label>
    Password
    <input 
      bind:value={password}
      type="password" 
      required 
      minlength="8"
      disabled={isLoading}
    >
  </label>

  <label>
    Confirm Password
    <input 
      bind:value={confirmPassword}
      type="password" 
      required 
      minlength="8"
      disabled={isLoading}
    >
  </label>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <button type="submit" disabled={isLoading}>
    {#if isLoading}
      Signing up...
    {:else}
      Sign Up
    {/if}
  </button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
    margin: 0 auto;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  .error {
    color: tomato;
    margin: 0;
  }

  button {
    padding: 0.5rem 1rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  button:hover:not(:disabled) {
    background: #45a049;
  }

  button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
</style>