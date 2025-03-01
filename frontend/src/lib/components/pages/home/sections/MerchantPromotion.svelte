<script>
  import Button from '$lib/components/shared/ui/buttons/Button.svelte';
</script>

<section class="merchant-section">
  <div class="merchant-container">
    <div class="merchant-content">
      <h2 class="merchant-title">Become a Super Deals Merchant</h2>
      <p class="merchant-description">
        Join thousands of successful merchants who are growing their
        business with Super Deals. Start selling today!
      </p>
      <Button variant="inverse" size="large">Start Selling Now</Button>
    </div>
  </div>
</section>

<style>
  .merchant-section {
    background-color: var(--primary-color);
    padding: var(--section-padding-y) var(--section-padding-x);
    text-align: center;
  }

  .merchant-container {
    max-width: var(--content-width);
    margin: 0 auto;
    padding: 0 var(--spacing-lg);
  }

  .merchant-content {
    max-width: 630px;
    margin: 0 auto;
  }

  .merchant-title {
    color: var(--text-white);
    font-size: var(--font-size-2xl);
    font-weight: 700;
    margin: 0;
  }

  .merchant-description {
    color: var(--text-white);
    margin: var(--spacing-lg) 0;
    line-height: 1.5;
    opacity: 0.9;
  }

  @media (max-width: 991px) {
    .merchant-section {
      padding: var(--spacing-lg) var(--section-mobile-padding);
    }

    .merchant-title {
      font-size: var(--font-size-xl);
    }
  }
</style>
