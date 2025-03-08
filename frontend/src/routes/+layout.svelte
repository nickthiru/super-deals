<script>
  import { auth } from '$lib/stores/auth';
  import '../app.css';
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
  // Uncomment the line below to use Font Awesome from npm instead of CDN
  // import '@fortawesome/fontawesome-free/css/all.min.css';
 
  /** @type {import('./$types').LayoutData | null} */
  export const data = null;

  $effect(() => {
    auth.initialize();
  })
</script>

{@render children?.()}