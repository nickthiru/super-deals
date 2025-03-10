<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  /**
   * @typedef {Object} Props
   * @property {import('./$types').PageData} data
   */

  /** @type {Props} */
  const props = $props();
  let { data } = props;

  // Reactive state using $state
  let merchantData = $state(null);
  /** @type {string|null} */
  let error = $state(null);
  let isLoading = $state(true);

  // Derived values using $derived
  let userId = $derived($page.params.user_id);
  let user = $derived($auth.user);

  // Dashboard stats data
  let activeDeals = $state(247);
  let totalSales = $state('$12,847');
  let engagementRate = $state('24.8%');
  let pendingApprovals = $state(12);

  // Stats trends
  let activeDealsChange = $state(12); 
  let totalSalesChange = $state(8); 
  let engagementRateChange = $state(-3); 

  // Table data
  let deals = $state([
    {
      id: 1,
      name: 'Summer Special Bundle',
      category: 'Fashion',
      status: 'active',
      sales: 1234
    },
    {
      id: 2,
      name: 'Electronics Mega Sale',
      category: 'Electronics',
      status: 'pending',
      sales: 897
    }
  ]);

  // Filter states
  let statusFilter = $state('All Status');
  let categoryFilter = $state('All Categories');

  // Pagination
  let currentPage = $state(1);
  let totalEntries = $state(45);
  let entriesPerPage = $state(10);

  /**
   * Check if user is a merchant
   * @param {import('$lib/stores/auth').User | null} user - The user to check
   * @returns {boolean} True if user is a merchant
   */
  function isMerchantUser(user) {
    return user?.userType === 'merchant';
  }

  /**
   * Handle status filter change
   * @param {Event} event - The change event
   */
  function handleStatusFilterChange(event) {
    /** @type {HTMLSelectElement} */
    // @ts-ignore
    const target = event.target;
    if (target && target.value) {
      statusFilter = target.value;
    }
  }

  /**
   * Handle category filter change
   * @param {Event} event - The change event
   */
  function handleCategoryFilterChange(event) {
    /** @type {HTMLSelectElement} */
    // @ts-ignore
    const target = event.target;
    if (target && target.value) {
      categoryFilter = target.value;
    }
  }

  /**
   * Navigate to a specific page
   * @param {number} page - The page number to navigate to
   */
  function goToPage(page) {
    currentPage = page;
  }

  /**
   * Add a new deal
   */
  function addNewDeal() {
    goto(`/merchants/${userId}/deals/new`);
  }

  /**
   * Edit a deal
   * @param {number} dealId - The ID of the deal to edit
   */
  function editDeal(dealId) {
    goto(`/merchants/${userId}/deals/${dealId}/edit`);
  }

  /**
   * Delete a deal
   * @param {number} dealId - The ID of the deal to delete
   */
  function deleteDeal(dealId) {
    if (confirm('Are you sure you want to delete this deal?')) {
      console.log(`Deleting deal ${dealId}`);
    }
  }

  // Initialize dashboard data with $effect
  $effect(() => {
    const initData = async () => {
      if (!user || user.sub !== userId || !isMerchantUser(user)) {
        error = 'Unauthorized access. Please sign in as a merchant.';
        goto('/merchants/sign-in');
        return;
      }

      try {
        // For now, we'll just simulate loading
        setTimeout(() => {
          isLoading = false;
        }, 1000);
      } catch (err) {
        console.error('Error fetching merchant data:', err);
        error = 'Failed to load merchant data';
        isLoading = false;
      }
    };

    initData();
  });
</script>

