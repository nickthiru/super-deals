<!-- 
  Global Error Page
  Handles all application errors and provides user-friendly messages
-->

<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  /**
   * Map of HTTP status codes to user-friendly error messages
   * @type {Record<number, string>}
   */
  const errorMessages = {
    401: 'You need to sign in to access this page',
    403: 'You don\'t have permission to access this page',
    404: 'Page not found',
    500: 'Something went wrong on our end'
  };

  // Reactive state using Svelte 5 runes
  const status = $derived($page.status);
  const message = $derived(
    Object.prototype.hasOwnProperty.call(errorMessages, status) 
      ? errorMessages[status] 
      : $page.error?.message || 'An unexpected error occurred'
  );

  /**
   * Go back to the previous page
   */
  function goBack() {
    window.history.back();
  }

  /**
   * Go to the home page
   */
  function goHome() {
    goto('/');
  }
</script>

<div class="error-container min-h-[60vh] flex items-center justify-center p-8">
  <div class="error-content text-center max-w-xl">
    <h1 class="text-6xl font-bold text-red-600 m-0">{status}</h1>
    <p class="text-xl text-gray-600 my-4">{message}</p>

    <div class="actions flex gap-4 justify-center">
      <button 
        onclick={() => goBack()} 
        class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
        Go Back
      </button>
      
      <button 
        onclick={() => goHome()} 
        class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
      >
        Go Home
      </button>
      
      {#if status === 401}
        <a 
          href="/merchants/sign-in" 
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors inline-block"
        >
          Sign In
        </a>
      {/if}
    </div>
  </div>
</div>
