<script>
  import "../app.css";
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import { page } from '$app/stores';
  import SignOutButton from '$lib/components/SignOutButton.svelte';

  // Initialize auth store on mount
  onMount(() => {
    auth.initialize();
  });

  // Subscribe to auth state
  $: user = $auth.user;
  $: isInitialized = $auth.initialized;
  $: isAuthenticated = $auth.isAuthenticated;
</script>

<div class="app">
  <header>
    <nav>
      <a href="/">Home</a>
      {#if isAuthenticated}
        {#if user?.userType === 'merchant'}
          <a href="/merchants/{user.sub}/deals">My Deals</a>
          <a href="/merchants/{user.sub}/deals/create">Create Deal</a>
        {/if}
        <div class="auth-info">
          <span>{user?.email}</span>
          <SignOutButton />
        </div>
      {:else}
        <div class="auth-links">
          <a href="/merchants/sign-in">Merchant Sign In</a>
          <a href="/merchants/sign-up">Merchant Sign Up</a>
        </div>
      {/if}
    </nav>
  </header>

  <main>
    {#if !isInitialized}
      <!-- Add a loading spinner or placeholder -->
      <div class="loading">Loading...</div>
    {:else}
      <slot />
    {/if}
  </main>

  <footer>
    <p>&copy; {new Date().getFullYear()} Super Deals. All rights reserved.</p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  header {
    background: #f8f9fa;
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
  }

  nav {
    display: flex;
    align-items: center;
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  nav a {
    color: #333;
    text-decoration: none;
    padding: 0.5rem;
    border-radius: 4px;
  }

  nav a:hover {
    background: #e9ecef;
  }

  .auth-info {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .auth-links {
    margin-left: auto;
    display: flex;
    gap: 1rem;
  }

  main {
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  footer {
    background: #f8f9fa;
    padding: 1rem;
    text-align: center;
    border-top: 1px solid #e9ecef;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: 1.25rem;
    color: #666;
  }
</style>