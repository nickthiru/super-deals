<script>
  import "../app.css";
  // import "material-dynamic-colors";
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';

  $: if (browser && !$page.data.user) {
    const publicRoutes = [
      '/public',
      '/merchants/sign-up',
      '/merchants/post-sign-up',
      '/merchants/confirm-sign-up',
      '/merchants/sign-in',
      '/customers/sign-up',
      '/customers/confirm-sign-up',
      '/customers/sign-in',
      '/admins/sign-in'
    ];

    if (!publicRoutes.some(route => $page.url.pathname.startsWith(route))) {
      goto('/public');
    }
  }
</script>


<slot />