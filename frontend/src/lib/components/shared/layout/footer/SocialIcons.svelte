<script>
  export let title = '';
  export let icons = [];
</script>

<div class="social-container">
  <h3 class="social-title">{title}</h3>
  <div class="social-icons">
    {#each icons as icon}
      <a href={icon.href} class="social-icon" aria-label={icon.alt}>
        <img src={icon.icon} alt={icon.alt} class="icon-image" />
      </a>
    {/each}
  </div>
</div>

<style>
  .social-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .social-title {
    color: var(--text-white);
    font-size: var(--font-size-lg);
    font-weight: 700;
    margin: 0;
  }

  .social-icons {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
  }

  .social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s ease;
  }

  .social-icon:hover {
    opacity: 0.8;
  }

  .icon-image {
    width: 24px;
    height: 24px;
  }
</style>
