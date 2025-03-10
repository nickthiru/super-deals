<script>
  import { confirmSignUp, resendSignUpCode, signIn } from 'aws-amplify/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Header from '$lib/components/shared/Header/Header.svelte';
  import SimpleFooter from '$lib/components/shared/layout/footer/SimpleFooter.svelte';

  /**
   * @type {string}
   */
  let email = localStorage.getItem('pendingConfirmation') || '';
  
  /**
   * @type {string[]}
   */
  let codeInputs = $state(['', '', '', '', '', '']);
  
  /**
   * @type {string|null}
   */
  let error = $state(null);
  
  /**
   * @type {string|null}
   */
  let message = $state(null);
  
  /**
   * @type {boolean}
   */
  let isLoading = $state(false);
  
  /**
   * @type {HTMLInputElement[]}
   */
  let inputRefs = $state([]);
  
  /**
   * @type {string}
   */
  let userType = localStorage.getItem('pendingUserType') || 'merchant';

  // Initialize on component mount
  onMount(() => {
    if (!email) {
      goto(`/${userType}s/sign-up`);
      return;
    }
    
    if (inputRefs[0]) {
      inputRefs[0].focus();
    }
  });

  /**
   * Get the full confirmation code
   * @returns {string}
   */
  function getConfirmationCode() {
    return codeInputs.join('');
  }

  /**
   * Handle input change and auto-focus next input
   * @param {Event} event
   * @param {number} index
   */
  function handleInputChange(event, index) {
    const value = /** @type {HTMLInputElement} */ (event.target).value;
    
    // Only allow digits
    if (!/^\d*$/.test(value)) {
      return;
    }
    
    // If user enters multiple digits at once, distribute them
    if (value.length > 1) {
      const digits = value.split('');
      for (let i = 0; i < digits.length && index + i < codeInputs.length; i++) {
        codeInputs[index + i] = digits[i];
      }
      
      // Focus the next empty input or the last input
      const nextIndex = Math.min(index + value.length, codeInputs.length - 1);
      if (inputRefs[nextIndex]) {
        inputRefs[nextIndex].focus();
      }
      return;
    }
    
    // Update the current input
    codeInputs[index] = value;
    
    // Auto-focus next input if current input is filled
    if (value && index < codeInputs.length - 1 && inputRefs[index + 1]) {
      inputRefs[index + 1].focus();
    }
  }

  /**
   * Handle backspace key to navigate to previous input
   * @param {KeyboardEvent} event
   * @param {number} index
   */
  function handleKeyDown(event, index) {
    if (event.key === 'Backspace' && !codeInputs[index] && index > 0 && inputRefs[index - 1]) {
      inputRefs[index - 1].focus();
    }
  }

  /**
   * Handle confirmation submission
   * @param {Event} event
   */
  async function handleConfirm(event) {
    event.preventDefault();

    error = null;
    message = null;
    isLoading = true;

    const confirmationCode = getConfirmationCode();
    
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

      localStorage.removeItem('pendingConfirmation');
      localStorage.removeItem('pendingUserType');
      
      message = 'Email confirmed! Signing you in...';
      
      // Sign in the user
      await signIn({
        username: email,
        options: {
          preferPrivateSession: true
        }
      });
      
      // Redirect to dashboard
      goto(`/${userType}s/dashboard`);
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
      console.error('Resend error:', err);
      error = err instanceof Error ? err.message : 'Failed to resend confirmation code. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
  <Header />
  
  <main class="flex-grow flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
        <p class="text-gray-600">
          We've sent a verification code to <span class="font-medium">{email}</span>
        </p>
      </div>
      
      {#if error}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p class="text-red-600 text-sm">{error}</p>
        </div>
      {/if}
      
      {#if message}
        <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p class="text-green-600 text-sm">{message}</p>
        </div>
      {/if}
      
      <form onsubmit={handleConfirm} class="space-y-6">
        <div>
          <label for="verification-code" class="block text-sm font-medium text-gray-700 mb-2">
            Enter verification code
          </label>
          <div class="flex justify-between gap-2">
            {#each codeInputs as input, i}
              <input
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="w-12 h-12 text-center text-xl font-medium border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                value={input}
                oninput={(e) => handleInputChange(e, i)}
                onkeydown={(e) => handleKeyDown(e, i)}
                bind:this={inputRefs[i]}
                aria-label={`Digit ${i + 1}`}
              />
            {/each}
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </div>
      </form>
      
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          Didn't receive the code?
          <button
            type="button"
            class="text-primary hover:text-primary-dark font-medium"
            onclick={handleResend}
            disabled={isLoading}
          >
            Resend code
          </button>
        </p>
      </div>
    </div>
  </main>
  
  <SimpleFooter />
</div>
