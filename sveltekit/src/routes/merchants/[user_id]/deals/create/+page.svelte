<!-- 
  Create Deal Page
  Allows merchants to create new deals
-->

<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  // Reactive state using Svelte 5 runes
  const formState = $state({
    merchantId: $page.params.user_id,
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    startDate: '',
    endDate: '',
    termsAndConditions: '',
    isLimitedQuantity: false,
    maxRedemptions: '',
    currentStep: 1,
    isSubmitting: false,
    error: null
  });
  
  // Derived values
  const isStep1Valid = $derived(
    formState.title.trim() !== '' && 
    formState.description.trim() !== '' && 
    formState.discountValue.trim() !== ''
  );
  
  const isStep2Valid = $derived(
    formState.startDate !== '' && 
    formState.endDate !== '' && 
    formState.termsAndConditions.trim() !== ''
  );
  
  // Handle form navigation
  function nextStep() {
    if (formState.currentStep === 1 && isStep1Valid) {
      formState.currentStep = 2;
    }
  }
  
  function prevStep() {
    if (formState.currentStep === 2) {
      formState.currentStep = 1;
    }
  }
  
  // Form submission
  /**
   * @param {Event} event - Form submission event
   */
  async function handleCreateDeal(event) {
    if (!isStep2Valid) return;
    
    formState.isSubmitting = true;
    formState.error = null;
    
    try {
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to deals list
      goto(`/merchants/${formState.merchantId}/deals`);
    } catch (err) {
      formState.error = /** @type {Error} */ (err).message || 'An error occurred while creating the deal';
    } finally {
      formState.isSubmitting = false;
    }
  }
  
  // Format currency input
  /**
   * @param {string} value - Input value to format
   * @return {string} Formatted value
   */
  function formatCurrency(value) {
    if (!value) return '';
    return value.replace(/[^\d.]/g, '')
      .replace(/^(\d*\.?)(\d*)$/, (_, p1, p2) => p1 + p2.slice(0, 2));
  }
</script>

<div class="create-deal-page">
  <div class="page-header mb-6">
    <h1 class="text-2xl font-bold">Create New Deal</h1>
    <p class="text-gray-600">Create a new deal to attract customers</p>
  </div>
  
  <!-- Form Steps -->
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="steps-header flex border-b border-gray-200">
      <button 
        class="flex-1 py-4 px-6 text-center font-medium {formState.currentStep === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}"
        onclick={() => formState.currentStep = 1}
        type="button"
      >
        1. Deal Details
      </button>
      <button 
        class="flex-1 py-4 px-6 text-center font-medium {formState.currentStep === 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}"
        onclick={() => isStep1Valid && (formState.currentStep = 2)}
        disabled={!isStep1Valid}
        type="button"
      >
        2. Schedule & Terms
      </button>
    </div>
    
    <div class="p-6">
      <form 
        onsubmit={(e) => {
          e.preventDefault();
          if (formState.currentStep === 1) {
            nextStep();
          } else {
            handleCreateDeal(e);
          }
        }}
        class="space-y-6"
      >
        {#if formState.currentStep === 1}
          <!-- Step 1: Deal Details -->
          <div class="form-group">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Deal Title *</label>
            <input
              type="text"
              id="title"
              bind:value={formState.title}
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g. 20% Off All Electronics"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              id="description"
              bind:value={formState.description}
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Describe your deal"
              required
            ></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-group">
              <label for="discountType" class="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
              <select
                id="discountType"
                bind:value={formState.discountType}
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
                <option value="buyOneGetOne">Buy One Get One</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="discountValue" class="block text-sm font-medium text-gray-700 mb-1">
                {formState.discountType === 'percentage' ? 'Discount Percentage *' : 
                 formState.discountType === 'fixed' ? 'Discount Amount *' : 
                 'Number of Free Items *'}
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                {#if formState.discountType === 'fixed'}
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                {/if}
                <input
                  type="text"
                  id="discountValue"
                  bind:value={formState.discountValue}
                  class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 {formState.discountType === 'fixed' ? 'pl-7' : ''} {formState.discountType === 'percentage' ? 'pr-7' : ''} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={formState.discountType === 'percentage' ? '20' : 
                              formState.discountType === 'fixed' ? '10.00' : '1'}
                  required
                />
                {#if formState.discountType === 'percentage'}
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">%</span>
                  </div>
                {/if}
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="minPurchase" class="block text-sm font-medium text-gray-700 mb-1">Minimum Purchase (Optional)</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                id="minPurchase"
                bind:value={formState.minPurchase}
                class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pl-7 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">Leave empty if there's no minimum purchase required</p>
          </div>
          
          <div class="form-actions">
            <button
              type="submit"
              disabled={!isStep1Valid}
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Schedule & Terms
            </button>
          </div>
        {:else}
          <!-- Step 2: Schedule & Terms -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-group">
              <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input
                type="date"
                id="startDate"
                bind:value={formState.startDate}
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input
                type="date"
                id="endDate"
                bind:value={formState.endDate}
                min={formState.startDate}
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>
          
          <div class="form-group">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="isLimitedQuantity"
                  type="checkbox"
                  bind:checked={formState.isLimitedQuantity}
                  class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="isLimitedQuantity" class="font-medium text-gray-700">Limit number of redemptions</label>
                <p class="text-gray-500">Set a maximum number of times this deal can be redeemed</p>
              </div>
            </div>
          </div>
          
          {#if formState.isLimitedQuantity}
            <div class="form-group">
              <label for="maxRedemptions" class="block text-sm font-medium text-gray-700 mb-1">Maximum Redemptions *</label>
              <input
                type="number"
                id="maxRedemptions"
                bind:value={formState.maxRedemptions}
                min="1"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required={formState.isLimitedQuantity}
              />
            </div>
          {/if}
          
          <div class="form-group">
            <label for="termsAndConditions" class="block text-sm font-medium text-gray-700 mb-1">Terms and Conditions *</label>
            <textarea
              id="termsAndConditions"
              bind:value={formState.termsAndConditions}
              rows="4"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter terms and conditions for this deal"
              required
            ></textarea>
          </div>
          
          {#if formState.error}
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span class="block sm:inline">{formState.error}</span>
            </div>
          {/if}
          
          <div class="flex justify-between">
            <button
              type="button"
              onclick={prevStep}
              class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Deal Details
            </button>
            
            <button
              type="submit"
              disabled={!isStep2Valid || formState.isSubmitting}
              class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if formState.isSubmitting}
                <span class="flex items-center">
                  <span class="loading-spinner mr-2"></span>
                  Creating...
                </span>
              {:else}
                Create Deal
              {/if}
            </button>
          </div>
        {/if}
      </form>
    </div>
  </div>
</div>

<style>
  .loading-spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
