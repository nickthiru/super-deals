<script>
  import { page } from '$app/stores';
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  // Get the reason from the URL query parameter
  let reason = $derived($page.url.searchParams.get('reason') || 'default');
  let user = $derived($auth.user);

  // Map reasons to user-friendly messages
  const messages = {
    'not_signed_in': 'You need to sign in to access this page',
    'wrong_user_type': 'This page is only accessible to merchants',
    'wrong_user': 'You can only access your own account',
    'default': 'You don\'t have permission to access this page'
  };

  let message = $derived(messages[reason] || messages.default);

  function goBack() {
    window.history.back();
  }

  function goHome() {
    goto('/');
  }

  function handleSignIn() {
    goto('/merchants/sign-in');
  }

  function handleSignUp() {
    goto('/merchants/sign-up');
  }
</script>

<div class="unauthorized-container">
  <div class="unauthorized-content">
    <h1>Access Denied</h1>
    <p class="message">{message}</p>

    <div class="actions">
      {#if !user}
        <button onclick={handleSignIn}>Sign In</button>
        <button onclick={handleSignUp} class="secondary">Sign Up</button>
      {/if}
      <button onclick={goBack} class="secondary">Go Back</button>
      <button onclick={goHome} class="secondary">Go Home</button>
    </div>
  </div>
</div>

<style>
  .unauthorized-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 2rem;
  }

  .unauthorized-content {
    text-align: center;
    max-width: 600px;
  }

  h1 {
    font-size: 2.5rem;
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
    flex-wrap: wrap;
  }

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    background: #4CAF50;
    color: white;
    transition: background-color 0.2s;
  }

  button:hover {
    opacity: 0.9;
  }

  button.secondary {
    background: #666;
  }

  button.secondary:hover {
    background: #555;
  }

  @media (max-width: 480px) {
    .actions {
      flex-direction: column;
    }

    button {
      width: 100%;
    }
  }
</style>