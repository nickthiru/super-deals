<script>
  import Icon from '$lib/components/shared/Icon/Icon.svelte';
  
  export let icon;
  export let title;
</script>

<div class="category-card">
  <Icon name={icon} size="lg" />
  <h3>{title}</h3>
</div>

<style>
  .category-card {
    background-color: var(--gray-0);
    border-radius: var(--radius-3);
    padding: var(--size-6);
    box-shadow: var(--shadow-1);
    transition: box-shadow var(--transition-ease-out);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .category-card:hover {
    box-shadow: var(--shadow-2);
  }

  h3 {
    margin-top: var(--size-4);
    font-weight: var(--font-weight-6);
  }
</style>
