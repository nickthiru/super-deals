<!-- 
  Merchant Error Page
  Handles merchant-specific errors with contextual messages and actions
-->

<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  /**
   * Map of HTTP status codes to merchant-specific error messages
   * @type {Record<number, string>}
   */
  const merchantErrorMessages = {
    401: 'You need to sign in to access the merchant portal',
    403: 'Your merchant account doesn\'t have permission to access this page',
    404: 'The requested merchant page was not found',
    500: 'Something went wrong with the merchant portal'
  };

  // Reactive state using Svelte 5 runes
  const status = $derived($page.status);
  const message = $derived(
    Object.prototype.hasOwnProperty.call(merchantErrorMessages, status) 
      ? merchantErrorMessages[status] 
      : $page.error?.message || 'An unexpected error occurred in the merchant portal'
  );

  /**
   * Go back to the previous page
   */
  function goBack() {
    window.history.back();
  }

  /**
   * Go to the merchant portal home
   */
  function goToMerchantHome() {
    goto('/merchants');
  }

  /**
   * Go to the main site home
   */
  function goToMainSite() {
    goto('/');
  }
</script>

<div class="merchant-error-container min-h-[60vh] flex items-center justify-center p-8">
  <div class="error-content text-center max-w-xl">
    <h1 class="text-6xl font-bold text-red-600 m-0">{status}</h1>
    <p class="text-xl text-gray-600 my-4">{message}</p>

    <div class="actions flex flex-wrap gap-4 justify-center">
      <button 
        onclick={() => goBack()} 
        class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
        Go Back
      </button>
      
      <button 
        onclick={() => goToMerchantHome()} 
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Merchant Home
      </button>
      
      <button 
        onclick={() => goToMainSite()} 
        class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
        Main Site
      </button>
      
      {#if status === 401}
        <a 
          href="/merchants/sign-in" 
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors inline-block"
        >
          Sign In
        </a>
      {/if}
      
      {#if status === 404 && $page.url.pathname.includes('confirm-sign-up')}
        <a 
          href="/auth/confirm-sign-up" 
          class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors inline-block"
        >
          Go to Confirm Sign-Up
        </a>
      {/if}
    </div>
  </div>
</div>
