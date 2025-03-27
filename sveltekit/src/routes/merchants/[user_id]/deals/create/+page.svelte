<!-- 
  Create Deal Page
  Allows merchants to create new deals
-->

<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  // Reactive state using Svelte 5 runes
  const merchantId = $state($page.params.user_id);
  const title = $state('');
  const description = $state('');
  const discountType = $state('percentage');
  const discountValue = $state('');
  const minPurchase = $state('');
  const startDate = $state('');
  const endDate = $state('');
  const termsAndConditions = $state('');
  const isLimitedQuantity = $state(false);
  const maxRedemptions = $state('');
  const isLoading = $state(false);
  const error = $state('');
  const currentStep = $state(1);
  
  // Form validation
  const isStep1Valid = $derived(
    title.trim() !== '' && 
    description.trim() !== '' && 
    discountType !== '' &&
    discountValue.trim() !== '' && 
    !isNaN(Number(discountValue)) &&
    (minPurchase.trim() === '' || !isNaN(Number(minPurchase)))
  );
  
  const isStep2Valid = $derived(
    startDate !== '' && 
    endDate !== '' && 
    new Date(startDate) <= new Date(endDate) &&
    (!isLimitedQuantity || (maxRedemptions.trim() !== '' && !isNaN(Number(maxRedemptions))))
  );
  
  // Discount type options
  const discountTypes = [
    { value: 'percentage', label: 'Percentage Discount' },
    { value: 'fixed', label: 'Fixed Amount Discount' },
    { value: 'bogo', label: 'Buy One Get One Free' },
    { value: 'free', label: 'Free Item or Service' }
  ];
  
  // Handle form navigation
  function nextStep() {
    if (currentStep === 1 && isStep1Valid) {
      currentStep = 2;
    }
  }
  
  function prevStep() {
    if (currentStep === 2) {
      currentStep = 1;
    }
  }
  
  // Format dates for input fields
  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  
  function getNextMonthDate() {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split('T')[0];
  }
  
  // Initialize dates if empty
  $effect(() => {
    if (!startDate) {
      startDate = getTodayDate();
    }
    
    if (!endDate) {
      endDate = getNextMonthDate();
    }
  });
  
  // Handle deal creation
  async function handleCreateDeal() {
    if (!isStep1Valid || !isStep2Valid) return;
    
    isLoading = true;
    error = '';
    
    try {
      // Prepare deal data
      const dealData = {
        merchantId,
        title,
        description,
        discountType,
        discountValue: Number(discountValue),
        minPurchase: minPurchase ? Number(minPurchase) : null,
        startDate,
        endDate,
        termsAndConditions,
        isLimitedQuantity,
        maxRedemptions: isLimitedQuantity ? Number(maxRedemptions) : null
      };
      
      // TODO: Implement actual deal creation using API
      // For now, we'll simulate a successful creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to deals list
      goto(`/merchants/${merchantId}/deals/list`);
    } catch (err) {
      error = err.message || 'Failed to create deal. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="create-deal-page">
  <div class="page-header mb-6">
    <h1 class="text-2xl font-bold">Create New Deal</h1>
    <p class="text-gray-600">Create a new deal to attract customers</p>
  </div>
  
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
      <span class="block sm:inline">{error}</span>
    </div>
  {/if}
  
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="steps-header flex border-b border-gray-200">
      <button 
        class="flex-1 py-4 px-6 text-center font-medium {currentStep === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}"
        on:click={() => currentStep = 1}
        disabled={currentStep === 1}
      >
        1. Deal Details
      </button>
      
      <button 
        class="flex-1 py-4 px-6 text-center font-medium {currentStep === 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}"
        on:click={() => isStep1Valid && (currentStep = 2)}
        disabled={!isStep1Valid || currentStep === 2}
      >
        2. Schedule & Terms
      </button>
    </div>
    
    <div class="p-6">
      <form on:submit|preventDefault={currentStep === 1 ? nextStep : handleCreateDeal} class="space-y-6">
        {#if currentStep === 1}
          <!-- Step 1: Deal Details -->
          <div class="form-group">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Deal Title *</label>
            <input
              type="text"
              id="title"
              bind:value={title}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Summer Special Discount"
              required
            />
            <p class="text-xs text-gray-500 mt-1">A catchy, descriptive title for your deal</p>
          </div>
          
          <div class="form-group">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              id="description"
              bind:value={description}
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your deal and what customers will get"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="discountType" class="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
            <select
              id="discountType"
              bind:value={discountType}
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {#each discountTypes as type}
                <option value={type.value}>{type.label}</option>
              {/each}
            </select>
          </div>
          
          <div class="form-group">
            <label for="discountValue" class="block text-sm font-medium text-gray-700 mb-1">
              {#if discountType === 'percentage'}
                Discount Percentage *
              {:else if discountType === 'fixed'}
                Discount Amount *
              {:else if discountType === 'bogo'}
                Discount Percentage for Second Item *
              {:else if discountType === 'free'}
                Value of Free Item/Service *
              {/if}
            </label>
            
            <div class="mt-1 relative rounded-md shadow-sm">
              {#if discountType === 'fixed' || discountType === 'free'}
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="discountValue"
                  bind:value={discountValue}
                  min="0"
                  step="0.01"
                  class="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                />
              {:else if discountType === 'percentage' || discountType === 'bogo'}
                <input
                  type="number"
                  id="discountValue"
                  bind:value={discountValue}
                  min="0"
                  max="100"
                  class="w-full pr-12 pl-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  required
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm">%</span>
                </div>
              {/if}
            </div>
          </div>
          
          <div class="form-group">
            <label for="minPurchase" class="block text-sm font-medium text-gray-700 mb-1">Minimum Purchase Amount (Optional)</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="minPurchase"
                bind:value={minPurchase}
                min="0"
                step="0.01"
                class="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
            <p class="text-xs text-gray-500 mt-1">Leave empty if there's no minimum purchase requirement</p>
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
                bind:value={startDate}
                min={getTodayDate()}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input
                type="date"
                id="endDate"
                bind:value={endDate}
                min={startDate || getTodayDate()}
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          {#if startDate && endDate && new Date(startDate) > new Date(endDate)}
            <div class="text-sm text-red-600">End date must be after start date</div>
          {/if}
          
          <div class="form-group">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="isLimitedQuantity"
                  type="checkbox"
                  bind:checked={isLimitedQuantity}
                  class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="isLimitedQuantity" class="font-medium text-gray-700">
                  Limit number of redemptions
                </label>
                <p class="text-gray-500">Set a maximum number of times this deal can be redeemed</p>
              </div>
            </div>
          </div>
          
          {#if isLimitedQuantity}
            <div class="form-group">
              <label for="maxRedemptions" class="block text-sm font-medium text-gray-700 mb-1">Maximum Redemptions *</label>
              <input
                type="number"
                id="maxRedemptions"
                bind:value={maxRedemptions}
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 100"
                required={isLimitedQuantity}
              />
            </div>
          {/if}
          
          <div class="form-group">
            <label for="termsAndConditions" class="block text-sm font-medium text-gray-700 mb-1">Terms and Conditions (Optional)</label>
            <textarea
              id="termsAndConditions"
              bind:value={termsAndConditions}
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional terms, conditions, or restrictions for this deal"
            ></textarea>
          </div>
          
          <div class="form-actions flex space-x-4">
            <button
              type="button"
              on:click={prevStep}
              class="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={!isStep2Valid || isLoading}
              class="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if isLoading}
                <span class="loading-spinner mr-2"></span>
                Creating...
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
