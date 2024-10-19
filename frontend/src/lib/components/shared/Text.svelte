<script>
  export let id = "";
</script>


<p {id} class={$$props.class}>
  <slot />
</p>


<style>
p {
  font-family: var(--font-rounded-sans);
  font-size: var(--font-size-1);
  font-weight: var(--font-weight-1);
  line-height: var(--font-lineheight-2);
  letter-spacing: var(--font-letterspacing-1);
}

.bold {
  font-weight: var(--font-weight-7);
}

.lg {
  font-size: var(--font-size-3);
  font-weight: var(--font-weight-6);
  line-height: var(--font-lineheight-3);
}

.sm {
  font-size: var(--font-size-0);
}
</style>