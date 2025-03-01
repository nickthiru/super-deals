<script>
  export let variant = 'primary'; // primary, secondary, inverse
  export let size = 'medium'; // small, medium, large
</script>

<button class="button {variant} {size}" on:click>
  <slot></slot>
</button>

<style>
  .button {
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
    font-size: 16px;
    font-weight: 600;
    transition: background-color 0.2s ease;
  }

  .primary {
    background-color: var(--primary-color);
    color: white;
  }

  .inverse {
    background-color: white;
    color: var(--primary-color);
  }

  .secondary {
    background-color: var(--secondary-color);
    color: white;
  }

  .medium {
    padding: 13px 18px;
  }

  .large {
    padding: 20px 32px;
  }

  .small {
    padding: 8px 16px;
    font-size: 14px;
  }

  .button:hover {
    opacity: 0.9;
  }

  .button:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
</style>
