<script>
  export let variant = 'primary';
  export let size = 'md';
  export let type = 'button';
</script>

<button
  {type}
  class="button"
  class:primary={variant === 'primary'}
  class:secondary={variant === 'secondary'}
  class:sm={size === 'sm'}
  class:md={size === 'md'}
  class:lg={size === 'lg'}
  on:click
>
  <slot />
</button>

<style>
  .button {
    font-family: var(--font-sans);
    font-weight: var(--font-weight-6);
    border-radius: var(--radius-3);
    transition: background-color var(--transition-ease-out);
    cursor: pointer;
  }

  .primary {
    background-color: var(--brand);
    color: var(--gray-0);
  }

  .primary:hover {
    background-color: var(--brand-dark);
  }

  .secondary {
    color: var(--brand);
  }

  .secondary:hover {
    color: var(--brand-dark);
  }

  .sm { padding: var(--size-2) var(--size-3); }
  .md { padding: var(--size-3) var(--size-4); }
  .lg { padding: var(--size-4) var(--size-6); }
</style>
