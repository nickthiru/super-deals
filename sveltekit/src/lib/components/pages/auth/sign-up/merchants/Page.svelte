<!-- 
  Merchant Sign Up Page
  Handles new merchant registration
-->

<script>
  // @ts-nocheck - Disable TypeScript checking for Svelte 5 runes
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { dev } from '$app/environment';
  import { browser } from '$app/environment';
  
  // Props using Svelte 5 runes
  const { form } = $props();
  
  // Reactive state using Svelte 5 runes
  // Step 1: Account Information
  let businessName = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let showPassword = $state(false);
  
  // Step 2: Business Information
  let registrationNumber = $state('');
  let yearOfRegistration = $state('');
  let businessType = $state('retail');
  let website = $state('');
  
  // Step 3: Contact Information
  let phone = $state('');
  // Address
  let buildingNumber = $state('');
  let street = $state('');
  let city = $state('');
  let state = $state('');
  let zip = $state('');
  let country = $state('United States');
  // Primary Contact
  let primaryContactName = $state('');
  let primaryContactEmail = $state('');
  let primaryContactPhone = $state('');
  let useSameEmail = $state(true);
  let useSamePhone = $state(true);
  // Product Categories
  let productCategories = $state([]);
  let availableCategories = $state([
    'Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Personal Care',
    'Books', 'Toys & Games', 'Sports & Outdoors', 'Automotive',
    'Health & Wellness', 'Food & Grocery', 'Jewelry', 'Office Supplies'
  ]);
  let selectedCategory = $state('');
  
  // Form state
  let acceptTerms = $state(false);
  let isLoading = $state(false);
  let error = $state('');
  let currentStep = $state(1);
  let showDevInfo = $state(false);
  let verificationCode = $state('');
  
  // Computed values
  $effect(() => {
    if (useSameEmail) {
      primaryContactEmail = email;
    }
    
    if (useSamePhone) {
      primaryContactPhone = phone;
    }
  });
  
  // Form validation
  // Password validation helpers
  const hasLowercase = $derived(password.match(/[a-z]/) !== null);
  const hasUppercase = $derived(password.match(/[A-Z]/) !== null);
  const hasDigit = $derived(password.match(/[0-9]/) !== null);
  const hasSymbol = $derived(password.match(/[^a-zA-Z0-9]/) !== null);
  const isLongEnough = $derived(password.length >= 8);
  
  const isPasswordValid = $derived(
    isLongEnough && hasLowercase && hasUppercase && hasDigit && hasSymbol
  );
  
  const isStep1Valid = $derived(
    businessName.trim() !== '' && 
    email.trim() !== '' && 
    email.includes('@') &&
    isPasswordValid &&
    password === confirmPassword
  );
  
  const isStep2Valid = $derived(
    typeof registrationNumber === 'string' && registrationNumber.trim() !== '' &&
    yearOfRegistration !== ''
  );
  
  const isStep3Valid = $derived(
    phone.trim() !== '' &&
    buildingNumber.trim() !== '' &&
    street.trim() !== '' &&
    city.trim() !== '' &&
    state.trim() !== '' &&
    zip.trim() !== '' &&
    country.trim() !== '' &&
    primaryContactName.trim() !== '' &&
    primaryContactEmail.trim() !== '' &&
    primaryContactEmail.includes('@') &&
    primaryContactPhone.trim() !== '' &&
    productCategories.length > 0 &&
    acceptTerms
  );
  
  // Handle form submission response
  $effect(() => {
    if (form) {
      if (dev) {
        console.log('Form response:', form);
      }
      
      if (form.success === false && form.error) {
        error = form.error;
        isLoading = false;
        
        // If the server indicates which step has the error, switch to that step
        if (form.step) {
          currentStep = form.step;
        }
      } else if (form.success === true) {
        // If the form was successful and we have a redirect URL, store data in localStorage first
        if (form.completed && form.email && form.redirect) {
          if (browser) {
            // Store email and user type in localStorage before redirecting
            localStorage.setItem('pendingConfirmation', form.email);
            localStorage.setItem('pendingUserType', form.userType || 'merchant');
            
            // If we have a verification code in development mode, store it
            if (form.verificationCode) {
              localStorage.setItem('devVerificationCode', form.verificationCode);
            }
            
            // Add a small delay to ensure localStorage is set before navigation
            setTimeout(() => {
              // Navigate to the confirmation page
              goto(form.redirect);
            }, 100);
          }
        } else {
          // For step transitions
          currentStep = form.step || currentStep + 1;
          error = '';
          isLoading = false;
        }
      }
    }
  });
  
  // Handle form navigation
  function nextStep() {
    if (currentStep === 1 && isStep1Valid) {
      currentStep = 2;
    } else if (currentStep === 2 && isStep2Valid) {
      currentStep = 3;
    }
  }
  
  function prevStep() {
    if (currentStep === 2) {
      currentStep = 1;
    } else if (currentStep === 3) {
      currentStep = 2;
    }
  }
  
  // Handle manual navigation to confirmation page
  function goToConfirmation() {
    goto('/auth/confirm-sign-up');
  }
  
  // Handle product categories
  function addCategory() {
    if (selectedCategory && !productCategories.includes(selectedCategory)) {
      productCategories = [...productCategories, selectedCategory];
      selectedCategory = '';
    }
  }
  
  function removeCategory(category) {
    productCategories = productCategories.filter(c => c !== category);
  }
  
  // Generate year options (last 100 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);
