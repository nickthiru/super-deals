<script>
  import Link from "$lib/components/shared/Link.svelte";
  import Text from "$lib/components/shared/Text.svelte";
  import "iconify-icon";

  export let category;
</script>

<Link url="#">
  <div 
  class="categories-item" 
  aria-labelledby={category.name}
  >
    <div class="categories-item__icon">
      <iconify-icon icon={category.icon} />
    </div>
    <div class="categories-item__text">
      <Text id={category.name} class="sm">
        {category.name}
      </Text>
    </div>
  </div>
</Link>


<style>
  .categories-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .categories-item__text {
    width: max-content;
  }
</style>