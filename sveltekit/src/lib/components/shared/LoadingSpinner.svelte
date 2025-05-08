<!-- LoadingSpinner.svelte: Shows a loading spinner. -->
<script>
  const { size = 24, color = 'text-blue-500', className = '' } = $props();
</script>

<span class={`inline-block animate-spin ${color} ${className}`} style={`width: ${size}px; height: ${size}px;`} aria-label="Loading">
  <svg class="w-full h-full" viewBox="0 0 24 24" fill="none">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
</span>
