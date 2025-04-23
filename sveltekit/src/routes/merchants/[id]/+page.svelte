<!-- 
  Merchant Dashboard
  Main dashboard for authenticated merchants
-->

<script>
  import { page } from '$app/stores';
  
  /**
   * @typedef {Object} MerchantData
   * @property {string} id
   * @property {string} businessName
   * @property {string} email
   * @property {string} status
   * @property {string} createdAt
   */
  
  /**
   * @typedef {Object} StatsData
   * @property {number} activeDeals
   * @property {number} totalRedemptions
   * @property {number} viewCount
   * @property {number} conversionRate
   */
  
  // Reactive state using Svelte 5 runes
  let merchantId = $state($page.params.user_id);
  /** @type {MerchantData|null} */
  let merchantData = $state(null);
  let isLoading = $state(true);
  let error = $state('');
  /** @type {StatsData} */
  let stats = $state({
    activeDeals: 0,
    totalRedemptions: 0,
    viewCount: 0,
    conversionRate: 0
  });
  
  // Load merchant data
  $effect(() => {
    if (merchantId) {
      loadMerchantData(merchantId);
    }
  });
  
  /**
   * Load merchant dashboard data
   * @param {string} id - The merchant ID
   * @returns {Promise<void>}
   */
  async function loadMerchantData(id) {
    isLoading = true;
    error = '';
    
    try {
      // TODO: Implement actual data loading from merchant store
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      merchantData = {
        id: merchantId,
        businessName: 'Sample Business',
        email: 'business@example.com',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
      
      // Mock statistics
      stats = {
        activeDeals: 5,
        totalRedemptions: 128,
        viewCount: 1240,
        conversionRate: 10.3
      };
    } catch (err) {
      // Type-safe error handling
      const errorMessage = err instanceof Error ? err.message : 'Failed to load merchant data';
      error = errorMessage;
    } finally {
      isLoading = false;
    }
  }
  
  /**
   * Format date for display
   * @param {string} dateString - The date string to format
   * @returns {string} The formatted date
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

<div class="merchant-dashboard">
  {#if isLoading}
    <div class="loading-container flex justify-center items-center py-12">
      <div class="loading-spinner"></div>
      <span class="ml-3">Loading dashboard...</span>
    </div>
  {:else if error}
    <div class="error-container bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
      <p>{error}</p>
      <button onclick={() => loadMerchantData(merchantId)} class="mt-2 text-sm text-red-700 underline">Try Again</button>
    </div>
  {:else if merchantData}
    <div class="dashboard-header mb-6">
      <h1 class="text-2xl font-bold">Welcome, {merchantData.businessName}</h1>
      <p class="text-gray-600">Merchant Dashboard</p>
    </div>
    
    <div class="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="stat-card bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        <div class="stat-title text-gray-500 text-sm">Active Deals</div>
        <div class="stat-value text-3xl font-bold">{stats.activeDeals}</div>
        <div class="stat-desc text-sm mt-2">
          <a href="/merchants/{merchantId}/deals" class="text-blue-600 hover:underline">View all deals</a>
        </div>
      </div>
      
      <div class="stat-card bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        <div class="stat-title text-gray-500 text-sm">Total Redemptions</div>
        <div class="stat-value text-3xl font-bold">{stats.totalRedemptions}</div>
        <div class="stat-desc text-sm mt-2 text-green-600">+12% from last month</div>
      </div>
      
      <div class="stat-card bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        <div class="stat-title text-gray-500 text-sm">Deal Views</div>
        <div class="stat-value text-3xl font-bold">{stats.viewCount}</div>
        <div class="stat-desc text-sm mt-2 text-green-600">+5% from last month</div>
      </div>
      
      <div class="stat-card bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        <div class="stat-title text-gray-500 text-sm">Conversion Rate</div>
        <div class="stat-value text-3xl font-bold">{stats.conversionRate}%</div>
        <div class="stat-desc text-sm mt-2 text-yellow-600">-2% from last month</div>
      </div>
    </div>
    
    <div class="dashboard-content grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="quick-actions lg:col-span-1">
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
          
          <div class="action-buttons space-y-3">
            <a 
              href="/merchants/{merchantId}/deals/create" 
              class="action-btn flex items-center justify-center w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <span>Create New Deal</span>
            </a>
            
            <a 
              href="/merchants/{merchantId}/profile" 
              class="action-btn flex items-center justify-center w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
            >
              <span>Update Profile</span>
            </a>
            
            <a 
              href="/merchants/{merchantId}/deals" 
              class="action-btn flex items-center justify-center w-full py-2 px-4 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
            >
              <span>Manage Deals</span>
            </a>
          </div>
        </div>
      </div>
      
      <div class="recent-activity lg:col-span-2">
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <h2 class="text-lg font-semibold mb-4">Recent Activity</h2>
          
          <div class="activity-list space-y-4">
            <div class="activity-item border-l-4 border-green-500 pl-3 py-1">
              <div class="activity-title font-medium">New deal created</div>
              <div class="activity-desc text-sm text-gray-600">Summer Sale - 20% off</div>
              <div class="activity-time text-xs text-gray-500">Today, 10:23 AM</div>
            </div>
            
            <div class="activity-item border-l-4 border-blue-500 pl-3 py-1">
              <div class="activity-title font-medium">Deal redemption</div>
              <div class="activity-desc text-sm text-gray-600">Spring Collection - 15% off</div>
              <div class="activity-time text-xs text-gray-500">Yesterday, 3:45 PM</div>
            </div>
            
            <div class="activity-item border-l-4 border-yellow-500 pl-3 py-1">
              <div class="activity-title font-medium">Profile updated</div>
              <div class="activity-desc text-sm text-gray-600">Updated business hours</div>
              <div class="activity-time text-xs text-gray-500">Mar 25, 2025, 11:30 AM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .loading-spinner {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #3b82f6;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
