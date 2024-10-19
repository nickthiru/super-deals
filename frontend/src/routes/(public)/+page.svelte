<script>
  import { setContext } from "svelte";
  import FeaturedDeals from "$lib/components/page/home/featured-deals/FeaturedDeals.svelte";
  import Categories from "$lib/components/page/home/categories/Categories.svelte";
  import LatestDeals from "$lib/components/page/home/latest-deals/LatestDeals.svelte";

  /** @type {import('./$types').PageData} */
  export let data;

  setContext("categories", data.categories);
</script>


<div class="grid">
  <FeaturedDeals />
  <Categories/>
  <LatestDeals />
</div>


<style>
  .grid {
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-areas:
    "featured-deals"
    "categories"
    "latest-deals";
    gap: 20px;
  }
</style>
