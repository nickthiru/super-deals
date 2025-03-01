<script>
  export let name;
  export let size = 'md';
</script>

<i 
  class="icon fa-solid fa-{name}"
  class:sm={size === 'sm'}
  class:md={size === 'md'}
  class:lg={size === 'lg'}
></i>

<style>
  .icon {
    color: var(--gray-400);
  }

  .sm { font-size: var(--font-size-2); }
  .md { font-size: var(--font-size-3); }
  .lg { font-size: var(--font-size-4); }
</style>
