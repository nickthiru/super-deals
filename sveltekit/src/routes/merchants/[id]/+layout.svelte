<!-- 
  Merchant User Layout
  Layout for authenticated merchant pages
-->

<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */
  
  /** @type {Props} */
  let { children } = $props();
  
  // Reactive state using Svelte 5 runes
  let merchantId = $state($page.params.user_id);
  let isLoading = $state(false);
  let currentPath = $state($page.url.pathname);
  
  // Update currentPath when page changes
  $effect(() => {
    currentPath = $page.url.pathname;
  });
  
  // Navigation items with derived active states
  const navItems = $derived([
    { 
      label: 'Dashboard', 
      path: `/merchants/${merchantId}`,
      active: currentPath === `/merchants/${merchantId}`
    },
    { 
      label: 'Deals', 
      path: `/merchants/${merchantId}/deals`,
      active: currentPath.includes('/deals')
    },
    { 
      label: 'Profile', 
      path: `/merchants/${merchantId}/profile`,
      active: currentPath.includes('/profile')
    }
  ]);
  
  // Handle sign out
  function handleSignOut() {
    isLoading = true;
    
    // TODO: Implement actual sign-out logic using merchant store
    setTimeout(() => {
      // Clear any auth tokens or state
      goto('/merchants/sign-in');
    }, 500);
  }
</script>

<div class="merchant-user-layout">
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <a href={`/merchants/${merchantId}`} class="text-xl font-bold text-blue-600">
            SuperDeals Merchant
          </a>
        </div>
        
        <nav class="merchant-nav">
          <ul class="flex space-x-1">
            {#each navItems as item}
              <li>
                <a 
                  href={item.path} 
                  class="px-3 py-2 rounded-md text-sm font-medium {item.active ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}"
                >
                  {item.label}
                </a>
              </li>
            {/each}
            
            <li>
              <button 
                onclick={() => handleSignOut()}
                disabled={isLoading}
                class="px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
  
  <main class="container mx-auto px-4 py-6">
    {@render children?.()}
  </main>
  
  <footer class="bg-gray-50 border-t border-gray-200 mt-auto">
    <div class="container mx-auto px-4 py-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="text-gray-500 text-sm mb-2 md:mb-0">
          {new Date().getFullYear()} SuperDeals Merchant Portal
        </div>
        
        <div class="flex space-x-4">
          <a href="/help" class="text-gray-500 hover:text-gray-700 text-sm">Help</a>
          <a href="/terms" class="text-gray-500 hover:text-gray-700 text-sm">Terms</a>
          <a href="/privacy" class="text-gray-500 hover:text-gray-700 text-sm">Privacy</a>
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  .merchant-user-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
</style>
