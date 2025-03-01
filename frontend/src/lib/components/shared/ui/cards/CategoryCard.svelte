<script>
  export let icon;
  export let name;
  export let href = `/category/${name.toLowerCase()}`;
</script>

<a {href} class="category-card">
  <div class="category-content">
    <img src={icon} alt={name} class="category-icon" />
    <h3 class="category-name">{name}</h3>
  </div>
</a>

<style>
  .category-card {
    border-radius: 8px;
    background-color: white;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
    padding: 24px;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: block;
  }

  .category-card:hover {
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .category-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
  }

  .category-icon {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  .category-name {
    color: var(--text-color);
    font-size: var(--font-size-base);
    font-weight: 600;
    margin: 0;
    text-align: center;
  }
</style>
