<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();

	// User profile data
	let userName = $state("John Smith");
	let userRole = $state("Store Admin");
	let userAvatar = $state("https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg");
	let notificationCount = $state(3);

	// Navigation state
	let activeNavItem = $state("deals");

	/**
	 * Set the active navigation item
	 * @param {string} item - The navigation item to set as active
	 */
	function setActiveNavItem(item) {
	  activeNavItem = item;
	}
</script>

<div id="merchant-dashboard" class="min-h-full bg-gray-50">
  <div id="dashboard-layout" class="flex">
    <!-- Sidebar Navigation -->
    <div id="sidebar" class="w-64 bg-white h-[calc(100vh-0px)] shadow-sm fixed">
      <div class="p-6">
        <div class="text-[#3B5998] text-2xl font-bold mb-8">Super Deals</div>
        <nav class="space-y-2">
          <button 
            class={`flex w-full items-center px-4 py-3 rounded-lg ${activeNavItem === 'deals' ? 'text-[#3B5998] bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
            onclick={() => setActiveNavItem('deals')}
          >
            <i class="fa-solid fa-tags w-5"></i>
            <span class="ml-3">Deals Management</span>
          </button>
          <button 
            class={`flex w-full items-center px-4 py-3 rounded-lg ${activeNavItem === 'analytics' ? 'text-[#3B5998] bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
            onclick={() => setActiveNavItem('analytics')}
          >
            <i class="fa-solid fa-chart-line w-5"></i>
            <span class="ml-3">Analytics</span>
          </button>
          <button 
            class={`flex w-full items-center px-4 py-3 rounded-lg ${activeNavItem === 'settings' ? 'text-[#3B5998] bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
            onclick={() => setActiveNavItem('settings')}
          >
            <i class="fa-solid fa-gear w-5"></i>
            <span class="ml-3">Settings</span>
          </button>
        </nav>
      </div>
      <div class="absolute bottom-0 w-full p-4 border-t">
        <div class="flex items-center">
          <img src={userAvatar} alt="User avatar" class="w-10 h-10 rounded-full">
          <div class="ml-3">
            <div class="font-medium">{userName}</div>
            <div class="text-sm text-gray-500">{userRole}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content Area -->
    <div id="main-content" class="flex-1 ml-64 p-8">
      <!-- Render the page content (children) -->
      {@render children?.()}
    </div>
  </div>
</div>