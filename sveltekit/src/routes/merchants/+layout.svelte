<!-- 
  Main Merchants Layout
  This layout wraps all merchant-related pages
-->

<script>
  import { page } from '$app/stores';
  
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */
  
  /** @type {Props} */
  let { children } = $props();
  
  // Reactive state using Svelte 5 runes
  let isAuthenticated = $state(false);
  const currentPath = $derived($page.url.pathname);
  
  // Check if the current path is a public route (sign-in or sign-up)
  const isPublicRoute = $derived(
    currentPath.includes('/merchants/sign-in') || 
    currentPath.includes('/merchants/sign-up')
  );
</script>

<div class="merchant-layout">
  <header class="merchant-header">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="logo">
        <a href="/" class="text-xl font-bold">SuperDeals Merchant</a>
      </div>
      
      {#if isAuthenticated}
        <nav class="merchant-nav">
          <ul class="flex space-x-4">
            <li><a href="/merchants/{$page.params.user_id}/deals" class:active={currentPath.includes('/deals')}>Deals</a></li>
            <li><a href="/merchants/{$page.params.user_id}/profile" class:active={currentPath.includes('/profile')}>Profile</a></li>
            <li><button class="sign-out-btn">Sign Out</button></li>
          </ul>
        </nav>
      {/if}
    </div>
  </header>
  
  <main class="container mx-auto px-4 py-6">
    {@render children?.()}
  </main>
  
  <footer class="merchant-footer bg-gray-100">
    <div class="container mx-auto px-4 py-3 text-center text-gray-600">
      <p> {new Date().getFullYear()} SuperDeals Merchant Portal</p>
    </div>
  </footer>
</div>

<style>
  .merchant-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .merchant-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }
  
  main {
    flex: 1;
  }
  
  .merchant-nav a {
    padding: 0.5rem;
    border-radius: 0.25rem;
    text-decoration: none;
    color: #333;
  }
  
  .merchant-nav a.active {
    background-color: #e9ecef;
    font-weight: bold;
  }
  
  .sign-out-btn {
    background-color: transparent;
    border: 1px solid #dc3545;
    color: #dc3545;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
  }
  
  .sign-out-btn:hover {
    background-color: #dc3545;
    color: white;
  }
</style>
