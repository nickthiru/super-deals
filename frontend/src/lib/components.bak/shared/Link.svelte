<script>
  export let url = "#";
</script>

<a href={url} class={$$props.class}>
  <slot />
</a>

<style>
  a {
    color: var(--gray-12);
    text-decoration: none;
    text-align: center;
  }

  .nav {
    color: var(--blue-4);
  }
</style>