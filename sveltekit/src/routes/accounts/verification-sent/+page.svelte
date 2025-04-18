<!-- 
  Verification Sent Page
  Displayed after user signs up and needs to verify their email
-->

<!-- Using Svelte 5 runes for reactivity -->
<script>
  import { goto } from '$app/navigation';
  
  // Props using Svelte 5 runes
  const { data } = $props();
  
  // State using Svelte 5 runes
  let email = $state('');
  let userType = $state('');
  
  // Effects using Svelte 5 runes
  $effect(() => {
    if (data && data.email) {
      email = data.email;
    }
    
    if (data && data.userType) {
      userType = data.userType;
    }
  });
  
  // Computed values using Svelte 5 runes
  let userTypeLabel = $derived(userType === 'merchant' ? 'Merchant' : 'Customer');
  
  // Methods
  function goToSignIn() {
    const route = userType === 'merchant' ? '/accounts/sign-in' : '/accounts/sign-in';
    goto(route);
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <img class="mx-auto h-12 w-auto" src="/images/logo.svg" alt="Super Deals" />
    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
      Verification Email Sent
    </h2>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div class="text-center">
        <div class="rounded-full bg-green-100 p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {userTypeLabel} Account Created
        </h3>
        
        <p class="text-gray-600 mb-6">
          We've sent a verification code to <strong>{email}</strong>. Please check your email to visit the verification page and enter the code to verify your account.
        </p>
        
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-blue-700">
                The verification code will expire in <strong>24 hours</strong>
              </p>
            </div>
          </div>
        </div>
        
        <div class="flex flex-col space-y-4">
          <button
            type="button"
            onclick={() => goto('/accounts/confirm-sign-up')}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Enter Verification Code
          </button>
          
          <button
            type="button"
            onclick={goToSignIn}
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Any component-specific styles can go here */
</style>
