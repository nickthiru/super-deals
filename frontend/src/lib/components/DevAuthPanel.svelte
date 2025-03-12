<!-- 
  DevAuthPanel.svelte
  A development-only component for testing authentication flows
  without requiring real AWS Cognito credentials
-->

{#if dev && useMockAuth}
  <div class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden transition-all duration-300"
       style="width: {isExpanded ? '320px' : '48px'}; height: {isExpanded ? 'auto' : '48px'}">
    
    <!-- Header with toggle -->
    <button 
      class="bg-blue-600 text-white p-3 flex justify-between items-center cursor-pointer w-full border-none"
      onclick={() => togglePanel()}
      aria-label="Toggle development auth panel">
      <h3 class="font-bold text-sm m-0 {!isExpanded ? 'hidden' : ''}">Development Auth Panel</h3>
      <span class="flex items-center justify-center h-6 w-6">
        {#if isExpanded}
          <i class="fa-solid fa-chevron-down"></i>
        {:else}
          <i class="fa-solid fa-user-lock"></i>
        {/if}
      </span>
    </button>
    
    {#if isExpanded}
      <div class="p-4">
        {#if error}
          <div class="bg-red-50 text-red-700 p-2 rounded text-xs mb-2">{error}</div>
        {/if}
        
        {#if $auth.isAuthenticated}
          <div class="mb-3">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-bold">Authenticated User</span>
              <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
            </div>
            <div class="text-xs space-y-1 bg-gray-50 p-2 rounded">
              <div><strong>Email:</strong> {$auth.user?.email}</div>
              <div><strong>Type:</strong> {$auth.user?.userType}</div>
              {#if $auth.user?.businessName}
                <div><strong>Business:</strong> {$auth.user?.businessName}</div>
              {/if}
              <div><strong>ID:</strong> {$auth.user?.sub?.substring(0, 8)}...</div>
            </div>
          </div>
          <button 
            class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-xs"
            onclick={() => handleSignOut()}>
            Sign Out
          </button>
        {:else}
          {#if pendingConfirmation}
            <div class="space-y-3">
              <div class="text-xs font-bold mb-1">Confirm Sign Up</div>
              <div class="text-xs text-gray-600 mb-2">
                Enter the 6-digit code to confirm your account.<br>
                <span class="text-blue-600">Any 6 digits will work in mock mode.</span>
              </div>
              
              <div>
                <label for="confirm-email" class="block text-xs text-gray-700 mb-1">Email</label>
                <input
                  id="confirm-email"
                  type="email"
                  class="w-full p-2 border border-gray-300 rounded text-xs"
                  placeholder="Email"
                  disabled
                  value={username}
                />
              </div>
              
              <div>
                <label for="confirmation-code" class="block text-xs text-gray-700 mb-1">Confirmation Code</label>
                <input
                  id="confirmation-code"
                  type="text"
                  class="w-full p-2 border border-gray-300 rounded text-xs"
                  placeholder="6-digit code"
                  bind:value={confirmationCode}
                />
              </div>
              
              <button 
                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-xs"
                onclick={() => handleConfirmSignUp()}>
                Confirm
              </button>
              
              <button 
                class="w-full bg-transparent hover:bg-gray-100 text-gray-700 py-2 px-4 rounded text-xs border border-gray-300"
                onclick={() => pendingConfirmation = false}>
                Back to Sign In
              </button>
            </div>
          {:else}
            <div class="space-y-3">
              <div class="flex mb-2">
                <button 
                  class={`flex-1 py-1 text-xs font-medium ${activeTab === 'signin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-l`}
                  onclick={() => activeTab = 'signin'}>
                  Sign In
                </button>
                <button 
                  class={`flex-1 py-1 text-xs font-medium ${activeTab === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} rounded-r`}
                  onclick={() => activeTab = 'signup'}>
                  Sign Up
                </button>
              </div>
              
              {#if activeTab === 'signin'}
                <div class="space-y-3">
                  <div>
                    <label for="signin-email" class="block text-xs text-gray-700 mb-1">Email</label>
                    <input
                      id="signin-email"
                      type="email"
                      class="w-full p-2 border border-gray-300 rounded text-xs"
                      placeholder="Email"
                      bind:value={username}
                    />
                  </div>
                  
                  <div>
                    <label for="signin-password" class="block text-xs text-gray-700 mb-1">Password</label>
                    <input
                      id="signin-password"
                      type="password"
                      class="w-full p-2 border border-gray-300 rounded text-xs"
                      placeholder="Password"
                      bind:value={password}
                    />
                  </div>
                  
                  <button 
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-xs"
                    onclick={() => handleSignIn()}>
                    Sign In
                  </button>
                  
                  <button 
                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded text-xs"
                    onclick={() => handleSignInWithRedirect()}>
                    Sign In with OAuth
                  </button>
                </div>
              {:else}
                <div class="space-y-3">
                  <div>
                    <label for="signup-email" class="block text-xs text-gray-700 mb-1">Email</label>
                    <input
                      id="signup-email"
                      type="email"
                      class="w-full p-2 border border-gray-300 rounded text-xs"
                      placeholder="Email"
                      bind:value={username}
                    />
                  </div>
                  
                  <div>
                    <label for="signup-password" class="block text-xs text-gray-700 mb-1">Password</label>
                    <input
                      id="signup-password"
                      type="password"
                      class="w-full p-2 border border-gray-300 rounded text-xs"
                      placeholder="Password"
                      bind:value={password}
                    />
                  </div>
                  
                  <div>
                    <label for="user-type" class="block text-xs text-gray-700 mb-1">User Type</label>
                    <select 
                      id="user-type"
                      class="w-full p-2 border border-gray-300 rounded text-xs"
                      bind:value={userType}>
                      <option value="merchant">Merchant</option>
                      <option value="customer">Customer</option>
                    </select>
                  </div>
                  
                  {#if userType === 'merchant'}
                    <div>
                      <label for="business-name" class="block text-xs text-gray-700 mb-1">Business Name</label>
                      <input
                        id="business-name"
                        type="text"
                        class="w-full p-2 border border-gray-300 rounded text-xs"
                        placeholder="Business Name"
                        bind:value={businessName}
                      />
                    </div>
                  {/if}
                  
                  <button 
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-xs"
                    onclick={() => handleSignUp()}>
                    Sign Up
                  </button>
                </div>
              {/if}
            </div>
          {/if}
        {/if}
      </div>
    {/if}
  </div>
{/if}

<script>
  import { dev } from '$app/environment';
  import { signUp, confirmSignUp, signIn, signOut, signInWithRedirect } from '$lib/utils/authProvider';
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  
  // Form state using Svelte 5 runes
  let username = $state('');
  let password = $state('');
  let confirmationCode = $state('');
  let userType = $state('merchant');
  let businessName = $state('');
  let pendingConfirmation = $state(false);
  let error = $state('');
  let isExpanded = $state(true);
  let activeTab = $state('signin');
  
  // Check if mock auth is enabled
  const useMockAuth = dev && import.meta.env.VITE_USE_MOCK_AUTH === 'true';
  
  // Check localStorage for pending confirmation
  $effect(() => {
    const pendingEmail = localStorage.getItem('pendingConfirmation');
    if (pendingEmail) {
      username = pendingEmail;
      pendingConfirmation = true;
    }
  });
  
  /**
   * Handle sign up
   */
  async function handleSignUp() {
    try {
      error = '';
      const userAttributes = {
        email: username,
        'custom:userType': userType
      };
      
      if (userType === 'merchant' && businessName) {
        // Use type assertion to avoid TypeScript errors
        /** @type {any} */
        const attrs = userAttributes;
        attrs['custom:businessName'] = businessName;
      }
      
      await signUp({
        username,
        password,
        options: {
          userAttributes
        }
      });
      
      localStorage.setItem('pendingConfirmation', username);
      localStorage.setItem('pendingUserType', userType);
      pendingConfirmation = true;
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
  }
  
  /**
   * Handle confirmation
   */
  async function handleConfirmSignUp() {
    try {
      error = '';
      await confirmSignUp({
        username,
        confirmationCode
      });
      
      pendingConfirmation = false;
      confirmationCode = '';
      
      // Sign in after confirmation
      await signIn({
        username,
        password
      });
      
      // Refresh auth store
      auth.initialize();
      
      // Redirect to dashboard
      const userType = localStorage.getItem('pendingUserType') || 'merchant';
      goto(`/${userType}s/dashboard`);
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
  }
  
  /**
   * Handle sign in
   */
  async function handleSignIn() {
    try {
      error = '';
      await signIn({
        username,
        password
      });
      
      // Refresh auth store
      auth.initialize();
      
      // Redirect to dashboard based on user type
      const userType = $auth.user?.userType || 'merchant';
      goto(`/${userType}s/${$auth.user?.sub || 'dashboard'}`);
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
  }
  
  /**
   * Handle sign in with redirect (OAuth flow)
   */
  async function handleSignInWithRedirect() {
    try {
      error = '';
      // In mock mode, this just opens the auth panel
      // We'll simulate a successful sign-in instead
      await signIn({
        username,
        password
      });
      
      // Refresh auth store
      auth.initialize();
      
      // Redirect to dashboard based on user type
      const userType = $auth.user?.userType || 'merchant';
      goto(`/${userType}s/${$auth.user?.sub || 'dashboard'}`);
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
  }
  
  /**
   * Handle sign out
   */
  async function handleSignOut() {
    try {
      error = '';
      await signOut();
      
      // Clear auth store
      auth.clearUser();
      
      // Redirect to home
      goto('/');
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
  }
  
  /**
   * Toggle panel expansion
   */
  function togglePanel() {
    isExpanded = !isExpanded;
  }
</script>
