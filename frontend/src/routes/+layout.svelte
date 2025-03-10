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

  // Track authentication state
  const authState = $state({
    initialized: false,
    error: /** @type {string|null} */ (null)
  });

  // Initialize auth store
  $effect(() => {
    const initAuth = async () => {
      try {
        await auth.initialize();
        authState.initialized = true;
      } catch (/** @type {unknown} */ error) {
        console.error('Failed to initialize auth:', error);
        authState.error = error instanceof Error ? error.message : 'Unknown authentication error';
        authState.initialized = true;
      }
    };
    
    initAuth();
  });
</script>

{@render children?.()}