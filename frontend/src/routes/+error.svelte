<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  /** @type {Object.<number, string>} */
  const errorMessages = {
    401: 'You need to sign in to access this page',
    403: 'You don\'t have permission to access this page',
    404: 'Page not found',
    500: 'Something went wrong on our end'
  };

  $: status = $page.status;
  $: message = Object.prototype.hasOwnProperty.call(errorMessages, status) 
    ? errorMessages[status] 
    : $page.error?.message || 'An unexpected error occurred';

  /**
   * Go back to the previous page.
   */
  function goBack() {
    window.history.back();
  }

  /**
   * Go to the home page.
   */
  function goHome() {
    goto('/');
  }
</script>

<div class="error-container">
  <div class="error-content">
    <h1>{status}</h1>
    <p class="message">{message}</p>

    <div class="actions">
      <button on:click={goBack}>Go Back</button>
      <button on:click={goHome}>Go Home</button>
      {#if status === 401}
        <a href="/merchants/sign-in" class="sign-in-link">Sign In</a>
      {/if}
    </div>
  </div>
</div>

<style>
  .error-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 2rem;
  }

  .error-content {
    text-align: center;
    max-width: 600px;
  }

  h1 {
    font-size: 4rem;
    margin: 0;
    color: #e74c3c;
  }

  .message {
    font-size: 1.25rem;
    color: #666;
    margin: 1rem 0 2rem;
  }

  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  button, .sign-in-link {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    text-decoration: none;
    transition: background-color 0.2s;
  }

  button {
    background: #666;
    color: white;
  }

  button:hover {
    background: #555;
  }

  .sign-in-link {
    background: #4CAF50;
    color: white;
  }

  .sign-in-link:hover {
    background: #45a049;
  }
</style>