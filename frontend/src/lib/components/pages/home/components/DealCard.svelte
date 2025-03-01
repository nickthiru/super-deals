<script>
  import Button from '$lib/components/shared/Button.svelte';

  export let image;
  export let discount;
  export let title;
  export let description;
  export let price;
</script>

<div class="deal-card">
  <img src={image} alt={title} />
  <div class="content">
    <span class="discount">{discount}% OFF</span>
    <h3>{title}</h3>
    <p>{description}</p>
    <div class="footer">
      <span class="price">${price}</span>
      <Button variant="primary">Buy Now</Button>
    </div>
  </div>
</div>

<style>
  .deal-card {
    background-color: var(--gray-0);
    border-radius: var(--radius-3);
    box-shadow: var(--shadow-1);
    transition: box-shadow var(--transition-ease-out);
  }

  .deal-card:hover {
    box-shadow: var(--shadow-2);
  }

  img {
    width: 100%;
    height: 12rem;
    object-fit: cover;
    border-top-left-radius: var(--radius-3);
    border-top-right-radius: var(--radius-3);
  }

  .content {
    padding: var(--size-6);
  }

  .discount {
    background-color: var(--red-100);
    color: var(--red-600);
    padding: var(--size-1) var(--size-3);
    border-radius: var(--radius-round);
    font-size: var(--font-size-1);
  }

  h3 {
    font-size: var(--font-size-4);
    font-weight: var(--font-weight-6);
    margin-top: var(--size-4);
  }

  p {
    color: var(--gray-600);
    margin-top: var(--size-2);
  }

  .footer {
    margin-top: var(--size-4);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .price {
    color: var(--brand);
    font-weight: var(--font-weight-7);
  }
</style>
