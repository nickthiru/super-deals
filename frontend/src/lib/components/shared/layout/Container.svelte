<script>
  /** @type {string} */
  export let className = '';
</script>

<div class="container mx-auto px-6 {className}">
  <slot />
</div>

<style>
  .container {
    width: 100%;
    max-width: var(--max-width-content);
    margin-inline: auto;
  }
</style>
