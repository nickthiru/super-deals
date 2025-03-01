<script>
  import { getContext } from "svelte";
  import "iconify-icon";
  import CategoriesItem from "./CategoriesItem.svelte";

  const categories = getContext("categories");
</script>


<div class="categories-items">
  {#each categories as category}
    <CategoriesItem {category}/>
  {/each}
</div>


<style>
  .categories-items {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
  }
</style>
