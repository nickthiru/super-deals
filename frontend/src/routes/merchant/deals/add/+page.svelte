<script>
  import { enhance } from '$app/forms';

  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<h1 id="add-deal-title">Add a Deal</h1>

<form method="POST" aria-labelledby="add-deal-title" enctype="multipart/form-data" use:enhance>
  <input type="hidden" name="merchantId" value="Nike">

  <label>
    Deal Title
    <input name="title" type="text" required maxlength="255">
  </label>

  <label>
    Original Price
    <input name="originalPrice" type="number" required min="0">
  </label>

  <label>
    Discount
    <input name="discount" type="number" required min="0" max="100">
  </label>

  <label>
    Logo
    <input name="logo" type="file" required accept=".jpg, .jpeg, .png, .gif">
  </label>

  <label>
    Category
    <select name="category" required>
      <option value="">Select a category</option>
      <option value="foodDrink">Food & Drink</option>
      <option value="bathroom">Bathroom</option>
      <option value="jewelery">Jewelery</option>
      <option value="sports">Sports</option>
      <option value="tech">Tech</option>
      <option value="auto">Auto</option>
      <option value="entertainment">Entertainment</option>
      <option value="travel">Travel</option>
    </select>
  </label>

  <label>
    Expiration
    <input name="expiration" type="date" required min="{new Date().toISOString().split('T')[0]}">
  </label>

  <button type="submit">Add Deal</button>
</form>

{#if form?.errors}
  <ul>
    {#each Object.entries(form.errors) as [field, errorMessages]}
      {#each errorMessages as errorMessage}
        <li class="error">{field}: {errorMessage}</li>
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