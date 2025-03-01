<script>
  import { auth } from '$lib/stores/auth';
  import { signOut } from 'aws-amplify/auth';

  /** @type {any} */
  let user = null;
  
  auth.subscribe(state => {
    user = state.user;
  });

  async function handleSignOut() {
    try {
      await signOut();
      auth.clearUser();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
</script>

<header class="bg-white shadow-sm fixed w-full z-50">
  <div class="container mx-auto px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <a href="/" class="text-primary text-2xl font-bold">Super Deals</a>
        <nav class="hidden md:flex ml-8 space-x-6">
          <a href="/" class="text-gray-600 hover:text-primary">Front Page</a>
          <a href="/brands" class="text-gray-600 hover:text-primary">Brands</a>
          <a href="/editors-choice" class="text-gray-600 hover:text-primary">Editor's Choice</a>
          <a href="/settings" class="text-gray-600 hover:text-primary">Settings</a>
        </nav>
      </div>
      <div class="flex items-center space-x-6">
        <div class="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <i class="fa-solid fa-search text-gray-400"></i>
          <input type="text" placeholder="Search deals..." class="bg-transparent border-none focus:outline-none ml-2">
        </div>
        {#if user}
          {#if user?.userType === 'merchant'}
            <a href="/merchants/{user.sub}/deals" class="text-gray-600 hover:text-primary">My Deals</a>
            <a href="/merchants/{user.sub}/deals/create" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition">Create Deal</a>
          {/if}
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">{user?.email}</span>
            <button on:click={handleSignOut} class="text-primary hover:text-primary-hover font-semibold">Sign Out</button>
          </div>
        {:else}
          <a href="/merchants/sign-in" class="text-primary hover:text-primary-hover font-semibold">Sign In</a>
          <a href="/merchants/sign-up" class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition">Sign Up</a>
        {/if}
      </div>
    </div>
  </div>
</header>
