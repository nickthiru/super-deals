<script>
  /**
   * Import required modules
   */
  import { confirmSignUp, resendSignUpCode, signInWithRedirect } from 'aws-amplify/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Header from '$lib/components/shared/Header/Header.svelte';
  import SimpleFooter from '$lib/components/shared/layout/footer/SimpleFooter.svelte';

  /**
   * Initialize variables
   * @type {string} email - Email address
   * @type {string[]} codeInputs - Array of verification code inputs
   * @type {string|null} error - Error message
   * @type {string|null} message - Success message
   * @type {boolean} isLoading - Loading state
   */
  /** @type {string} */
  let email = '';
  /** @type {string[]} */
  let codeInputs = ['', '', '', '', '', ''];
  /** @type {string|null} */
  let error = null;
  /** @type {string|null} */
  let message = null;
  /** @type {boolean} */
  let isLoading = false;
  /** @type {HTMLInputElement[]} */
  let inputRefs = [];

  /**
   * On mount, get email from localStorage
   */
  onMount(() => {
    email = localStorage.getItem('pendingConfirmation') || '';
    if (!email) {
      goto('/merchants/sign-up');
    }
    // Focus the first input field
    if (inputRefs[0]) {
      inputRefs[0].focus();
    }
  });

  /**
   * Handle input change and auto-focus next input
   * @param {Event} event - Input event
   * @param {number} index - Input index
   */
  function handleInputChange(event, index) {
    const input = event.target;
    const value = input.value;
    
    // Update the code inputs array
    codeInputs[index] = value;
    
    // Auto-focus next input if value is entered
    if (value && index < 5 && inputRefs[index + 1]) {
      inputRefs[index + 1].focus();
    }
  }

  /**
   * Handle key down event for backspace
   * @param {KeyboardEvent} event - Keyboard event
   * @param {number} index - Input index
   */
  function handleKeyDown(event, index) {
    // If backspace is pressed and current input is empty, focus previous input
    if (event.key === 'Backspace' && !codeInputs[index] && index > 0 && inputRefs[index - 1]) {
      inputRefs[index - 1].focus();
    }
  }

  /**
   * Get the full confirmation code from inputs
   * @returns {string} - Combined confirmation code
   */
  function getConfirmationCode() {
    return codeInputs.join('');
  }

  /**
   * Handle confirmation code submission
   * @param {Event} event - Form submission event
   */
  async function handleConfirm(event) {
    event.preventDefault();
    error = null;
    message = null;
    isLoading = true;

    const confirmationCode = getConfirmationCode();
    
    // Validate the code length
    if (confirmationCode.length !== 6) {
      error = 'Please enter all 6 digits of the verification code';
      isLoading = false;
      return;
    }

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
   */
  async function handleResend() {
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

<div class="min-h-screen bg-gray-50 flex flex-col">
  <Header />
  <main class="flex-grow flex items-center justify-center py-12">
    <div class="w-full max-w-md px-6">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center mb-8">
          <i class="fa-regular fa-envelope text-facebook text-4xl mb-4"></i>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">Verify your email</h1>
          <p class="text-gray-600">We've sent a verification code to<br /><span class="font-medium">{email}</span></p>
        </div>
        
        <form on:submit={handleConfirm} class="space-y-6">
          <div>
            <label for="verification-code" class="block text-sm font-medium text-gray-700 mb-2">
              Enter verification code
            </label>
            <div class="flex justify-between gap-2">
              {#each Array(6) as _, i}
                <input
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  pattern="[0-9]"
                  class="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  bind:value={codeInputs[i]}
                  bind:this={inputRefs[i]}
                  on:input={(e) => handleInputChange(e, i)}
                  on:keydown={(e) => handleKeyDown(e, i)}
                  disabled={isLoading}
                  required
                />
              {/each}
            </div>
          </div>
          
          {#if error}
            <div class="bg-red-50 border-l-4 border-red-500 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <i class="fa-solid fa-circle-exclamation text-red-500"></i>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          {/if}
          
          {#if message}
            <div class="bg-green-50 border-l-4 border-green-500 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <i class="fa-solid fa-circle-check text-green-500"></i>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-green-700">{message}</p>
                </div>
              </div>
            </div>
          {/if}
          
          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={isLoading}
            >
              {#if isLoading}
                <i class="fa-solid fa-spinner fa-spin mr-2"></i> Verifying...
              {:else}
                Verify Email
              {/if}
            </button>
          </div>
          
          <div class="text-center">
            <p class="text-sm text-gray-600">
              Didn't receive the code?
              <button
                type="button"
                class="text-primary hover:text-primary-dark font-medium focus:outline-none"
                on:click={handleResend}
                disabled={isLoading}
              >
                Resend code
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </main>
  <SimpleFooter />
</div>