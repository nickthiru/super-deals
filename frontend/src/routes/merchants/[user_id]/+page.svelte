<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  /**
   * @type {import('./$types').PageData}
   */
  export let data;

  let merchantData = null;
  let error = null;
  let isLoading = true;

  $: userId = $page.params.user_id;
  $: user = $auth.user;
  
  /**
   * Check if user is a merchant
   * @param {import('$lib/stores/auth').User | null} user - The user to check
   * @returns {boolean} True if user is a merchant
   */
  function isMerchantUser(user) {
    return user?.userType === 'merchant';
  }

  onMount(async () => {
    // Validate that the user is accessing their own dashboard
    if (!user || user.sub !== userId || !isMerchantUser(user)) {
      error = 'Unauthorized access. Please sign in as a merchant.';
      goto('/merchants/sign-in');
      return;
    }

    try {
      // Fetch merchant-specific data here
      // Example:
      // const response = await fetch(`/api/merchants/${userId}`, {
      //   headers: {
      //     'Authorization': `Bearer ${await getCurrentSession()}`
      //   }
      // });
      // merchantData = await response.json();
      isLoading = false;
    } catch (err) {
      console.error('Error fetching merchant data:', err);
      error = 'Failed to load merchant data';
      isLoading = false;
    }
  });
</script>

<div class="dashboard">
  <h1>Welcome to your Merchant Dashboard</h1>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else}
    <div class="merchant-info">
      {#if isMerchantUser(user)}
        <h2>{user.businessName}</h2>
        <p>Email: {user.email}</p>
        <!-- Add more merchant data display here -->
      {:else}
        <p class="error">Invalid user type</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .dashboard {
    padding: 1rem;
  }

  .merchant-info {
    margin-top: 2rem;
  }

  .error {
    color: tomato;
  }
</style>