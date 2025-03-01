<script>
  import { page } from '$app/stores';

  const navItems = [
    { label: 'Front Page', href: '/public' },
    { label: 'Brands', href: '/public/brands' },
    { label: "Editor's Choice", href: '/public/editors-choice' },
    { label: 'Settings', href: '/public/settings' }
  ];
</script>

<nav class="nav">
  {#each navItems as item}
    <a 
      href={item.href} 
      class="nav-item"
      class:active={$page.url.pathname === item.href}
    >
      {item.label}
    </a>
  {/each}
</nav>

<style>
  .nav {
    display: none;
    gap: var(--size-6);
  }

  .nav-item {
    color: var(--text-secondary);
    text-decoration: none;
    padding: var(--size-2) var(--size-3);
    border-radius: var(--radius-2);
    transition: all var(--transition-base);
  }

  .nav-item:hover {
    color: var(--text-primary);
    background: var(--surface-secondary);
  }

  .nav-item.active {
    color: var(--text-primary);
    background: var(--surface-secondary);
    font-weight: 500;
  }

  @media (min-width: 768px) {
    .nav {
      display: flex;
    }
  }
</style>
