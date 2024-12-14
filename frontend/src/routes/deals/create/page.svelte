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
    <input name="title" type="text" required maxlength="255" />
    {#if form?.errors?.title}
      <span class="error">{form.errors.title[0]}</span>
    {/if}
  </label>

  <label>
    Original Price
    <input name="originalPrice" type="number" min="0.01" step="0.01" required />
    {#if form?.errors?.originalPrice}
      <span class="error">{form.errors.originalPrice[0]}</span>
    {/if}
  </label>

  <label>
    Discount
    <input name="discount" type="number" min="0.01" max="100" step="0.01" required />
    {#if form?.errors?.discount}
      <span class="error">{form.errors.discount[0]}</span>
    {/if}
  </label>

  <label>
    Logo (accepts .jpg, .jpeg, .png, .gif)
    <input name="logo" type="file" accept=".jpg, .jpeg, .png, .gif" required />
    {#if form?.errors?.logo}
      <span class="error">{form.errors.logo[0]}</span>
    {/if}
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
    {#if form?.errors?.category}
      <span class="error">{form.errors.category[0]}</span>
    {/if}
  </label>

  <label>
    Expiration
    <input name="expiration" type="date" required />
    {#if form?.errors?.expiration}
      <span class="error">{form.errors.expiration[0]}</span>
    {/if}
  </label>

  <button type="submit">Add Deal</button>
</form>

<style>
  .error {
    color: tomato;
    font-size: 0.875rem;
    margin-left: 0.5rem;
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