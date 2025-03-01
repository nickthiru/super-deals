<script>
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  import '../app.css';
  // Uncomment the line below to use Font Awesome from npm instead of CDN
  // import '@fortawesome/fontawesome-free/css/all.min.css';
 
  /** @type {import('./$types').LayoutData | null} */
  export const data = null;

  onMount(() => {
    auth.initialize();
  });
</script>

<slot />