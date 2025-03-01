<script>
  import { signOut } from 'aws-amplify/auth';
  import { auth } from '$lib/stores/auth';
  
  /** @type {boolean} */
  let isLoading = false;

  /**
   * Handle sign out action
   */
  async function handleSignOut() {
    try {
      isLoading = true;
      await signOut();
      auth.clearUser();
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
    padding: var(--size-2) var(--size-4);
    background: var(--surface-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-2);
    cursor: pointer;
    font-size: var(--font-size-1);
    transition: all var(--transition-base);
  }

  .sign-out-btn:hover:not(:disabled) {
    background: var(--surface-tertiary);
  }

  .sign-out-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style>
