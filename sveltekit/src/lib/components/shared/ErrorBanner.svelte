<!-- ErrorBanner.svelte: Displays an error message in a consistent, accessible style. -->
<script>
  const { message = '', dismissible = false } = $props();
  let visible = $state(true);

  function dismiss() {
    visible = false;
  }
</script>

{#if visible && message}
  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
    <span class="block sm:inline">{message}</span>
    {#if dismissible}
      <button class="ml-auto p-1" aria-label="Dismiss" onclick={dismiss}>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    {/if}
  </div>
{/if}

<style>
  /* Add any additional styling here if needed */
</style>
