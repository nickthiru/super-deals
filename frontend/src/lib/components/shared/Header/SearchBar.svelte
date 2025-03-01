<script>
  import Icon from '../../shared/Icon/Icon.svelte';
</script>

<div class="search-bar">
  <Icon name="search" />
  <input type="text" placeholder="Search deals..." />
</div>

<style>
  .search-bar {
    display: none;
    align-items: center;
    background-color: var(--gray-100);
    border-radius: var(--radius-3);
    padding: var(--size-2) var(--size-3);
  }

  input {
    background: transparent;
    border: none;
    margin-left: var(--size-2);
    font-family: var(--font-sans);
  }

  input:focus {
    outline: none;
  }

  @media (min-width: 768px) {
    .search-bar {
      display: flex;
    }
  }
</style>
