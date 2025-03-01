<script>
  import Button from '../buttons/Button.svelte';
  
  export let image;
  export let discount;
  export let title;
  export let description;
  export let price;
  
  let imageLoaded = false;
  let imageError = false;

  function handleImageLoad() {
    imageLoaded = true;
  }

  function handleImageError() {
    imageError = true;
  }
</script>

<div class="deal-card" role="article">
  <div class="image-container">
    {#if !imageLoaded && !imageError}
      <div class="image-placeholder" />
    {/if}
    <img
      src={image}
      alt={title}
      class="deal-image"
      class:hidden={!imageLoaded}
      on:load={handleImageLoad}
      on:error={handleImageError}
    />
  </div>
  <div class="deal-content">
    <span class="discount-badge">{discount}</span>
    <h3 class="deal-title">{title}</h3>
    <p class="deal-description">{description}</p>
    <div class="deal-footer">
      <div class="deal-price">{price}</div>
      <Button variant="primary">Buy Now</Button>
    </div>
  </div>
</div>

<style>
  .deal-card {
    border-radius: 8px;
    background-color: white;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
    width: 100%;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .deal-card:hover {
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 2.06;
  }

  .image-placeholder {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--background-light);
  }

  .deal-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px 8px 0 0;
  }

  .hidden {
    display: none;
  }

  .deal-content {
    padding: var(--spacing-lg) var(--spacing-xl);
  }

  .discount-badge {
    border-radius: 9999px;
    background-color: var(--red-100);
    padding: 4px 12px;
    font-size: var(--font-size-sm);
    color: var(--red-600);
  }

  .deal-title {
    color: var(--text-color);
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin: var(--spacing-md) 0 0;
  }

  .deal-description {
    color: var(--text-muted);
    margin: var(--spacing-md) 0 0;
  }

  .deal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--spacing-lg);
  }

  .deal-price {
    color: var(--primary-color);
    font-weight: 700;
  }
</style>