</script>

<div class="sign-up-page">
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-6 text-center">Create Merchant Account</h1>
    
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
        <p>{error}</p>
      </div>
    {/if}
    
    {#if showDevInfo && verificationCode}
      <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
        <p class="font-bold">Development Mode</p>
        <p>Verification Code: {verificationCode}</p>
        <button 
          type="button" 
          class="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          onclick={goToConfirmation}
        >
          Go to Confirmation Page
        </button>
      </div>
    {/if}
    
    <div class="steps-indicator mb-6">
      <div class="flex justify-between">
        <div class="step-item {currentStep >= 1 ? 'active' : ''}">
          <div class="step-number">1</div>
          <div class="step-label">Account</div>
        </div>
        <div class="step-connector"></div>
        <div class="step-item {currentStep >= 2 ? 'active' : ''}">
          <div class="step-number">2</div>
          <div class="step-label">Business</div>
        </div>
        <div class="step-connector"></div>
        <div class="step-item {currentStep >= 3 ? 'active' : ''}">
          <div class="step-number">3</div>
          <div class="step-label">Contact</div>
        </div>
      </div>
    </div>
    
    <form 
      method="POST" 
      class="space-y-6"
      use:enhance={() => {
        isLoading = true;
        error = '';
        
        return async ({ result, update }) => {
          isLoading = false;
          update();
        };
      }}
    >
      <!-- Hidden field to track current step -->
      <input type="hidden" name="currentStep" value={currentStep} />
      
      <!-- When on step 3, include hidden fields for step 1 and 2 data -->
      {#if currentStep === 3}
        <!-- Step 1 hidden fields -->
        <input type="hidden" name="businessName" value={businessName} />
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="password" value={password} />
        <input type="hidden" name="confirmPassword" value={confirmPassword} />
        
        <!-- Step 2 hidden fields -->
        <input type="hidden" name="registrationNumber" value={registrationNumber} />
        <input type="hidden" name="yearOfRegistration" value={yearOfRegistration} />
        <input type="hidden" name="businessType" value={businessType} />
        <input type="hidden" name="website" value={website} />
        
        <!-- If using same email, add a hidden field for primaryContactEmail -->
        {#if useSameEmail}
          <input type="hidden" name="primaryContactEmail" value={email} />
        {/if}
        
        <!-- If using same phone, add a hidden field for primaryContactPhone -->
        {#if useSamePhone}
          <input type="hidden" name="primaryContactPhone" value={phone} />
        {/if}
        
        <!-- Product categories as a single JSON field -->
        {#if productCategories.length > 0}
          <input type="hidden" name="productCategories" value={JSON.stringify(productCategories)} />
        {/if}
      {:else if currentStep === 2}
        <!-- Step 1 hidden fields -->
        <input type="hidden" name="businessName" value={businessName} />
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="password" value={password} />
        <input type="hidden" name="confirmPassword" value={confirmPassword} />
      {/if}
      
      {#if currentStep === 1}
        <!-- Step 1: Account Information -->
        <div class="form-group">
          <label for="businessName" class="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            bind:value={businessName}
            required
            maxlength="255"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div class="form-group mt-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            bind:value={email}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div class="form-group mt-4">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            bind:value={password}
            required
            minlength="8"
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
          />
          <!-- Password validation indicator is now handled through the text color -->
          {#if !isPasswordValid && password}
            <p class="text-xs text-red-500 mt-1">Password does not meet all requirements</p>
          {/if}
          <div class="text-xs mt-1">
            <p class="font-medium {isPasswordValid ? 'text-green-600' : 'text-gray-700'}">Password requirements:</p>
            <ul class="list-disc pl-5 mt-1">
              <li class="{isLongEnough ? 'text-green-600' : 'text-gray-600'}">At least 8 characters</li>
              <li class="{hasLowercase ? 'text-green-600' : 'text-gray-600'}">At least one lowercase letter</li>
              <li class="{hasUppercase ? 'text-green-600' : 'text-gray-600'}">At least one uppercase letter</li>
              <li class="{hasDigit ? 'text-green-600' : 'text-gray-600'}">At least one number</li>
              <li class="{hasSymbol ? 'text-green-600' : 'text-gray-600'}">At least one special character</li>
            </ul>
          </div>
        </div>
        
        <div class="form-group mt-4">
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            bind:value={confirmPassword}
            required
            minlength="8"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" class:border-red-500={password !== confirmPassword && confirmPassword}
          />
          {#if password !== confirmPassword && confirmPassword}
            <p class="text-xs text-red-500 mt-1">Passwords do not match</p>
          {/if}
        </div>
        
        <div class="form-group mt-2">
          <div class="flex items-center">
            <input 
              id="showPassword" 
              type="checkbox" 
              bind:checked={showPassword}
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
            />
            <label for="showPassword" class="ml-2 block text-sm text-gray-900">
              Show password
            </label>
          </div>
        </div>
        
        <div class="mt-6">
          <button
            type="button"
            onclick={nextStep}
            disabled={!isStep1Valid || isLoading}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </button>
          {#if !isStep1Valid && businessName && email && password && confirmPassword}
            <p class="text-xs text-red-500 mt-2 text-center">
              {#if password !== confirmPassword}
                Passwords do not match
              {:else if !isPasswordValid}
                Password does not meet the requirements
              {:else if !email.includes('@')}
                Please enter a valid email address
              {:else}
                Please fill in all required fields
              {/if}
            </p>
          {/if}
        </div>
      {:else if currentStep === 2}
        <!-- Step 2: Business Information -->
        <div class="form-group">
          <label for="registrationNumber" class="block text-sm font-medium text-gray-700 mb-1">Business Registration Number</label>
          <input
            type="text"
            id="registrationNumber"
            name="registrationNumber"
            bind:value={registrationNumber}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div class="form-group mt-4">
          <label for="yearOfRegistration" class="block text-sm font-medium text-gray-700 mb-1">Year of Registration</label>
          <select
            id="yearOfRegistration"
            name="yearOfRegistration"
            bind:value={yearOfRegistration}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Year</option>
            {#each yearOptions as year}
              <option value={year}>{year}</option>
            {/each}
          </select>
        </div>
        
        <div class="form-group mt-4">
          <label for="businessType" class="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
          <select
            id="businessType"
            name="businessType"
            bind:value={businessType}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="retail">Retail</option>
            <option value="wholesale">Wholesale</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="service">Service</option>
            <option value="restaurant">Restaurant</option>
            <option value="technology">Technology</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div class="form-group mt-4">
          <label for="website" class="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
          <input
            type="url"
            id="website"
            name="website"
            bind:value={website}
            placeholder="https://example.com"
            pattern="https?://.+"
            title="Include http:// or https:// in your URL"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div class="flex justify-between mt-6">
          <button
            type="button"
            onclick={prevStep}
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back
          </button>
          <button
            type="button"
            onclick={nextStep}
            disabled={!isStep2Valid || isLoading}
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </button>
        </div>
      {:else}
        <!-- Step 3: Contact Information -->
        <h3 class="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
        
        <div class="form-group">
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            bind:value={phone}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <h4 class="text-md font-medium text-gray-800 mt-4 mb-2">Business Address</h4>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label for="buildingNumber" class="block text-sm font-medium text-gray-700 mb-1">Building Number</label>
            <input
              type="text"
              id="buildingNumber"
              name="buildingNumber"
              bind:value={buildingNumber}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="form-group">
            <label for="street" class="block text-sm font-medium text-gray-700 mb-1">Street</label>
            <input
              type="text"
              id="street"
              name="street"
              bind:value={street}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mt-4">
          <div class="form-group">
            <label for="city" class="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              id="city"
              name="city"
              bind:value={city}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="form-group">
            <label for="state" class="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
            <input
              type="text"
              id="state"
              name="state"
              bind:value={state}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mt-4">
          <div class="form-group">
            <label for="zip" class="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
            <input
              type="text"
              id="zip"
              name="zip"
              bind:value={zip}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="form-group">
            <label for="country" class="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              bind:value={country}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <h4 class="text-md font-medium text-gray-800 mt-4 mb-2">Primary Contact</h4>
        
        <div class="form-group">
          <label for="primaryContactName" class="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
          <input
            type="text"
            id="primaryContactName"
            name="primaryContactName"
            bind:value={primaryContactName}
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div class="form-group mt-4">
          <label for="primaryContactEmail" class="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
          <div class="flex items-center mb-2">
            <input
              type="checkbox"
              id="useSameEmail"
              bind:checked={useSameEmail}
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="useSameEmail" class="ml-2 block text-sm text-gray-900">
              Same as business email
            </label>
          </div>
          <input
            type="email"
            id="primaryContactEmail"
            name="primaryContactEmail"
            bind:value={primaryContactEmail}
            required
            disabled={useSameEmail}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
        
        <div class="form-group mt-4">
          <label for="primaryContactPhone" class="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
          <div class="flex items-center mb-2">
            <input
              type="checkbox"
              id="useSamePhone"
              bind:checked={useSamePhone}
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="useSamePhone" class="ml-2 block text-sm text-gray-900">
              Same as business phone
            </label>
          </div>
          <input
            type="tel"
            id="primaryContactPhone"
            name="primaryContactPhone"
            bind:value={primaryContactPhone}
            required
            disabled={useSamePhone}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
        
        <div class="form-group mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2" for="selectedCategory">Product Categories</label>
          <div class="flex items-center space-x-2">
            <select
              id="selectedCategory"
              bind:value={selectedCategory}
              class="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {#each availableCategories.filter(c => !productCategories.includes(c)) as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
            <button
              type="button"
              onclick={addCategory}
              disabled={!selectedCategory}
              class="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          
          <div class="mt-2 flex flex-wrap gap-2">
            {#each productCategories as category}
              <div class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center">
                <span>{category}</span>
                <button
                  type="button"
                  onclick={() => removeCategory(category)}
                  class="ml-1 text-blue-600 hover:text-blue-800"
                  aria-label={`Remove ${category}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            {/each}
            {#if productCategories.length === 0}
              <p class="text-xs text-red-500">At least one product category is required</p>
            {/if}
          </div>
        </div>
        
        <div class="form-group mt-4">
          <div class="flex items-center">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              bind:checked={acceptTerms}
              required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="acceptTerms" class="ml-2 block text-sm text-gray-900">
              I accept the <a href="/terms" class="text-blue-600 hover:text-blue-500">Terms and Conditions</a>
            </label>
          </div>
        </div>
        
        <div class="flex justify-between mt-6">
          <button
            type="button"
            onclick={prevStep}
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!isStep3Valid || isLoading}
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Create Account'}
          </button>
        </div>
      {/if}
    </form>
    
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        Already have an account?
        <a href="/merchants/sign-in" class="font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </a>
      </p>
    </div>
  </div>
</div>

<style>
  .steps-indicator {
    margin-bottom: 1.5rem;
  }
  
  .steps-indicator .flex {
    position: relative;
  }
  
  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
  }
  
  .step-number {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: #e5e7eb;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .step-label {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .step-item.active .step-number {
    background-color: #2563eb;
    color: white;
  }
  
  .step-item.active .step-label {
    color: #1f2937;
    font-weight: 500;
  }
  
  .step-connector {
    flex-grow: 1;
    height: 2px;
    background-color: #e5e7eb;
    margin-top: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
</style>
