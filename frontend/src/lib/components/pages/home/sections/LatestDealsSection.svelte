<script>
  import Container from '$lib/components/shared/layout/Container.svelte';
  import DealCard from '../components/DealCard.svelte';

  const deals = [
    {
      id: 1,
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/38d1fbeabe-4612651eea8a2f604cc1.png',
      discount: 50,
      title: 'Latest Smartphone Deal',
      description: 'Get the newest model at half price',
      price: 499
    },
    {
      id: 2,
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/38a6335e8d-90bb5843b43fad273cea.png',
      discount: 30,
      title: 'Premium Headphones',
      description: 'Wireless comfort with amazing sound',
      price: 199
    },
    {
      id: 3,
      image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/0ce4a16cbc-b63478e1d07ae4bfc4be.png',
      discount: 40,
      title: 'Smart Watch Sale',
      description: 'Track your fitness in style',
      price: 299
    }
  ];
</script>

<section class="latest-deals">
  <Container>
    <div class="header">
      <h2>Latest Deals</h2>
      <span class="view-all">View All</span>
    </div>
    <div class="grid">
      {#each deals as deal (deal.id)}
        <DealCard {...deal} />
      {/each}
    </div>
  </Container>
</section>

<style>
  .latest-deals {
    background-color: var(--gray-0);
    padding-block: var(--size-16);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--size-8);
  }

  h2 {
    font-size: var(--font-size-4);
    font-weight: var(--font-weight-7);
  }

  .view-all {
    color: var(--brand);
    cursor: pointer;
  }

  .view-all:hover {
    text-decoration: underline;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-6);
  }

  @media (min-width: 768px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
