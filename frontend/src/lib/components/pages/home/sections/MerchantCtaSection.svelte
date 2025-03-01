<script>
  import Container from '$lib/components/shared/layout/Container.svelte';
</script>

<section class="merchant-cta">
  <Container>
    <div class="content">
      <h2>Become a Super Deals Merchant</h2>
      <p>Join thousands of successful merchants who are growing their business with Super Deals. Start selling today!</p>
      <span class="cta-button">Start Selling Now</span>
    </div>
  </Container>
</section>

<style>
  .merchant-cta {
    background-color: var(--brand);
    padding-block: var(--size-16);
  }

  .content {
    text-align: center;
  }

  h2 {
    color: var(--gray-0);
    font-size: var(--font-size-5);
    font-weight: var(--font-weight-7);
    margin-bottom: var(--size-4);
  }

  p {
    color: color-mix(in srgb, var(--gray-0) 80%, transparent);
    margin-bottom: var(--size-8);
    max-width: var(--size-content-2);
    margin-inline: auto;
  }

  .cta-button {
    display: inline-block;
    background-color: var(--gray-0);
    color: var(--brand);
    padding: var(--size-4) var(--size-8);
    border-radius: var(--radius-3);
    font-weight: var(--font-weight-6);
    cursor: pointer;
    transition: background-color var(--transition-ease-out);
  }

  .cta-button:hover {
    background-color: var(--gray-100);
  }
</style>
