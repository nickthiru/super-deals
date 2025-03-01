<script>
  export let level = "";
  export let id = "";
  export let style = "";
</script>


<svelte:element 
  this={level}
  {id}
  class={$$props.class}
  {style}
>
  <slot />
</svelte:element>


<style>
  h1, h2, h3 {
    font-family: var(--font-rounded-sans);
    font-weight: var(--font-weight-4);
    line-height: var(--font-lineheight-1);
    letter-spacing: var(--font-letterspacing-1);
  }

  .center {
    text-align: center;
  }

  .lg {
    font-size: var(--font-size-5);
  }

  .md {
    font-size: var(--font-size-3);
  }

  .sm {
    font-size: var(--font-size-1);
  }
</style>