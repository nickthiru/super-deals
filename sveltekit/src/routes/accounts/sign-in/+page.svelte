<!-- 
  Sign In Page
  Handles user authentication
 -->

<script>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  
  // Props using Svelte 5 runes
  const { data, form } = $props();
  
  // Reactive state using Svelte 5 runes
  const formState = $state({
    email: '',
    password: '',
    error: '',
    message: '',
    isLoading: false,
    showForgotPassword: false,
    userType: 'merchant'
  });
  
  // Initialize on component mount
  $effect(() => {
    // Check if we were redirected from email verification
    if (data?.verified) {
      formState.message = 'Your email has been verified. You can now sign in.';
    }
    
    // Set user type from data
    if (data?.userType) {
      formState.userType = data.userType;
    }
  });
  
  // Handle form results from server
  $effect(() => {
    if (form) {
      if (form.success === false && form.error) {
        formState.error = form.error;
        formState.isLoading = false;
      } else if (form.success === true && form.message) {
        formState.message = form.message;
        formState.error = '';
        
        // Reset form if operation was successful
        if (formState.showForgotPassword) {
          formState.email = '';
          formState.showForgotPassword = false;
        }
      }
    }
  });
  
  // Toggle forgot password form
  function toggleForgotPassword() {
    formState.showForgotPassword = !formState.showForgotPassword;
    formState.error = '';
    formState.message = '';
  }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col">
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex-shrink-0">
          <a href="/" class="text-blue-600 font-bold text-xl">SuperDeals</a>
        </div>
      </div>
    </div>
  </header>
  
  <main class="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
      <div>
        <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
          {formState.showForgotPassword ? 'Reset Password' : 'Sign In'}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {#if formState.showForgotPassword}
            Enter your email to receive a password reset link
          {:else}
            Sign in to access your {formState.userType === 'merchant' ? 'merchant' : ''} account
          {/if}
        </p>
      </div>
      
      {#if formState.error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{formState.error}</span>
        </div>
      {/if}
      
      {#if formState.message}
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{formState.message}</span>
        </div>
      {/if}
      
      {#if formState.showForgotPassword}
        <!-- Forgot Password Form -->
        <form 
          method="POST" 
          action="?/forgotPassword"
          class="mt-8 space-y-6"
          use:enhance={() => {
            formState.isLoading = true;
            formState.error = '';
            formState.message = '';
            
            return async ({ result }) => {
              formState.isLoading = false;
            };
          }}
        >
          <input type="hidden" name="userType" value={formState.userType} />
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <div class="mt-1">
              <input 
                id="email" 
                name="email" 
                type="email" 
                autocomplete="email" 
                required 
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                bind:value={formState.email}
                disabled={formState.isLoading}
              />
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <button 
              type="button" 
              class="text-sm font-medium text-blue-600 hover:text-blue-500"
              onclick={toggleForgotPassword}
              disabled={formState.isLoading}
            >
              Back to sign in
            </button>
          </div>
          
          <div>
            <button 
              type="submit" 
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={formState.isLoading}
            >
              {#if formState.isLoading}
                <span class="flex items-center">
                  Sending
                  <span class="ml-2 flex items-center">
                    <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  </span>
                </span>
              {:else}
                Reset Password
              {/if}
            </button>
          </div>
        </form>
      {:else}
        <!-- Sign In Form -->
        <form 
          method="POST" 
          action="?/signIn"
          class="mt-8 space-y-6"
          use:enhance={() => {
            formState.isLoading = true;
            formState.error = '';
            formState.message = '';
            
            return async ({ result }) => {
              formState.isLoading = false;
              
              if (result.type === 'redirect') {
                // Let the redirect happen
              }
            };
          }}
        >
          <input type="hidden" name="userType" value={formState.userType} />
          
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input 
                id="email-address" 
                name="email" 
                type="email" 
                autocomplete="email" 
                required 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                bind:value={formState.email}
                disabled={formState.isLoading}
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                autocomplete="current-password" 
                required 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                bind:value={formState.password}
                disabled={formState.isLoading}
              />
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            
            <div class="text-sm">
              <button 
                type="button" 
                class="font-medium text-blue-600 hover:text-blue-500"
                onclick={toggleForgotPassword}
                disabled={formState.isLoading}
              >
                Forgot your password?
              </button>
            </div>
          </div>
          
          <div>
            <button 
              type="submit" 
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={formState.isLoading}
            >
              {#if formState.isLoading}
                <span class="flex items-center">
                  Signing in
                  <span class="ml-2 flex items-center">
                    <span class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  </span>
                </span>
              {:else}
                Sign in
              {/if}
            </button>
          </div>
          
          <div class="text-center">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <a 
                href={formState.userType === 'merchant' ? '/merchants/sign-up' : '/sign-up'} 
                class="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      {/if}
    </div>
  </main>
  
  <footer class="bg-white">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <p class="text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} SuperDeals. All rights reserved.
      </p>
    </div>
  </footer>
</div>