<div>
  {#if isLoading}
    <div class="flex justify-center items-center h-64">
      <div class="text-xl">Loading dashboard...</div>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{error}</span>
    </div>
  {:else}
    <!-- Top bar -->
    <div id="topbar" class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <div class="flex items-center space-x-4">
        <button class="relative">
          <i class="fa-regular fa-bell text-xl text-gray-600"></i>
          <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
        </button>
        <div class="relative">
          <input type="text" placeholder="Search..." class="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300">
          <i class="fa-solid fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- Stats cards -->
    <div id="stats-cards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="text-gray-500">Active Deals</div>
          <span class={`text-sm ${activeDealsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            <i class={`fa-solid ${activeDealsChange >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i> {Math.abs(activeDealsChange)}%
          </span>
        </div>
        <div class="text-3xl font-bold">{activeDeals}</div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="text-gray-500">Total Sales</div>
          <span class={`text-sm ${totalSalesChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            <i class={`fa-solid ${totalSalesChange >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i> {Math.abs(totalSalesChange)}%
          </span>
        </div>
        <div class="text-3xl font-bold">{totalSales}</div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="text-gray-500">Engagement Rate</div>
          <span class={`text-sm ${engagementRateChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            <i class={`fa-solid ${engagementRateChange >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i> {Math.abs(engagementRateChange)}%
          </span>
        </div>
        <div class="text-3xl font-bold">{engagementRate}</div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <div class="text-gray-500">Pending Approvals</div>
          <span class="text-gray-400 text-sm">Today</span>
        </div>
        <div class="text-3xl font-bold">{pendingApprovals}</div>
      </div>
    </div>

    <!-- Deals management -->
    <div id="deals-management" class="bg-white rounded-lg shadow-sm mb-8">
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">Active Deals</h2>
          <button 
            class="bg-[#3B5998] text-white px-4 py-2 rounded-lg flex items-center"
            onclick={() => addNewDeal()}
          >
            <i class="fa-solid fa-plus mr-2"></i> Add New Deal
          </button>
        </div>
      </div>
      <div class="p-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4 md:mb-0">
            <select 
              class="border rounded-lg px-4 py-2"
              value={statusFilter}
              onchange={handleStatusFilterChange}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Expired</option>
            </select>
            <select 
              class="border rounded-lg px-4 py-2"
              value={categoryFilter}
              onchange={handleCategoryFilterChange}
            >
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Food</option>
            </select>
          </div>
          <div class="flex items-center">
            <i class="fa-solid fa-filter mr-2 text-gray-500"></i>
            <span class="text-gray-500">Filters</span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-4 px-4">Deal Name</th>
                <th class="text-left py-4 px-4">Category</th>
                <th class="text-left py-4 px-4">Status</th>
                <th class="text-left py-4 px-4">Sales</th>
                <th class="text-left py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each deals as deal (deal.id)}
                <tr class="border-b">
                  <td class="py-4 px-4">{deal.name}</td>
                  <td class="py-4 px-4">{deal.category}</td>
                  <td class="py-4 px-4">
                    <span class={`px-3 py-1 rounded-full text-sm ${
                      deal.status === 'active' ? 'bg-green-100 text-green-800' : 
                      deal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                    </span>
                  </td>
                  <td class="py-4 px-4">{deal.sales.toLocaleString()}</td>
                  <td class="py-4 px-4">
                    <div class="flex space-x-2">
                      <button 
                        class="text-blue-600"
                        onclick={() => editDeal(deal.id)}
                        aria-label={`Edit ${deal.name}`}
                      >
                        <i class="fa-solid fa-pen"></i>
                      </button>
                      <button 
                        class="text-red-600"
                        onclick={() => deleteDeal(deal.id)}
                        aria-label={`Delete ${deal.name}`}
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="flex flex-col md:flex-row justify-between items-center mt-6">
          <div class="text-gray-500 mb-4 md:mb-0">
            Showing {(currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, totalEntries)} of {totalEntries} entries
          </div>
          <div class="flex space-x-2">
            <button 
              class="px-4 py-2 border rounded-lg"
              disabled={currentPage === 1}
              onclick={() => goToPage(currentPage - 1)}
            >
              Previous
            </button>
            {#each Array.from({ length: Math.min(3, Math.ceil(totalEntries / entriesPerPage)) }, (_, i) => i + 1) as pageNum}
              <button 
                class={`px-4 py-2 ${currentPage === pageNum ? 'bg-[#3B5998] text-white' : 'border'} rounded-lg`}
                onclick={() => goToPage(pageNum)}
              >
                {pageNum}
              </button>
            {/each}
            <button 
              class="px-4 py-2 border rounded-lg"
              disabled={currentPage === Math.ceil(totalEntries / entriesPerPage)}
              onclick={() => goToPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent activity -->
    <div id="recent-activity" class="bg-white rounded-lg shadow-sm">
      <div class="p-6 border-b">
        <h2 class="text-xl font-bold">Recent Activity</h2>
      </div>
      <div class="p-6">
        <div class="space-y-6">
          <div class="flex items-start">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <i class="fa-solid fa-tag text-[#3B5998]"></i>
            </div>
            <div class="ml-4">
              <div class="font-medium">New deal created</div>
              <div class="text-sm text-gray-500">Summer Special Bundle was created</div>
              <div class="text-sm text-gray-400">2 hours ago</div>
            </div>
          </div>
          <div class="flex items-start">
            <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <i class="fa-solid fa-check text-green-600"></i>
            </div>
            <div class="ml-4">
              <div class="font-medium">Deal approved</div>
              <div class="text-sm text-gray-500">Electronics Mega Sale was approved</div>
              <div class="text-sm text-gray-400">5 hours ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>