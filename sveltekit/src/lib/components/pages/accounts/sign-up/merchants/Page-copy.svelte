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
  // Shared atomic/molecule components
  import FormField from '$lib/components/shared/FormField.svelte';
  import Input from '$lib/components/shared/Input.svelte';
  import Select from '$lib/components/shared/Select.svelte';
  import Button from '$lib/components/shared/Button.svelte';
  import ErrorBanner from '$lib/components/shared/ErrorBanner.svelte';
  import InfoBanner from '$lib/components/shared/InfoBanner.svelte';
  import LoadingSpinner from '$lib/components/shared/LoadingSpinner.svelte';
  import VerificationCodeInput from '$lib/components/shared/VerificationCodeInput.svelte';
  
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
      <ErrorBanner message={error} dismissible={true} />
    {/if}
    {#if showDevInfo && verificationCode}
      <InfoBanner>
        <p class="font-bold">Development Mode</p>
        <p>Verification Code: {verificationCode}</p>
        <Button type="button" on:click={goToConfirmation}>Go to Confirmation Page</Button>
      </InfoBanner>
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
        <FormField label="Business Name" error={''}>
          <Input type="text" id="businessName" name="businessName" bind:value={businessName} required maxlength="255" />
        </FormField>

        <FormField label="Email Address" error={''}>
          <Input type="email" id="email" name="email" bind:value={email} required />
        </FormField>

        <FormField label="Password" error={''}>
          <Input type={showPassword ? "text" : "password"} id="password" name="password" bind:value={password} required minlength="8" />
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
        </FormField>

        <FormField label="Confirm Password" error={''}>
          <Input type={showPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" bind:value={confirmPassword} required minlength="8" />
          {#if password !== confirmPassword && confirmPassword}
            <p class="text-xs text-red-500 mt-1">Passwords do not match</p>
          {/if}
        </FormField>

        <FormField>
          <div class="flex items-center">
            <Input type="checkbox" id="showPassword" bind:checked={showPassword} />
            <label for="showPassword" class="ml-2 block text-sm text-gray-900">Show password</label>
          </div>
        </FormField>

        <div class="mt-6">
          <Button type="button" on:click={nextStep} disabled={!isStep1Valid || isLoading}>Continue</Button>
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
        <FormField label="Business Registration Number" error={''}>
          <Input type="text" id="registrationNumber" name="registrationNumber" bind:value={registrationNumber} required />
        </FormField>

        <FormField label="Year of Registration" error={''}>
          <Select id="yearOfRegistration" name="yearOfRegistration" bind:value={yearOfRegistration} required>
            <option value="">Select Year</option>
            {#each yearOptions as year}
              <option value={year}>{year}</option>
            {/each}
          </Select>
        </FormField>

        <FormField label="Business Type" error={''}>
          <Select id="businessType" name="businessType" bind:value={businessType} required>
            <option value="retail">Retail</option>
            <option value="wholesale">Wholesale</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="service">Service</option>
            <option value="restaurant">Restaurant</option>
            <option value="technology">Technology</option>
            <option value="other">Other</option>
          </Select>
        </FormField>

        <FormField label="Website (Optional)" error={''}>
          <Input type="url" id="website" name="website" bind:value={website} placeholder="https://example.com" pattern="https?://.+" title="Include http:// or https:// in your URL" />
        </FormField>

        <div class="flex justify-between mt-6">
          <Button type="button" on:click={prevStep}>Back</Button>
          <Button type="button" on:click={nextStep} disabled={!isStep2Valid || isLoading}>Continue</Button>
        </div>
      {:else}
        <!-- Step 3: Contact Information -->
        <h3 class="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>

        <FormField label="Business Phone" error={''}>
          <Input type="tel" id="phone" name="phone" bind:value={phone} required />
        </FormField>

        <h4 class="text-md font-medium text-gray-800 mt-4 mb-2">Business Address</h4>

        <div class="grid grid-cols-2 gap-4">
          <FormField label="Building Number" error={''}>
            <Input type="text" id="buildingNumber" name="buildingNumber" bind:value={buildingNumber} required />
          </FormField>
          <FormField label="Street" error={''}>
            <Input type="text" id="street" name="street" bind:value={street} required />
          </FormField>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <FormField label="City" error={''}>
            <Input type="text" id="city" name="city" bind:value={city} required />
          </FormField>
          <FormField label="State/Province" error={''}>
            <Input type="text" id="state" name="state" bind:value={state} required />
          </FormField>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-4">
          <FormField label="ZIP/Postal Code" error={''}>
            <Input type="text" id="zip" name="zip" bind:value={zip} required />
          </FormField>
          <FormField label="Country" error={''}>
            <Input type="text" id="country" name="country" bind:value={country} required />
          </FormField>
        </div>

        <h4 class="text-md font-medium text-gray-800 mt-4 mb-2">Primary Contact</h4>

        <FormField label="Contact Name" error={''}>
          <Input type="text" id="primaryContactName" name="primaryContactName" bind:value={primaryContactName} required />
        </FormField>

        <FormField label="Contact Email" error={''}>
          <div class="flex items-center mb-2">
            <Input type="checkbox" id="useSameEmail" bind:checked={useSameEmail} />
            <label for="useSameEmail" class="ml-2 block text-sm text-gray-900">Same as business email</label>
          </div>
          <Input type="email" id="primaryContactEmail" name="primaryContactEmail" bind:value={primaryContactEmail} required disabled={useSameEmail} />
        </FormField>

        <FormField label="Contact Phone" error={''}>
          <div class="flex items-center mb-2">
            <Input type="checkbox" id="useSamePhone" bind:checked={useSamePhone} />
            <label for="useSamePhone" class="ml-2 block text-sm text-gray-900">Same as business phone</label>
          </div>
          <Input type="tel" id="primaryContactPhone" name="primaryContactPhone" bind:value={primaryContactPhone} required disabled={useSamePhone} />
        </FormField>

        <FormField label="Product Categories" error={''}>
          <div class="flex items-center space-x-2">
            <Select id="selectedCategory" bind:value={selectedCategory}>
              <option value="">Select a category</option>
              {#each availableCategories.filter(c => !productCategories.includes(c)) as category}
                <option value={category}>{category}</option>
              {/each}
            </Select>
            <Button type="button" on:click={addCategory} disabled={!selectedCategory}>Add</Button>
          </div>

          <div class="mt-2 flex flex-wrap gap-2">
            {#each productCategories as category}
              <div class="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center">
                <span>{category}</span>
                <Button type="button" on:click={() => removeCategory(category)}>Remove</Button>
              </div>
            {/each}
            {#if productCategories.length === 0}
              <p class="text-xs text-red-500">At least one product category is required</p>
            {/if}
          </div>
        </FormField>

        <FormField>
          <div class="flex items-center">
            <Input type="checkbox" id="acceptTerms" name="acceptTerms" bind:checked={acceptTerms} required />
            <label for="acceptTerms" class="ml-2 block text-sm text-gray-900">
              I accept the <a href="/terms" class="text-blue-600 hover:text-blue-500">Terms and Conditions</a>
            </label>
          </div>
        </FormField>

        <div class="flex justify-between mt-6">
          <Button type="button" on:click={prevStep}>Back</Button>
          <Button type="submit" loading={isLoading} disabled={!isStep3Valid || isLoading}>Create Account</Button>
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
