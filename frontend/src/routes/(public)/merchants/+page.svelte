<script>
  import Box from "$lib/components/shared/layout/Box.svelte";
  import Stack from "$lib/components/shared/layout/Stack.svelte";
</script>


<!-- <Stack --space="var(--size-8)">
  <div>child 1</div>
  <div>child 2</div>
  <div>child 3</div>
</Stack> -->

<Box>
  <p>Default Box</p>
</Box>

<div style="margin-bottom: 1rem;"></div>

<Box --p="var(--size-4)" --b="var(--border-size-4)">
  <p>Box with padding and border-width</p>
</Box>

<div style="margin-bottom: 1rem;"></div>

<!-- <Box class="invert">
  <p>Box 3</p>
</Box> -->

<Box invert={true}>
  <p>Box inverted</p>
</Box>


<style>
  /* div {
    background-color: blueviolet;
  } */
</style>