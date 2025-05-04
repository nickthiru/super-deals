<!-- 
  Sign-up Completed Page
  Displayed after successful email verification
-->

<script>
  import { browser } from '$app/environment';
  
  import { untrack } from 'svelte';
  
  // Using Svelte 5 runes for reactivity
  const userType = $state({ value: 'merchant' });
  
  // One-time initialization using $effect with untrack
  // This prevents infinite loops by not tracking the state changes
  $effect(() => {
    // Get user type from URL params if available
    if (browser) {
      // Using untrack to prevent this from being a dependency
      untrack(() => {
        const params = new URLSearchParams(window.location.search);
        userType.value = params.get('userType') || 'merchant';
      });
    }
  });
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div class="text-center">
        <svg 
          class="mx-auto h-12 w-12 text-green-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
        
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verified!
        </h2>
        
        <p class="mt-2 text-center text-sm text-gray-600">
          Your account has been successfully verified. You can now sign in to access your account.
        </p>
        
        {#if userType.value === 'merchant'}
          <div class="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3 flex-1 md:flex md:justify-between">
                <p class="text-sm text-blue-700 text-left">
                  We've sent you a welcome email with important next steps. Please complete the document verification process after signing in to start creating deals.
                </p>
              </div>
            </div>
          </div>
        {/if}
      </div>
      
      <div class="mt-6">
        <div class="flex justify-center">
          <a 
            href="/accounts/sign-in" 
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign In
          </a>
        </div>
        
        <div class="mt-4 text-center">
          <a 
            href="/{userType.value}s" 
            class="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Go to {userType.value === 'merchant' ? 'Merchant' : 'Customer'} Home Page
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
