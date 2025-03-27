<!-- 
  Development Utility: Clear Mock Data
  This page allows clearing mock data for testing purposes
-->

<script>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  
  // Props using Svelte 5 runes
  const { form } = $props();
  
  // Reactive state using Svelte 5 runes
  let email = $state('');
  let isLoading = $state(false);
  let message = $state('');
  let messageType = $state(''); // 'success' or 'error'
  
  // Handle form submission response
  $effect(() => {
    if (form) {
      if (form.success) {
        messageType = 'success';
        message = form.message;
        
        // Clear the email field on success
        if (form.merchantFound || form.verificationFound) {
          email = '';
        }
      } else {
        messageType = 'error';
        message = form.message || 'An error occurred';
      }
    }
  });
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex-shrink-0">
          <h1 class="text-xl font-bold text-gray-900">Super Deals</h1>
        </div>
        <div>
          <span class="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            Development Mode
          </span>
        </div>
      </div>
    </div>
  </header>
  
  <main class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
      <div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Clear Mock Data
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          This utility allows you to clear mock data for testing purposes.
        </p>
      </div>
      
      {#if message}
        <div class={`${messageType === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded relative border`} role="alert">
          <span class="block sm:inline">{message}</span>
        </div>
      {/if}
      
      <form 
        method="POST" 
        class="mt-8 space-y-6"
        use:enhance={() => {
          isLoading = true;
          message = '';
          
          return async ({ result }) => {
            isLoading = false;
          };
        }}
      >
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
            placeholder="Enter email to clear"
            bind:value={email}
          />
        </div>
        
        <div>
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={isLoading || !email}
          >
            {isLoading ? 'Clearing...' : 'Clear Mock Data'}
          </button>
        </div>
      </form>
      
      <div class="text-center">
        <a 
          href="/merchants/sign-up" 
          class="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Return to Sign Up
        </a>
      </div>
    </div>
  </main>
  
  <footer class="bg-white">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <p class="text-center text-sm text-gray-500">
        Development Utility - Not for production use
      </p>
    </div>
  </footer>
</div>
