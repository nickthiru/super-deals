<!-- 
  Merchant Deals List
  Displays all deals for the merchant
-->

<script>
  import { page } from '$app/stores';
  
  // Reactive state using Svelte 5 runes
  const merchantId = $state($page.params.user_id);
  const deals = $state([]);
  const isLoading = $state(true);
  const error = $state('');
  const searchQuery = $state('');
  const statusFilter = $state('all');
  
  // Filtered deals based on search and status
  const filteredDeals = $derived(() => {
    return deals.filter(deal => {
      const matchesSearch = searchQuery === '' || 
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || deal.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  });
  
  // Load deals data
  $effect(() => {
    if (merchantId) {
      loadDeals();
    }
  });
  
  // Load deals for the merchant
  async function loadDeals() {
    isLoading = true;
    error = '';
    
    try {
      // TODO: Implement actual deals loading from API
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      deals = [
        {
          id: 'deal-1',
          title: 'Summer Special Discount',
          description: '20% off on all summer items',
          discountType: 'percentage',
          discountValue: 20,
          startDate: '2025-06-01T00:00:00Z',
          endDate: '2025-08-31T23:59:59Z',
          status: 'active',
          redemptionCount: 45,
          viewCount: 320
        },
        {
          id: 'deal-2',
          title: 'Buy One Get One Free',
          description: 'Purchase any item and get another one free',
          discountType: 'bogo',
          discountValue: 100,
          startDate: '2025-04-15T00:00:00Z',
          endDate: '2025-05-15T23:59:59Z',
          status: 'active',
          redemptionCount: 28,
          viewCount: 210
        },
        {
          id: 'deal-3',
          title: 'Weekend Flash Sale',
          description: '$10 off on purchases over $50',
          discountType: 'fixed',
          discountValue: 10,
          startDate: '2025-03-10T00:00:00Z',
          endDate: '2025-03-12T23:59:59Z',
          status: 'expired',
          redemptionCount: 62,
          viewCount: 450
        },
        {
          id: 'deal-4',
          title: 'Holiday Special',
          description: '15% off on all holiday packages',
          discountType: 'percentage',
          discountValue: 15,
          startDate: '2025-12-01T00:00:00Z',
          endDate: '2025-12-31T23:59:59Z',
          status: 'scheduled',
          redemptionCount: 0,
          viewCount: 0
        }
      ];
      
      isLoading = false;
    } catch (err) {
      isLoading = false;
      error = 'Failed to load deals';
      console.error(err);
    }
  }
  
  // Format date for display
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
  
  // Get status badge class
  function getStatusBadgeClass(status) {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Deals' },
    { value: 'active', label: 'Active' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'expired', label: 'Expired' }
  ];
</script>

<div class="deals-list-page">
  <div class="page-header flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
    <div>
      <h1 class="text-2xl font-bold">Your Deals</h1>
      <p class="text-gray-600">Manage all your deals in one place</p>
    </div>
    
    <div class="mt-4 md:mt-0">
      <a 
        href="/merchants/{merchantId}/deals/create" 
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span class="mr-2">+</span>
        Create New Deal
      </a>
    </div>
  </div>
  
  {#if isLoading}
    <div class="loading-container flex justify-center items-center py-12">
      <div class="loading-spinner"></div>
      <span class="ml-3">Loading deals...</span>
    </div>
  {:else if error}
    <div class="error-container bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
      <p class="font-bold">Error</p>
      <p>{error}</p>
    </div>
  {:else}
    <div class="filters-bar bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="search-input">
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search Deals</label>
          <input
            type="text"
            id="search"
            bind:value={searchQuery}
            placeholder="Search by title or description"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div class="status-filter">
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select
            id="status"
            bind:value={statusFilter}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {#each statusOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
    
    {#if filteredDeals.length === 0}
      <div class="empty-state bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        {#if deals.length === 0}
          <h3 class="text-lg font-medium text-gray-900 mb-2">No deals yet</h3>
          <p class="text-gray-500 mb-4">You haven't created any deals yet. Get started by creating your first deal.</p>
          <a 
            href="/merchants/{merchantId}/deals/create" 
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Your First Deal
          </a>
        {:else}
          <h3 class="text-lg font-medium text-gray-900 mb-2">No matching deals</h3>
          <p class="text-gray-500">No deals match your current search or filter criteria. Try adjusting your filters.</p>
        {/if}
      </div>
    {:else}
      <div class="deals-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredDeals as deal}
          <div class="deal-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div class="deal-header p-4 border-b border-gray-100">
              <div class="flex justify-between items-start">
                <h3 class="text-lg font-medium text-gray-900 mb-1">{deal.title}</h3>
                <span class="status-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusBadgeClass(deal.status)}">
                  {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                </span>
              </div>
              <p class="text-sm text-gray-500 line-clamp-2">{deal.description}</p>
            </div>
            
            <div class="deal-details p-4">
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="detail-item">
                  <p class="text-xs text-gray-500">Discount</p>
                  <p class="text-sm font-medium">
                    {#if deal.discountType === 'percentage'}
                      {deal.discountValue}% Off
                    {:else if deal.discountType === 'fixed'}
                      ${deal.discountValue} Off
                    {:else if deal.discountType === 'bogo'}
                      Buy One Get One
                    {/if}
                  </p>
                </div>
                
                <div class="detail-item">
                  <p class="text-xs text-gray-500">Valid Period</p>
                  <p class="text-sm font-medium">
                    {formatDate(deal.startDate)} - {formatDate(deal.endDate)}
                  </p>
                </div>
                
                <div class="detail-item">
                  <p class="text-xs text-gray-500">Redemptions</p>
                  <p class="text-sm font-medium">{deal.redemptionCount}</p>
                </div>
                
                <div class="detail-item">
                  <p class="text-xs text-gray-500">Views</p>
                  <p class="text-sm font-medium">{deal.viewCount}</p>
                </div>
              </div>
              
              <div class="deal-actions flex space-x-2">
                <a 
                  href="/merchants/{merchantId}/deals/{deal.id}" 
                  class="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Details
                </a>
                
                <a 
                  href="/merchants/{merchantId}/deals/{deal.id}/edit" 
                  class="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit
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
    width: 1.5rem;
    height: 1.5rem;
    border: 3px solid rgba(59, 130, 246, 0.3);
    border-radius: 50%;
    border-top-color: #3b82f6;
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
  }
</style>
