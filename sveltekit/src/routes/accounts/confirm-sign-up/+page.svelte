<!-- 
  Confirm Sign Up Page
  Handles email verification after sign-up
-->

<script>
  import { enhance, applyAction } from '$app/forms';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { dev } from '$app/environment';
  
  // Props using Svelte 5 runes
  const { data, form } = $props();
  
  // Reactive state using Svelte 5 runes
  const formState = $state({
    codeInputs: ['', '', '', '', '', ''],
    error: '',
    message: '',
    isLoading: false,
    isResending: false,
    inputRefs: /** @type {HTMLInputElement[]} */ ([]),
    showDevInfo: false,
    verificationAttempts: 0,
    redirecting: false,
    emailAddress: '',
    userTypeValue: 'merchant'
  });
  
  import { untrack } from 'svelte';

  // Initialize on component mount - using untrack to prevent infinite loops
  $effect(() => {
    // Use untrack to prevent reactivity tracking for initialization
    untrack(() => {
      // Get email from data (server)
      formState.emailAddress = data?.email || '';
      formState.userTypeValue = data?.userType || 'merchant';
      
      // Only access browser APIs when in browser environment
      if (browser) {
        // If we don't have an email from the server, try localStorage
        if (!formState.emailAddress) {
          formState.emailAddress = localStorage.getItem('pendingConfirmation') || '';
          formState.userTypeValue = localStorage.getItem('pendingUserType') || 'merchant';
          
          if (dev) {
            console.log('Email from localStorage:', formState.emailAddress);
          }
        } else if (formState.emailAddress) {
          // If we have an email from the server, store it in localStorage
          localStorage.setItem('pendingConfirmation', formState.emailAddress);
          localStorage.setItem('pendingUserType', formState.userTypeValue);
          
          if (dev) {
            console.log('Email from server stored in localStorage:', formState.emailAddress);
          }
        }
        
        // In dev mode, show verification code from localStorage
        if (dev) {
          formState.showDevInfo = true;
        }
      }
    });
  });
  
  // Handle form results from server
  $effect(() => {
    if (form) {
      if (form.success === false && form.error) {
        formState.error = form.error;
        formState.isLoading = false;
        formState.verificationAttempts += 1;
      } else if (form.success === true && form.message) {
        formState.message = form.message;
        
        // If resend was successful, reset the form
        if (form && typeof form === 'object' && 'type' in form && form.type === 'resend') {
          formState.isResending = false;
        }
      }
    }
  });
  
  /**
   * @param {Event} event - Input event
   * @param {number} index - Input index
   */
  function handleInputChange(event, index) {
    const value = /** @type {HTMLInputElement} */ (event.target).value;
    
    // Only allow digits and handle the case where multiple digits are entered
    if (/^\d*$/.test(value)) {
      // If more than one digit is entered (e.g., from paste), distribute them
      if (value.length > 1) {
        const digits = value.split('');
        
        // Update current and subsequent inputs
        for (let i = 0; i < digits.length && index + i < 6; i++) {
          formState.codeInputs[index + i] = digits[i];
          // Update the actual input field
          if (formState.inputRefs[index + i]) {
            formState.inputRefs[index + i].value = digits[i];
          }
        }
        
        // Focus on the next empty field or the last field
        const nextEmptyIndex = formState.codeInputs.findIndex((val, idx) => idx > index && !val);
        if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
          formState.inputRefs[nextEmptyIndex]?.focus();
        } else if (index + digits.length < 6) {
          formState.inputRefs[index + digits.length]?.focus();
        } else {
          formState.inputRefs[5]?.focus();
        }
      } else {
        // Single digit entered - normal case
        formState.codeInputs[index] = value;
        
        // Auto-advance to next field if this one is filled
        if (value && index < 5) {
          formState.inputRefs[index + 1]?.focus();
        }
      }
    } else {
      // Reset to previous value if non-digit was entered
      /** @type {HTMLInputElement} */ (event.target).value = formState.codeInputs[index];
    }
  }
  
  /**
   * @param {KeyboardEvent} event - Keyboard event
   * @param {number} index - Input index
   */
  function handleKeyDown(event, index) {
    // Handle backspace
    if (event.key === 'Backspace') {
      if (!formState.codeInputs[index] && index > 0) {
        // If current field is empty and backspace is pressed, go to previous field
        formState.inputRefs[index - 1]?.focus();
      }
    } 
    // Handle arrow keys
    else if (event.key === 'ArrowLeft' && index > 0) {
      formState.inputRefs[index - 1]?.focus();
      event.preventDefault();
    } else if (event.key === 'ArrowRight' && index < 5) {
      formState.inputRefs[index + 1]?.focus();
      event.preventDefault();
    }
  }
  
  /**
   * @param {ClipboardEvent} event - Clipboard event
   */
  function handlePaste(event) {
    if (!event || !event.clipboardData) return;
    
    event.preventDefault();
    
    // Get pasted data
    const pastedData = event.clipboardData.getData('text');
    
    // Extract digits only - up to 6 digits
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');
    
    if (digits.length > 0) {
      // Create a copy of the current code inputs
      const newCodeInputs = [...formState.codeInputs];
      
      // Update inputs with pasted digits
      digits.forEach((digit, i) => {
        if (i < 6) {
          newCodeInputs[i] = digit;
          
          // Update the DOM input field directly
          if (formState.inputRefs[i]) {
            formState.inputRefs[i].value = digit;
          }
        }
      });
      
      // Update state with all digits at once
      formState.codeInputs = newCodeInputs;
      
      // If we filled all inputs, focus on the last one
      if (digits.length >= 6) {
        formState.inputRefs[5]?.focus();
      } else {
        // Otherwise focus on the next empty field
        const nextEmptyIndex = digits.length;
        if (nextEmptyIndex < 6) {
          formState.inputRefs[nextEmptyIndex]?.focus();
        }
      }
    }
  }
  
  // Toggle resend form
  function toggleResendForm() {
    formState.isResending = !formState.isResending;
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex-shrink-0">
          <a href="/" class="text-blue-600 font-bold text-xl">SuperDeals</a>
        </div>
      </div>
    </div>
  </header>
  
  <main class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
      <div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Verify Your Email
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {#if formState.emailAddress}
            We've sent a 6-digit verification code to<br />
            <span class="font-medium text-blue-600">{formState.emailAddress}</span>
          {:else}
            Please enter your verification code
          {/if}
        </p>
      </div>
      
      {#if formState.error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{formState.error}</span>
        </div>
      {/if}
      
      {#if formState.message}
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{formState.message}</span>
        </div>
      {/if}
      
      {#if formState.showDevInfo}
        <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <p class="font-bold">Development Mode</p>
          <p>Verification code: {browser ? localStorage.getItem('devVerificationCode') : ''}</p>
        </div>
      {/if}
      
      <form 
        id="verification-form"
        method="POST" 
        action="?/verify"
        class="mt-8 space-y-6"
        use:enhance={() => {
          formState.isLoading = true;
          formState.error = '';
          formState.message = '';
          
          return async ({ result }) => {
            formState.isLoading = false;
            
            if (result.type === 'redirect') {
              formState.redirecting = true;
            }
            
            // Let applyAction handle all result types properly
            await applyAction(result);
          };
        }}
      >
        <!-- Hidden email field -->
        <input type="hidden" name="email" value={formState.emailAddress} />
        <input type="hidden" name="userType" value={formState.userTypeValue} />
        
        <fieldset>
          <legend class="block text-sm font-medium text-gray-700 mb-2">
            Enter verification code
          </legend>
          <div class="flex justify-between space-x-2">
            {#each Array(6).fill(0) as _, i}
              <div class="relative">
                <label for={`code${i+1}`} class="sr-only">Digit {i+1}</label>
                <input
                  type="text"
                  id={`code${i+1}`}
                  name={`code${i+1}`}
                  inputmode="numeric"
                  pattern="[0-9]"
                  maxlength="1"
                  required
                  bind:value={formState.codeInputs[i]}
                  bind:this={formState.inputRefs[i]}
                  oninput={(e) => handleInputChange(e, i)}
                  onkeydown={(e) => handleKeyDown(e, i)}
                  onpaste={i === 0 ? handlePaste : undefined}
                  class="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={formState.isLoading || formState.redirecting}
                />
              </div>
            {/each}
          </div>
        </fieldset>
        
        <div>
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={formState.isLoading || formState.redirecting || !formState.codeInputs.every(code => code !== '')}
          >
            {#if formState.isLoading}
              Verifying...
            {:else if formState.redirecting}
              Redirecting...
            {:else}
              Verify Email
            {/if}
          </button>
        </div>
      </form>
      
      <div class="text-center">
        <p class="text-sm text-gray-600">
          Didn't receive a code?
        </p>
        
        {#if formState.isResending}
          <form 
            method="POST" 
            action="?/resendCode"
            class="mt-2"
            use:enhance={() => {
              formState.isLoading = true;
              formState.error = '';
              formState.message = '';
              
              return async ({ result }) => {
                formState.isLoading = false;
                formState.isResending = false;
              };
            }}
          >
            <input type="hidden" name="email" value={formState.emailAddress} />
            <input type="hidden" name="userType" value={formState.userTypeValue} />
            
            <button 
              type="submit" 
              class="text-blue-600 hover:text-blue-500 font-medium"
              disabled={formState.isLoading}
            >
              {formState.isLoading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        {:else}
          <button 
            type="button" 
            class="mt-2 text-blue-600 hover:text-blue-500 font-medium"
            onclick={toggleResendForm}
            disabled={formState.isLoading}
          >
            Resend Code
          </button>
        {/if}
      </div>
    </div>
  </main>
  
  <footer class="bg-white">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <p class="text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} SuperDeals. All rights reserved.
      </p>
    </div>
  </footer>
</div>
