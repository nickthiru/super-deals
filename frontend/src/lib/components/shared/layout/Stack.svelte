<div class="stack">
  <slot />
</div>


<style>
  .stack {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  :global(.stack > *) {
    margin-block: 0;
  }

  :global(.stack > * + *) {
    margin-block-start: var(--space, 1.5rem);
  }
</style>