<script>
  /**
   * Import required modules
   */
  import { confirmSignUp, resendSignUpCode, signInWithRedirect } from 'aws-amplify/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  /**
   * Initialize variables
   * @type {string} email - Email address
   * @type {string} confirmationCode - Confirmation code
   * @type {string|null} error - Error message
   * @type {string|null} message - Success message
   * @type {boolean} isLoading - Loading state
   */
  /** @type {string} */
  let email = '';
  /** @type {string} */
  let confirmationCode = '';
  /** @type {string|null} */
  let error = null;
  /** @type {string|null} */
  let message = null;
  /** @type {boolean} */
  let isLoading = false;

  /**
   * On mount, get email from localStorage
   */
  onMount(() => {
    email = localStorage.getItem('pendingConfirmation') || '';
    if (!email) {
      goto('/merchants/sign-up');
    }
  });

  /**
   * Handle confirmation code submission
   * @param {Event} event - Form submission event
   */
  async function handleConfirm(event) {
    event.preventDefault();
    error = null;
    message = null;
    isLoading = true;

    try {
      await confirmSignUp({
        username: email,
        confirmationCode
      });

      // Clear the stored email
      localStorage.removeItem('pendingConfirmation');
      
      // Show success message briefly
      message = 'Email confirmed! Signing you in...';
      
      // Automatically sign in
      await signInWithRedirect({
        username: email,
        options: {
          preferPrivateSession: true
        }
      });
    } catch (err) {
      console.error('Confirmation error:', err);
      error = err instanceof Error ? err.message : 'Failed to confirm sign up. Please try again.';
      isLoading = false;
    }
  }

  /**
   * Handle resending confirmation code
   * @param {Event} event - Button click event
   */
  async function handleResend(event) {
    event.preventDefault();
    error = null;
    message = null;
    isLoading = true;

    try {
      await resendSignUpCode({
        username: email
      });
      message = 'Confirmation code resent! Please check your email.';
    } catch (err) {
      console.error('Error resending code:', err);
      error = err instanceof Error ? err.message : 'Failed to resend code. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<h1>Confirm Your Email</h1>

<form on:submit={handleConfirm}>
  <p>Please enter the confirmation code sent to {email}</p>

  <label>
    Confirmation Code
    <input 
      bind:value={confirmationCode}
      type="text" 
      required 
      inputmode="numeric" 
      pattern="[0-9]*"
      disabled={isLoading}
    >
  </label>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  {#if message}
    <p class="message">{message}</p>
  {/if}

  <div class="actions">
    <button type="submit" disabled={isLoading}>
      {#if isLoading}
        Confirming...
      {:else}
        Confirm
      {/if}
    </button>
    <button 
      type="button" 
      on:click={handleResend}
      disabled={isLoading}
    >
      Resend Code
    </button>
  </div>
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

  .message {
    color: #4CAF50;
    margin: 0;
  }

  .actions {
    display: flex;
    gap: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    flex: 1;
  }

  button[type="button"] {
    background: #666;
  }

  button:hover:not(:disabled) {
    opacity: 0.9;
  }

  button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
</style>