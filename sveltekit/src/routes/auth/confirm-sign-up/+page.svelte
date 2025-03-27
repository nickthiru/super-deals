<!-- 
  Confirm Sign Up Page
  Handles email verification after sign-up
-->

<script>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { dev } from '$app/environment';
  
  // Props using Svelte 5 runes
  const { data, form } = $props();
  
  // Reactive state using Svelte 5 runes
  let codeInputs = $state(['', '', '', '', '', '']);
  let error = $state('');
  let message = $state('');
  let isLoading = $state(false);
  let isResending = $state(false);
  /** @type {HTMLInputElement[]} */
  let inputRefs = $state([]);
  let showDevInfo = $state(false);
  let verificationAttempts = $state(0);
  let redirecting = $state(false);
  let emailAddress = $state('');
  let userTypeValue = $state('merchant');
  
  // Initialize on component mount
  $effect(() => {
    // Get email from data (server)
    emailAddress = data?.email || '';
    userTypeValue = data?.userType || 'merchant';
    
    // Only access browser APIs when in browser environment
    if (browser) {
      // If we don't have an email from the server, try localStorage
      if (!emailAddress) {
        emailAddress = localStorage.getItem('pendingConfirmation') || '';
        userTypeValue = localStorage.getItem('pendingUserType') || 'merchant';
        
        if (dev) {
          console.log('Email from localStorage:', emailAddress);
        }
      } else if (emailAddress) {
        // If we have an email from the server, store it in localStorage
        localStorage.setItem('pendingConfirmation', emailAddress);
        localStorage.setItem('pendingUserType', userTypeValue);
        
        if (dev) {
          console.log('Email from server stored in localStorage:', emailAddress);
        }
      }
      
      // Check for development verification code
      const devVerificationCode = localStorage.getItem('devVerificationCode') || '';
      showDevInfo = !!devVerificationCode;
      
      if (devVerificationCode) {
        console.log('Development verification code:', devVerificationCode);
        
        // Auto-fill the verification code inputs
        if (devVerificationCode.length === 6) {
          for (let i = 0; i < 6; i++) {
            codeInputs[i] = devVerificationCode.charAt(i);
          }
        }
      }
    }
    
    if (dev) {
      console.log('Development mode active');
      console.log('Email address:', emailAddress);
      console.log('User type:', userTypeValue);
    }
    
    // Focus first input
    if (browser && inputRefs[0]) {
      inputRefs[0].focus();
    }
  });
  
  // Handle form submission results
  $effect(() => {
    if (form) {
      if (form.success === false && form.error) {
        error = form.error;
        
        // Increment verification attempts on error
        if (form.error.includes('Invalid verification code')) {
          verificationAttempts++;
          
          // Clear the code after 3 failed attempts
          if (verificationAttempts >= 3) {
            clearVerificationCode();
          }
        }
      } else if (form.success === true && form.message) {
        message = form.message;
        error = '';
        
        // If verification was successful, check for custom properties
        if (form.success && form.message && form.message.includes('verified')) {
          redirecting = true;
          
          if (browser) {
            // Clear verification data
            localStorage.removeItem('pendingConfirmation');
            localStorage.removeItem('pendingUserType');
            localStorage.removeItem('devVerificationCode');
            
            // Redirect after a short delay
            setTimeout(() => {
              goto('/merchants/dashboard');
            }, 1500);
          }
        }
      }
    }
  });
  
  /**
   * Handle input change and auto-focus next input
   * @param {Event} event - Input event
   * @param {number} index - Input index
   */
  function handleInputChange(event, index) {
    if (!event || !event.target) return;
    
    // Type check and ensure target is an input element
    if (event.target instanceof HTMLInputElement) {
      const value = event.target.value;
      
      // Update the value in our state array
      codeInputs[index] = value;
      
      // If value is entered and not the last input, focus next input
      if (value && index < 5) {
        inputRefs[index + 1]?.focus();
      }
    }
  }
  
  /**
   * Handle key down events for navigation between inputs
   * @param {KeyboardEvent} event - Keyboard event
   * @param {number} index - Input index
   */
  function handleKeyDown(event, index) {
    if (!event) return;
    
    // Handle backspace to go to previous input
    if (event.key === 'Backspace' && !codeInputs[index] && index > 0) {
      inputRefs[index - 1]?.focus();
    }
  }
  
  /**
   * Handle paste event to fill all inputs
   * @param {ClipboardEvent} event - Clipboard event
   */
  function handlePaste(event) {
    if (!event || !event.clipboardData) return;
    
    // Prevent default paste behavior
    event.preventDefault();
    
    // Get pasted text and clean it
    const pastedText = event.clipboardData.getData('text').replace(/\D/g, '');
    
    // Fill inputs with pasted text
    for (let i = 0; i < Math.min(pastedText.length, 6); i++) {
      codeInputs[i] = pastedText[i];
    }
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = codeInputs.findIndex(val => !val);
    if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
      inputRefs[nextEmptyIndex]?.focus();
    } else {
      inputRefs[5]?.focus();
    }
  }
  
  /**
   * Clear verification code inputs
   */
  function clearVerificationCode() {
    for (let i = 0; i < 6; i++) {
      codeInputs[i] = '';
    }
    
    // Focus the first input
    inputRefs[0]?.focus();
  }
  
  /**
   * Handle resend code button click
   */
  function handleResend() {
    isResending = true;
    error = '';
    message = '';
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex-shrink-0">
          <h1 class="text-xl font-bold text-gray-900">Super Deals</h1>
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
          {#if emailAddress}
            We've sent a 6-digit verification code to<br />
            <span class="font-medium text-blue-600">{emailAddress}</span>
          {:else}
            Please enter your verification code
          {/if}
        </p>
      </div>
      
      {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{error}</span>
        </div>
      {/if}
      
      {#if message}
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{message}</span>
        </div>
      {/if}
      
      {#if showDevInfo}
        <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <p class="font-bold">Development Mode</p>
          <p>Verification code: {browser ? localStorage.getItem('devVerificationCode') : ''}</p>
        </div>
      {/if}
      
      <form 
        id="verification-form"
        method="POST" 
        class="mt-8 space-y-6"
        use:enhance={() => {
          isLoading = true;
          error = '';
          message = '';
          
          return async ({ result }) => {
            isLoading = false;
            
            if (result.type === 'redirect') {
              redirecting = true;
            }
          };
        }}
      >
        <!-- Hidden email field -->
        <input type="hidden" name="email" value={emailAddress} />
        <input type="hidden" name="userType" value={userTypeValue} />
        
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
                  bind:value={codeInputs[i]}
                  bind:this={inputRefs[i]}
                  oninput={(e) => handleInputChange(e, i)}
                  onkeydown={(e) => handleKeyDown(e, i)}
                  onpaste={i === 0 ? handlePaste : undefined}
                  class="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading || redirecting}
                />
              </div>
            {/each}
          </div>
        </fieldset>
        
        <div>
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading || redirecting || !codeInputs.every(code => code)}
          >
            {#if isLoading}
              Verifying...
            {:else if redirecting}
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
        
        {#if isResending}
          <form 
            method="POST" 
            action="?/resend"
            class="mt-2"
            use:enhance={() => {
              isLoading = true;
              error = '';
              message = '';
              
              return async ({ result }) => {
                isLoading = false;
                isResending = false;
              };
            }}
          >
            <input type="hidden" name="email" value={emailAddress} />
            <input type="hidden" name="userType" value={userTypeValue} />
            
            <button 
              type="submit" 
              class="text-blue-600 hover:text-blue-500 font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        {:else}
          <button 
            type="button" 
            class="mt-2 text-blue-600 hover:text-blue-500 font-medium"
            onclick={handleResend}
            disabled={isLoading}
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
        &copy; 2025 Super Deals. All rights reserved.
      </p>
    </div>
  </footer>
</div>
