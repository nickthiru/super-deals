<script>
  import { signInWithRedirect } from 'aws-amplify/auth';
  import { goto } from '$app/navigation';
  
  let email = '';
  let password = '';
  let error = null;
  let isLoading = false;

  /**
   * Handle merchant sign-in using Amplify
   * @param {Event} event - Form submission event
   */
  async function handleSignIn(event) {
    event.preventDefault();
    error = null;
    isLoading = true;

    try {
      await signInWithRedirect({
        username: email,
        password,
        provider: 'Cognito'
      });
    } catch (err) {
      console.error('Sign in error:', err);
      error = err.message || 'Failed to sign in. Please try again.';
      isLoading = false;
    }
  }
</script>

<h1 id="sign-in-title">Merchant Sign-In</h1>

<form on:submit={handleSignIn} aria-labelledby="sign-in-title">
  <label>
    Email
    <input 
      bind:value={email}
      type="email" 
      required
      disabled={isLoading}
    >
  </label>

  <label>
    Password
    <input 
      bind:value={password}
      type="password" 
      required 
      minlength="8"
      disabled={isLoading}
    >
  </label>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <button type="submit" disabled={isLoading}>
    {#if isLoading}
      Signing in...
    {:else}
      Sign In
    {/if}
  </button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
    margin: 0 auto;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  .error {
    color: tomato;
    margin: 0;
  }

  button {
    padding: 0.5rem 1rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  button:hover:not(:disabled) {
    background: #45a049;
  }

  button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
</style>