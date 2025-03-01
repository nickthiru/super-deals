<script>
  import { signOut } from 'aws-amplify/auth';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth';

  let isLoading = false;

  /**
   * Handle sign out using Amplify
   */
  async function handleSignOut() {
    isLoading = true;
    try {
      await signOut();
      // Clear the auth store using the proper method
      auth.clearUser();
      goto('/public');
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      isLoading = false;
    }
  }
</script>

<button 
  on:click={handleSignOut} 
  disabled={isLoading}
  class="sign-out-btn"
>
  {#if isLoading}
    Signing out...
  {:else}
    Sign Out
  {/if}
</button>

<style>
  .sign-out-btn {
    padding: 0.5rem 1rem;
    background: #666;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .sign-out-btn:hover:not(:disabled) {
    background: #555;
  }

  .sign-out-btn:disabled {
    background: #999;
    cursor: not-allowed;
  }
</style>
