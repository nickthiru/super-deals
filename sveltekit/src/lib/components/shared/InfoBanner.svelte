<!-- InfoBanner.svelte: Displays a success or informational message in a consistent, accessible style. -->
<script>
  const { message = '', type = 'info', dismissible = false } = $props();
  let visible = $state(true);

  function dismiss() {
    visible = false;
  }

  // Choose color based on type
  const colorClass = $derived(() => {
    if (type === 'success') return 'bg-green-100 border-green-400 text-green-700';
    if (type === 'warning') return 'bg-yellow-100 border-yellow-400 text-yellow-700';
    return 'bg-blue-100 border-blue-400 text-blue-700';
  });
</script>

{#if visible && message}
  <div class={`border px-4 py-3 rounded relative flex items-center gap-2 ${colorClass}`} role="status">
    <span class="block sm:inline">{message}</span>
    {#if dismissible}
      <button class="ml-auto p-1" aria-label="Dismiss" onclick={dismiss}>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    {/if}
  </div>
{/if}
