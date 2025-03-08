<script>
  import { createEventDispatcher } from 'svelte';
  
  export let businessName = '';
  export let email = '';
  export let password = '';
  export let confirmPassword = '';
  /** @type {string|null} */
  export let error = null;
  export let isLoading = false;
  
  const dispatch = createEventDispatcher();
  
  /**
   * Handle form submission
   * @param {SubmitEvent} event - Form submission event
   */
  function handleSubmit(event) {
    event.preventDefault();
    dispatch('submit');
  }
</script>

<section id="merchant-signup" class="container mx-auto px-6 py-12">
  <div class="max-w-md mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Become a Merchant</h1>
      <p class="text-gray-600">Start selling your products on Super Deals</p>
    </div>
    <div id="signup-form" class="bg-white rounded-lg shadow-lg p-8">
      <form on:submit={handleSubmit} aria-labelledby="sign-up-title" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" for="businessName">Business Name</label>
          <input 
            id="businessName"
            bind:value={businessName}
            type="text" 
            required 
            maxlength="255"
            disabled={isLoading}
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-facebook focus:border-transparent"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" for="email">Email Address</label>
          <input 
            id="email"
            bind:value={email}
            type="email" 
            required
            disabled={isLoading}
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-facebook focus:border-transparent"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" for="password">Password</label>
          <input 
            id="password"
            bind:value={password}
            type="password" 
            required 
            minlength="8"
            disabled={isLoading}
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-facebook focus:border-transparent"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" for="confirmPassword">Confirm Password</label>
          <input 
            id="confirmPassword"
            bind:value={confirmPassword}
            type="password" 
            required 
            minlength="8"
            disabled={isLoading}
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-facebook focus:border-transparent"
          >
        </div>
        
        {#if error}
          <p class="text-error-500 text-sm">{error}</p>
        {/if}
        
        <button 
          type="submit" 
          disabled={isLoading}
          class="w-full bg-facebook text-white py-3 rounded-lg hover:bg-facebook-dark transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {#if isLoading}
            Signing up...
          {:else}
            Create Account
          {/if}
        </button>
      </form>
    </div>
    <p class="text-center mt-6 text-gray-600">
      Already have an account? 
      <a href="/merchants/sign-in" class="text-facebook font-medium hover:underline cursor-pointer">Sign in</a>
    </p>
  </div>
</section>
