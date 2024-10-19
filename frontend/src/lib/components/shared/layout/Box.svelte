<script>
  export let invert = false;
</script>

<!-- <div class="box {$$props.class}">
  <slot />
</div> -->

<div
  class="box"
  class:invert
>
  <slot />
</div>

<style>
  .box {
    padding: var(--p, var(--size-2));
    border-width: var(--b, var(--border-size-2));
    border-style: solid;
    border-color: black;
    --color-light: var(--gray-0);
    --color-dark: var(--gray-12);
    color: var(--color-dark);
    background-color: var(--color-light);
  }

  .box * {
    color: inherit;
  }

  .box.invert {
    color: var(--color-light);
    background-color: var(--color-dark);
  }
</style>