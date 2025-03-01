<script>
  import Text from "$lib/components/shared/Text.svelte";

  export let brand;
</script>

<div>
  <p>{brand.img}</p>
  <!-- <p>{brand.name}</p> -->
  <Text>{brand.name}</Text>
</div>


<style>
  div {
    display: flex;
  }
</style>