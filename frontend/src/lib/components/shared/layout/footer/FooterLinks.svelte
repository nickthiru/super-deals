<script>
  export let title = '';
  export let links = [];
</script>

<div class="links-container">
  <h3 class="links-title">{title}</h3>
  <ul class="links-list">
    {#each links as link}
      <li class="link-item">
        <a href={link.href}>{link.title}</a>
      </li>
    {/each}
  </ul>
</div>

<style>
  .links-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .links-title {
    color: var(--text-white);
    font-size: var(--font-size-lg);
    font-weight: 700;
    margin: 0;
  }

  .links-list {
    margin: var(--spacing-md) 0 0;
    padding: 0;
    list-style-type: none;
  }

  .link-item {
    padding: 2px 0 10px;
  }

  .link-item a {
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .link-item a:hover {
    color: var(--text-white);
  }

  .link-item:not(:first-child) {
    margin-top: var(--spacing-xs);
  }
</style>
