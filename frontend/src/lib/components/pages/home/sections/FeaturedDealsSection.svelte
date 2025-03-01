<script>
  import Container from '$lib/components/shared/layout/Container.svelte';
  import Button from '$lib/components/shared/Button.svelte';
</script>

<section class="featured-deals">
  <Container>
    <div class="hero">
      <img 
        src="https://storage.googleapis.com/uxpilot-auth.appspot.com/08a54bb237-2b943f7f359e42ed8e72.png" 
        alt="modern e-commerce featured deals carousel showing various products and discounts"
      />
      <div class="content">
        <h1>Amazing Deals</h1>
        <p>Discover the best offers from top merchants</p>
        <Button variant="primary" size="lg">Shop Now</Button>
      </div>
    </div>
  </Container>
</section>

<style>
  .featured-deals {
    background-color: var(--gray-0);
    padding-block: var(--size-12);
  }

  .hero {
    position: relative;
    height: 400px;
    border-radius: var(--radius-4);
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .content {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0,0,0,0.5), transparent);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: var(--size-12);
    color: var(--gray-0);
  }

  h1 {
    font-size: var(--font-size-6);
    font-weight: var(--font-weight-7);
    margin-bottom: var(--size-4);
  }

  p {
    font-size: var(--font-size-4);
    margin-bottom: var(--size-6);
  }
</style>
