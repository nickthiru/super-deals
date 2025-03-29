<!-- 
  Merchant Sign In Page
  Handles merchant authentication
-->

<script>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  
  // Props using Svelte 5 runes
  const { data, form } = $props();
  
  // Reactive state using Svelte 5 runes
  const formState = $state({
    email: '',
    password: '',
    isLoading: false,
    error: '',
    rememberMe: false,
    showSuccessMessage: false
  });
  
  // Form validation
  const isFormValid = $derived(
    formState.email.trim() !== '' && 
    formState.password.trim() !== '' &&
    formState.email.includes('@')
  );
  
  // Handle form results from server
  $effect(() => {
    if (form) {
      if (form.success === false && form.error) {
        formState.error = form.error;
        formState.isLoading = false;
      }
    }
    
    // Show success message if redirected from verification
    if (data?.verified) {
      formState.showSuccessMessage = true;
    }
  });
</script>

<div class="sign-in-page">
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-6 text-center">Merchant Sign In</h1>
    
    {#if formState.error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
        <p>{formState.error}</p>
      </div>
    {/if}
    
    {#if formState.showSuccessMessage}
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
        <p>Email verified successfully! Please sign in to continue.</p>
      </div>
    {/if}
    
    <form 
      method="POST" 
      class="space-y-4"
      use:enhance={() => {
        formState.isLoading = true;
        formState.error = '';
        
        return async ({ result, update }) => {
          await update();
          formState.isLoading = false;
        };
      }}
    >
      <div class="form-group">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          bind:value={formState.email}
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="your@email.com"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          bind:value={formState.password}
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
          required
        />
      </div>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input 
            id="rememberMe" 
            name="rememberMe"
            type="checkbox" 
            bind:checked={formState.rememberMe}
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
          />
          <label for="rememberMe" class="ml-2 block text-sm text-gray-900">Remember me</label>
        </div>
        
        <div class="text-sm">
          <a href="/merchants/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
        </div>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={!isFormValid || formState.isLoading}
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if formState.isLoading}
            <span class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          {:else}
            Sign In
          {/if}
        </button>
      </div>
    </form>
    
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Don't have an account?
        <a href="/merchants/sign-up" class="font-medium text-blue-600 hover:text-blue-500">Sign up</a>
      </p>
    </div>
  </div>
</div>
