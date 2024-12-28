<script>
  import { enhance } from '$app/forms';

  /** @type {import('./$types').ActionData} */
  export let form;
  export let data;

  $: ({ username } = data);

  function handleEnhance({ formData }) {
    formData.append('username', username);
  }
</script>

<h1 id="confirm-sign-up-title">Confirm Sign-Up</h1>

<form method="POST" aria-labelledby="confirm-sign-up-title" use:enhance={handleEnhance}>
  <label>
    Confirmation Code
    <input name="confirmationCode" type="text" required>
    {#if form?.errors?.confirmationCode}
      <span class="error">{form.errors.confirmationCode[0]}</span>
    {/if}
  </label>

  <button type="submit">Submit</button>
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