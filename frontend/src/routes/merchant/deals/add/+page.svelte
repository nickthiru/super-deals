<script>
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';
  import dealSchema from './deal.schema.js';

  export let form;

  // Reactive variable to hold the selected category
  let selectedCategory = '';

  // Function to handle category change
  function handleCategoryChange(event) {
    selectedCategory = event.target.value;
  }

  // Custom enhance function for client-side validation
  const customEnhance = (formElement) => {
    console.log("formElement:", formElement);
    if (!(formElement instanceof HTMLFormElement)) {
      console.error("customEnhance should be applied to a form element");
      return;
    }

    formElement.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(formElement);

      // Parse and validate the form data
      const result = dealSchema.safeParse(formData);

      if (!result.success) {
        // Display error messages
        const errors = result.error.flatten().fieldErrors;
        for (const [field, messages] of Object.entries(errors)) {
          const input = formElement.querySelector(`[name="${field}"]`);
          if (input) {
            input.setCustomValidity(messages.join(', '));
            input.reportValidity();
          }
        }
      } else {
        // Clear previous custom validity messages
        formElement.querySelectorAll('input, select').forEach(input => {
          input.setCustomValidity('');
        });

        // Submit the form data to the server
        formElement.submit();
      }
    });
  };

  onMount(() => {
    // Clear the form fields on mount
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.reset();
      selectedCategory = ''; // Ensure the selected category is reset
    }
  });
</script>

<h1 id="add-deal-title">Add a Deal</h1>

<form method="POST" aria-labelledby="add-deal-title" enctype="multipart/form-data" use:enhance={customEnhance}>
  <input type="hidden" name="merchantId" value="Nike">

  <label>
    Deal Title
    <input name="title" type="text" value={form?.data?.title ?? ''} required>
  </label>
  {#if form?.errors?.title}
    <p class="error">{form.errors.title}</p>
  {/if}

  <label>
    Original Price
    <input name="originalPrice" type="number" value={form?.data?.originalPrice ?? ''} required>
  </label>
  {#if form?.errors?.originalPrice}
    <p class="error">{form.errors.originalPrice}</p>
  {/if}

  <label>
    Discount
    <input name="discount" type="number" value={form?.data?.discount ?? ''} required>
  </label>
  {#if form?.errors?.discount}
    <p class="error">{form.errors.discount}</p>
  {/if}

  <label>
    Category
    <select name="category" on:change={handleCategoryChange} required>
      <option value="" disabled selected={selectedCategory === ''}>Select a category</option>
      <option value="foodDrink" selected={selectedCategory === 'foodDrink'}>Food & Drink</option>
      <option value="bathroom" selected={selectedCategory === 'bathroom'}>Bathroom</option>
      <option value="jewelery" selected={selectedCategory === 'jewelery'}>Jewelery</option>
      <option value="sports" selected={selectedCategory === 'sports'}>Sports</option>
      <option value="tech" selected={selectedCategory === 'tech'}>Technology</option>
      <option value="auto" selected={selectedCategory === 'auto'}>Auto</option>
      <option value="entertainment" selected={selectedCategory === 'entertainment'}>Entertainment</option>
      <option value="travel" selected={selectedCategory === 'travel'}>Travel</option>
    </select>
  </label>
  {#if form?.errors?.category}
    <p class="error">{form.errors.category}</p>
  {/if}

  <label>
    Logo
    <input name="logo" type="file" accept=".jpg, .png, .svg" required>
  </label>
  {#if form?.errors?.logo}
    <p class="error">{form.errors.logo}</p>
  {/if}

  <label>
    Expiration
    <input name="expiration" type="date" value={form?.data?.expiration ?? ''} required>
  </label>
  {#if form?.errors?.expiration}
    <p class="error">{form.errors.expiration}</p>
  {/if}

  <button type="submit">Add Deal</button>
</form>

{#if form?.errors}
  <ul>
    {#each Object.entries(form.errors) as [field, errorMessages]}
      {#each errorMessages as errorMessage}
        <li>{field}: {errorMessage}</li>
      {/each}
    {/each}
  </ul>
{/if}

<style>
  .error {
    color: tomato;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  label {
    display: block;
    margin-bottom: 1rem; /* Add some spacing between the fields */
  }

  input, select {
    margin-top: 0.5rem; /* Add some spacing between the label and the input */
  }

  button {
    display: inline-block;
    width: fit-content; /* Ensure the button fits its text content */
    margin-top: 0.5rem;
  }
</style>