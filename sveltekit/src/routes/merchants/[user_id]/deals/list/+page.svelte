<!-- 
  Merchant Deals List
  Displays all deals for the merchant
-->

<script>
  import { page } from '$app/stores';
  
  /**
   * @typedef {Object} Deal
   * @property {string} id - Deal ID
   * @property {string} title - Deal title
   * @property {string} description - Deal description
   * @property {string} discountType - Type of discount (percentage, fixed, bogo)
   * @property {number} discountValue - Value of the discount
   * @property {string} startDate - Start date of the deal
   * @property {string} endDate - End date of the deal
   * @property {string} status - Status of the deal (active, scheduled, expired)
   * @property {number} redemptions - Number of redemptions
   * @property {string} createdAt - Date the deal was created
   */
  
  // Reactive state using Svelte 5 runes
  const state = $state({
    merchantId: $page.params.user_id,
    /** @type {Deal[]} */
    deals: [],
    isLoading: true,
    error: '',
    searchQuery: '',
    statusFilter: 'all'
  });
  
  // Filtered deals based on search and status
  const filteredDeals = $derived(() => {
    return state.deals.filter(deal => {
      const matchesSearch = state.searchQuery === '' || 
        deal.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(state.searchQuery.toLowerCase());
      
      const matchesStatus = state.statusFilter === 'all' || deal.status === state.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  });
  
  // Load deals data
  $effect(() => {
    if (state.merchantId) {
      loadDeals();
    }
  });
  
  // Load deals for the merchant
  async function loadDeals() {
    state.isLoading = true;
    state.error = '';
    
    try {
      // TODO: Implement actual deals loading from API
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      state.deals = [
        {
          id: 'deal-1',
          title: 'Summer Special Discount',
          description: '20% off on all summer items',
          discountType: 'percentage',
          discountValue: 20,
          startDate: '2025-05-01',
          endDate: '2025-08-31',
          status: 'active',
          redemptions: 45,
          createdAt: '2025-04-15'
        },
        {
          id: 'deal-2',
          title: 'Weekend Flash Sale',
          description: '$10 off on purchases over $50',
          discountType: 'fixed',
          discountValue: 10,
          startDate: '2025-03-25',
          endDate: '2025-03-27',
          status: 'expired',
          redemptions: 120,
          createdAt: '2025-03-20'
        },
        {
          id: 'deal-3',
          title: 'Buy One Get One Free',
          description: 'Buy any item and get another one free',
          discountType: 'bogo',
          discountValue: 100,
          startDate: '2025-04-01',
          endDate: '2025-04-30',
          status: 'scheduled',
          redemptions: 0,
          createdAt: '2025-03-15'
        },
        {
          id: 'deal-4',
          title: 'Loyalty Member Discount',
          description: '15% off for loyalty members',
          discountType: 'percentage',
          discountValue: 15,
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          status: 'active',
          redemptions: 230,
          createdAt: '2025-01-01'
        }
      ];
    } catch (err) {
      state.error = 'Failed to load deals. Please try again.';
    } finally {
      state.isLoading = false;
    }
  }
  
  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Deals' },
    { value: 'active', label: 'Active' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'expired', label: 'Expired' }
  ];
  
  // Format date for display
  /**
   * @param {string} dateString - Date string to format
   * @return {string} Formatted date string
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
</script>

<div class="deals-list-page">
  <div class="page-header flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
    <div>
      <h1 class="text-2xl font-bold">Your Deals</h1>
      <p class="text-gray-600">Manage all your deals in one place</p>
    </div>
    
    <a 
      href="/merchants/{state.merchantId}/deals/create" 
      class="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
      </svg>
      Create New Deal
    </a>
  </div>
  
  {#if state.isLoading}
    <div class="loading-container flex flex-col items-center justify-center py-12">
      <div class="loading-spinner mb-4"></div>
      <p class="text-gray-600">Loading deals...</p>
    </div>
  {:else}
    <div class="filters-bar bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="search-input">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search Deals</label>
          <input
            type="text"
            id="search"
            bind:value={state.searchQuery}
            class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search by title or description"
          />
        </div>
        
        <div class="status-filter">
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select
            id="status"
            bind:value={state.statusFilter}
            class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {#each statusOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
    
    {#if state.error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
        <p>{state.error}</p>
      </div>
    {/if}
    
    {#if filteredDeals.length === 0}
      <div class="empty-state bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No deals found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {#if state.searchQuery || state.statusFilter !== 'all'}
            No deals match your current filters. Try adjusting your search criteria.
          {:else}
            Get started by creating a new deal for your customers.
          {/if}
        </p>
        <div class="mt-6">
          <a 
            href="/merchants/{state.merchantId}/deals/create" 
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Create New Deal
          </a>
        </div>
      </div>
    {:else}
      <div class="deals-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredDeals as deal}
          <div class="deal-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="deal-header p-4 border-b border-gray-100">
              <div class="flex justify-between items-start">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{deal.title}</h3>
                <span class="status-badge px-2 py-1 text-xs font-medium rounded-full {
                  deal.status === 'active' ? 'bg-green-100 text-green-800' : 
                  deal.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }">
                  {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                </span>
              </div>
              <p class="text-sm text-gray-600 line-clamp-2">{deal.description}</p>
            </div>
            
            <div class="deal-details p-4">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-500">Discount</p>
                  <p class="font-medium">
                    {#if deal.discountType === 'percentage'}
                      {deal.discountValue}% Off
                    {:else if deal.discountType === 'fixed'}
                      ${deal.discountValue} Off
                    {:else if deal.discountType === 'bogo'}
                      Buy One Get One
                    {:else}
                      {deal.discountValue}
                    {/if}
                  </p>
                </div>
                
                <div>
                  <p class="text-gray-500">Redemptions</p>
                  <p class="font-medium">{deal.redemptions}</p>
                </div>
                
                <div>
                  <p class="text-gray-500">Start Date</p>
                  <p class="font-medium">{formatDate(deal.startDate)}</p>
                </div>
                
                <div>
                  <p class="text-gray-500">End Date</p>
                  <p class="font-medium">{formatDate(deal.endDate)}</p>
                </div>
              </div>
              
              <div class="mt-4 flex justify-end">
                <a 
                  href="/merchants/{state.merchantId}/deals/{deal.id}" 
                  class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Details →
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .loading-spinner {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    border: 3px solid rgba(59, 130, 246, 0.3);
    border-radius: 50%;
    border-top-color: rgba(59, 130, 246, 1);
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 2;
  }
</style>
