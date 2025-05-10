<script>
  // Import the merchant sign-up page component
  import MerchantSignUpPage from '$lib/components/pages/accounts/sign-up/merchants/Page.svelte';
  
  /**
   * @typedef {Object} Props
   * @property {Object} data - Data from the load function
   * @property {string} data.userType - Type of user signing up
   * @property {Object} form - Form data from the action
   */
  
  /** @type {Props} */
  const { data, form } = $props();
</script>

{#if data.userType === 'merchants'}
  <MerchantSignUpPage form={form} />
{:else if data.userType === 'customers'}
  <!-- Customer sign-up page would go here -->
  <div class="p-8 text-center">
    <h1 class="text-2xl font-bold mb-4">Customer Sign-Up</h1>
    <p>Customer sign-up page is not implemented yet.</p>
  </div>
{:else}
  <!-- Fallback for unknown user types -->
  <div class="p-8 text-center">
    <h1 class="text-2xl font-bold mb-4">Unknown User Type</h1>
    <p>The user type "{data.userType}" is not recognized.</p>
  </div>
{/if}
