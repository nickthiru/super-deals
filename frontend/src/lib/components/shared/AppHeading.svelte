<script>
  import Container from './layout/Container.svelte';
</script>

<header class="app-heading">
  <Container>
    <div class="content">
      <a href="/public" class="logo">
        <h1>Super Deals</h1>
      </a>
      <div class="actions">
        <slot name="actions" />
      </div>
    </div>
  </Container>
</header>

<style>
  .app-heading {
    background: var(--surface-primary);
    border-bottom: 1px solid var(--border-light);
    padding: var(--size-3) 0;
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    text-decoration: none;
    color: var(--text-primary);
  }

  h1 {
    font-size: var(--font-size-4);
    font-weight: 600;
    margin: 0;
  }

  .actions {
    display: flex;
    gap: var(--size-4);
    align-items: center;
  }
</style>
