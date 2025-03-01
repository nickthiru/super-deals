<script>
  import Container from '$lib/components/shared/layout/Container.svelte';
  import CategoryCard from '$lib/components/shared/ui/cards/CategoryCard.svelte';
  import { topCategories, bottomCategories } from '../data/categories.js';

  const categories = [...topCategories, ...bottomCategories];
</script>

<section class="categories-section">
  <Container>
    <h2 class="section-title">Popular Categories</h2>
    <div class="categories-grid">
      {#each categories as category}
        <CategoryCard {...category} />
      {/each}
    </div>
  </Container>
</section>

<style>
  .categories-section {
    background-color: var(--background-light);
    padding: var(--section-padding-y) var(--section-padding-x);
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
  }

  .section-title {
    color: var(--text-color);
    font-size: var(--font-size-xl);
    font-weight: 700;
    margin: 0;
  }

  @media (max-width: 991px) {
    .categories-section {
      padding: var(--spacing-lg) var(--section-mobile-padding);
    }

    .categories-grid {
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
    }
  }
</style>
