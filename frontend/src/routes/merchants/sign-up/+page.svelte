<!-- frontend/src/routes/merchant/sign-up/+page.svelte -->
<script>
  import { enhance } from '$app/forms';

  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<h1 id="sign-up-title">Merchant Sign-Up</h1>

<form method="POST" aria-labelledby="sign-up-title" use:enhance>
  <label>
    Business Name
    <input name="businessName" type="text" required maxlength="255">
    {#if form?.errors?.businessName}
      <span class="error">{form.errors.businessName[0]}</span>
    {/if}
  </label>

  <label>
    Email
    <input name="email" type="email" required>
    {#if form?.errors?.email}
      <span class="error">{form.errors.email[0]}</span>
    {/if}
  </label>

  <label>
    Password
    <input name="password" type="password" required minlength="8">
    {#if form?.errors?.password}
      <span class="error">{form.errors.password[0]}</span>
    {/if}
  </label>

  <label>
    Confirm Password
    <input name="confirmPassword" type="password" required minlength="8">
    {#if form?.errors?.confirmPassword}
      <span class="error">{form.errors.confirmPassword[0]}</span>
    {/if}
  </label>

  <!-- Hidden field for user group information -->
  <input type="hidden" name="userGroup" value="merchant">

  <button type="submit">Sign Up</button>
</form>

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
    margin-bottom: 1rem;
  }

  input {
    margin-top: 0.5rem;
  }

  button {
    display: inline-block;
    width: fit-content;
    margin-top: 0.5rem;
  }
</style>