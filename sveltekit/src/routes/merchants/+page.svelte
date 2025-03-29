<!-- 
  Merchants Home Page
  This is the main entry point for the merchant portal
-->

<script>
  import { goto } from '$app/navigation';
  
  // Redirect logic
  function redirectToSignIn() {
    goto('/merchants/sign-in');
  }
  
  function redirectToSignUp() {
    goto('/merchants/sign-up');
  }
</script>

<div class="merchant-home">
  <div class="hero-section py-16 text-center">
    <h1 class="text-4xl font-bold mb-6">SuperDeals Merchant Portal</h1>
    <p class="text-xl mb-8 max-w-2xl mx-auto">
      Reach thousands of customers and grow your business by offering exclusive deals on our platform.
    </p>
    
    <div class="flex justify-center gap-4">
      <button 
        class="btn-primary px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onclick={redirectToSignIn}
      >
        Sign In
      </button>
      
      <button 
        class="btn-secondary px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
        onclick={redirectToSignUp}
      >
        Create Account
      </button>
    </div>
  </div>
  
  <div class="features-section py-12 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-10">Why Join SuperDeals?</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="feature-card p-6 bg-white rounded-lg shadow-sm">
          <h3 class="text-xl font-semibold mb-3">Expand Your Reach</h3>
          <p>Connect with thousands of potential customers actively looking for great deals in your area.</p>
        </div>
        
        <div class="feature-card p-6 bg-white rounded-lg shadow-sm">
          <h3 class="text-xl font-semibold mb-3">Easy Management</h3>
          <p>Create and manage your deals with our intuitive dashboard. Track performance in real-time.</p>
        </div>
        
        <div class="feature-card p-6 bg-white rounded-lg shadow-sm">
          <h3 class="text-xl font-semibold mb-3">Flexible Options</h3>
          <p>Offer various types of deals including percentage discounts, buy-one-get-one, and more.</p>
        </div>
      </div>
    </div>
  </div>
</div>
