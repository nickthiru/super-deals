<script>
  import { signInWithRedirect } from 'aws-amplify/auth';
  import { goto } from '$app/navigation';

  // Use $state() for reactive variables
  let email = $state('');
  let password = $state('');
  /** @type {string | null} */
  let error = $state(null);
  let isLoading = $state(false);
  let rememberMe = $state(false);

  // Use $effect() instead of onMount
  $effect(() => {
    // Ensure we're running in the browser
    if (typeof window !== 'undefined') {
      // Check if we have a code parameter in the URL (OAuth redirect)
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        // Handle the OAuth redirect
        handleOAuthRedirect();
      }
    }
  });

  /**
   * Handle OAuth redirect after successful sign-in
   */
  async function handleOAuthRedirect() {
    try {
      isLoading = true;
      await signInWithRedirect();
      goto('/merchants/dashboard');
    } catch (err) {
      console.error('OAuth redirect error:', err);
      error = 'Failed to complete sign in. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  /**
   * Handle merchant sign-in using Amplify
   * @param {SubmitEvent} event - Form submission event
   */
  async function handleSignIn(event) {
    event.preventDefault();
    error = null;
    isLoading = true;

    try {
      // Use signInWithRedirect without credentials for OAuth flow
      await signInWithRedirect();
    } catch (err) {
      console.error('Sign in error:', err);
      error = err instanceof Error ? err.message : 'Failed to sign in. Please try again.';
      isLoading = false;
    }
  }

  /**
   * Navigate to sign-up page
   */
  function navigateToSignUp() {
    goto('/merchants/sign-up');
  }

  /**
   * Navigate to forgot password page
   */
  function navigateToForgotPassword() {
    goto('/merchants/forgot-password');
  }
</script>

<div id="merchant-signin" class="min-h-screen bg-gray-50 flex flex-col">
  <header id="header" class="bg-white shadow-sm">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="text-2xl font-bold text-[#3B5998] cursor-pointer">Super Deals</span>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-gray-600 hover:text-[#3B5998] cursor-pointer">Need help?</span>
          <button 
            class="text-[#3B5998] hover:text-[#3B5998]/80 cursor-pointer bg-transparent border-none p-0 font-normal"
            onclick={() => navigateToSignUp()}
            onkeydown={(e) => e.key === 'Enter' && navigateToSignUp()}
          >Create account</button>
        </div>
      </div>
    </div>
  </header>
  
  <main id="signin-content" class="flex-grow flex items-center justify-center">
    <div class="container mx-auto px-6">
      <div class="max-w-md mx-auto">
        <div id="signin-card" class="bg-white rounded-lg shadow-lg p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p class="text-gray-600 mt-2">Sign in to your merchant account</p>
          </div>
          
          <form id="signin-form" class="space-y-6" onsubmit={(e) => handleSignIn(e)}>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2" for="email">
                Email address
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3B5998] focus:border-transparent" 
                placeholder="Enter your email" 
                required
                disabled={isLoading}
                value={email}
                oninput={(e) => email = e.currentTarget.value}
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2" for="password">
                Password
              </label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3B5998] focus:border-transparent" 
                placeholder="Enter your password" 
                required
                minlength="8"
                disabled={isLoading}
                value={password}
                oninput={(e) => password = e.currentTarget.value}
              >
            </div>
            
            {#if error}
              <div class="text-red-500 text-sm">{error}</div>
            {/if}
            
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="remember" 
                  class="h-4 w-4 text-[#3B5998] focus:ring-[#3B5998] border-gray-300 rounded"
                  checked={rememberMe}
                  onchange={(e) => rememberMe = e.currentTarget.checked}
                >
                <label for="remember" class="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <button 
                type="button"
                class="text-sm text-[#3B5998] hover:text-[#3B5998]/80 cursor-pointer bg-transparent border-none p-0"
                onclick={() => navigateToForgotPassword()}
                onkeydown={(e) => e.key === 'Enter' && navigateToForgotPassword()}
              >Forgot password?</button>
            </div>
            
            <button 
              type="submit" 
              class="w-full bg-[#3B5998] text-white py-3 px-4 rounded-lg hover:bg-[#3B5998]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B5998]"
              disabled={isLoading}
            >
              {#if isLoading}
                Signing in...
              {:else}
                Sign in
              {/if}
            </button>
          </form>
        </div>
        
        <div id="merchant-benefits" class="mt-8 text-center">
          <p class="text-gray-600">New to Super Deals?</p>
          <button 
            class="text-[#3B5998] hover:text-[#3B5998]/80 font-medium cursor-pointer bg-transparent border-none p-0"
            onclick={() => navigateToSignUp()}
            onkeydown={(e) => e.key === 'Enter' && navigateToSignUp()}
          >Join as a merchant and start selling today</button>
        </div>
      </div>
    </div>
  </main>
  
  <footer id="footer" class="bg-white border-t">
    <div class="container mx-auto px-6 py-4">
      <div class="flex justify-center items-center space-x-6 text-sm text-gray-600">
        <button class="hover:text-gray-900 cursor-pointer bg-transparent border-none p-0 text-gray-600 text-sm">Terms</button>
        <button class="hover:text-gray-900 cursor-pointer bg-transparent border-none p-0 text-gray-600 text-sm">Privacy</button>
        <button class="hover:text-gray-900 cursor-pointer bg-transparent border-none p-0 text-gray-600 text-sm">Help Center</button>
        <span> 2025 Super Deals. All rights reserved.</span>
      </div>
    </div>
  </footer>
</div>