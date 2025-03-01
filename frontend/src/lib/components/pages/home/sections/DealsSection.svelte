<script>
  import DealCard from '$lib/components/shared/ui/cards/DealCard.svelte';
  import { featuredDeals } from '../data/deals.js';
</script>

<section class="deals-section">
  <div class="deals-container">
    <div class="section-header">
      <h2 class="section-title">Latest Deals</h2>
      <a href="/deals" class="view-all-link">View All</a>
    </div>
    <div class="deals-grid">
      {#each featuredDeals as deal}
        <DealCard {...deal} />
      {/each}
    </div>
  </div>
</section>

<style>
  .deals-section {
    background-color: var(--background-white);
    padding: var(--section-padding-y) var(--section-padding-x);
  }

  .deals-container {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .section-title {
    color: var(--text-color);
    font-size: var(--font-size-xl);
    font-weight: 700;
    margin: 0;
  }

  .view-all-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s ease;
  }

  .view-all-link:hover {
    opacity: 0.8;
  }

  .deals-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
  }

  @media (max-width: 991px) {
    .deals-section {
      padding: var(--spacing-lg) var(--section-mobile-padding);
    }

    .deals-grid {
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
    }
  }
</style>
