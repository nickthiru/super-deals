<!-- frontend/src/routes/merchant/sign-in/+page.svelte -->
<script>
  import { enhance } from '$app/forms';

  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<h1 id="sign-in-title">Merchant Sign-In</h1>

<form method="POST" aria-labelledby="sign-in-title" use:enhance>
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

  <button type="submit">Sign In</button>
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